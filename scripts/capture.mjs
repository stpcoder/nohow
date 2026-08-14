import assert from 'node:assert/strict'
import { mkdir, rename } from 'node:fs/promises'
import { chromium } from 'playwright'

const baseUrl = (process.env.YOGIMAN_BASE_URL || 'http://127.0.0.1:4173/yogiman-ai').replace(/\/$/, '')
const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
})
await mkdir('qa/screenshots', { recursive: true })
await mkdir('qa/video/raw', { recursive: true })

const videoViewport = { width: 1440, height: 900 }

const pause = (page, milliseconds) => page.waitForTimeout(milliseconds)

async function installCaptureEffects(page) {
  await page.evaluate(() => {
    const style = document.createElement('style')
    style.dataset.captureEffects = 'true'
    style.textContent = `
      html, body { overflow: hidden !important; background: #101522; }
      #capture-cursor { position: fixed; left: 84px; top: 760px; width: 34px; height: 38px; z-index: 2147483647; pointer-events: none; filter: drop-shadow(0 4px 7px rgba(8, 14, 30, .35)); transition-property: left, top; transition-timing-function: cubic-bezier(.22, 1, .36, 1); }
      #capture-cursor svg { display: block; width: 100%; height: 100%; }
      .capture-click-ring { position: fixed; width: 22px; height: 22px; margin: -11px 0 0 -11px; border: 3px solid #baff38; border-radius: 50%; z-index: 2147483646; pointer-events: none; animation: capturePulse 720ms cubic-bezier(.16, 1, .3, 1) forwards; }
      @keyframes capturePulse { from { opacity: 1; transform: scale(.45); } to { opacity: 0; transform: scale(3.2); } }
    `
    document.head.appendChild(style)

    const cursor = document.createElement('div')
    cursor.id = 'capture-cursor'
    cursor.innerHTML = `<svg viewBox="0 0 34 38" aria-hidden="true"><path d="M4 3.2 28 22.5l-11.1 1.3 6.1 9.5-5.7 3.1-5.9-9.7-6.6 8.8L4 3.2Z" fill="#fff" stroke="#111827" stroke-width="2.4" stroke-linejoin="round"/><circle cx="27.5" cy="8" r="4.5" fill="#baff38" stroke="#111827" stroke-width="1.6"/></svg>`
    document.body.appendChild(cursor)
  })
}

async function moveCursorTo(page, locator, duration = 950, position = { x: .5, y: .5 }) {
  await locator.scrollIntoViewIfNeeded()
  await pause(page, 240)
  const box = await locator.boundingBox()
  assert(box, 'Cursor target is not visible')
  const x = box.x + box.width * position.x
  const y = box.y + box.height * position.y
  await page.evaluate(({ x, y, duration }) => {
    const cursor = document.querySelector('#capture-cursor')
    cursor.style.transitionDuration = `${duration}ms`
    cursor.style.left = `${x - 4}px`
    cursor.style.top = `${y - 4}px`
  }, { x, y, duration })
  await page.mouse.move(x, y, { steps: 28 })
  await pause(page, duration + 120)
  return { x, y }
}

async function clickWithFocus(page, locator, options = {}) {
  const { moveDuration = 900, holdAfter = 650, position = { x: .5, y: .5 } } = options
  const point = await moveCursorTo(page, locator, moveDuration, position)
  await page.evaluate(({ x, y }) => {
    const ring = document.createElement('div')
    ring.className = 'capture-click-ring'
    ring.style.left = `${x}px`
    ring.style.top = `${y}px`
    document.body.appendChild(ring)
    window.setTimeout(() => ring.remove(), 760)
  }, point)
  await locator.click()
  await pause(page, holdAfter)
}

async function typeWithCursor(page, locator, value, options = {}) {
  const { delay = 85, holdAfter = 500 } = options
  await locator.focus()
  for (const character of value) {
    await page.keyboard.insertText(character)
    await pause(page, delay)
  }
  await pause(page, holdAfter)
}

async function verifyLanding() {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
  const pageErrors = []
  desktop.on('pageerror', (error) => pageErrors.push(error.message))
  await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
  await desktop.screenshot({ path: 'qa/screenshots/landing-desktop.png', fullPage: true })
  assert.equal(await desktop.locator('h1').filter({ hasText: '필요한 메뉴만 정리해주는' }).count(), 1)
  assert.equal(await desktop.locator('video[aria-label="여기만 회원 해지 POC 데모 영상"]').count(), 1)
  assert.match(await desktop.locator('video source').getAttribute('src'), /yogiman-demo.*\.mp4/)
  assert.deepEqual(pageErrors, [])
  await desktop.close()

  const cover = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await cover.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
  await cover.screenshot({ path: 'qa/screenshots/landing-capture-1200x630.png' })
  await cover.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true })
  await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
  const dimensions = await mobile.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }))
  assert.equal(dimensions.scrollWidth, dimensions.innerWidth, `mobile overflow: ${JSON.stringify(dimensions)}`)
  await mobile.screenshot({ path: 'qa/screenshots/landing-mobile.png', fullPage: true })
  await mobile.close()
}

async function verifyDemo() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.goto(`${baseUrl}/demo`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: 'qa/screenshots/demo-start.png' })
  await page.getByRole('button', { name: /사이트 안전 탐색 시작/ }).click()
  await page.getByText('사이트 확인 완료').waitFor({ timeout: 7000 })
  for (const label of ['복지 포인트', '제휴 복지몰', '회원관리']) {
    await page.locator(`[data-trace-target="${label}"]`).click()
  }
  await page.getByRole('heading', { name: '관련 업무를 찾았어요.' }).waitFor()
  await pause(page, 700)
  await page.screenshot({ path: 'qa/screenshots/demo-context-inference.png' })
  await page.getByRole('button', { name: /찾던 업무가 맞아요/ }).click()
  await page.getByRole('heading', { name: /제휴 복지몰/ }).waitFor()
  await pause(page, 700)
  await page.screenshot({ path: 'qa/screenshots/demo-withdraw-result.png' })
  await page.getByRole('button', { name: '약관 열기' }).click()
  await page.locator('#original-terms').waitFor()
  await page.locator('#original-terms').click()
  await page.locator('.legacy-modal').waitFor()
  await page.locator('.legacy-modal > button').click()
  await page.getByRole('button', { name: /원본 신청 화면으로 안내/ }).click()
  await page.locator('#original-confirm').waitFor()
  assert.equal(await page.locator('#original-confirm').getAttribute('class'), 'yogi-highlight')
  await pause(page, 500)
  await page.screenshot({ path: 'qa/screenshots/demo-original-highlight.png' })
  await page.locator('.legacy-form-table select').selectOption({ label: '이용 빈도가 낮음' })
  await page.locator('#original-confirm input').check()
  await page.getByRole('button', { name: '회원 해지 신청', exact: true }).click()
  await page.getByRole('heading', { name: '회원 해지 신청을 완료했어요!' }).waitFor()
  await pause(page, 700)
  await page.screenshot({ path: 'qa/screenshots/demo-success.png' })
  assert.deepEqual(pageErrors, [])
  await page.close()
}

async function recordWalkthrough() {
  const context = await browser.newContext({
    viewport: videoViewport,
    recordVideo: { dir: 'qa/video/raw', size: videoViewport },
  })
  const page = await context.newPage()
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
  await installCaptureEffects(page)
  await pause(page, 3000)

  const demoButton = page.getByRole('button', { name: /회원 해지 데모 보기/ })
  await clickWithFocus(page, demoButton, { moveDuration: 1100, holdAfter: 900 })
  await pause(page, 2600)

  const scanButton = page.getByRole('button', { name: /사이트 안전 탐색 시작/ })
  await clickWithFocus(page, scanButton, { moveDuration: 1100, holdAfter: 500 })
  await pause(page, 1950)
  await page.getByText('사이트 확인 완료').waitFor({ timeout: 9000 })
  await pause(page, 2300)

  // Recent menu clicks are compared with the site's registered work map.
  for (const [label, holdAfter] of [['복지 포인트', 1300], ['제휴 복지몰', 1300], ['회원관리', 2100]]) {
    const menuItem = page.locator(`[data-trace-target="${label}"]`)
    await clickWithFocus(page, menuItem, { moveDuration: 1050, holdAfter })
  }
  await page.getByRole('heading', { name: '관련 업무를 찾았어요.' }).waitFor()
  await pause(page, 2500)

  const confirmIntent = page.getByRole('button', { name: /찾던 업무가 맞아요/ })
  await clickWithFocus(page, confirmIntent, { moveDuration: 950, holdAfter: 950 })
  await page.getByRole('heading', { name: '제휴 복지몰 회원 해지 신청' }).waitFor()
  await pause(page, 2300)

  const termsButton = page.getByRole('button', { name: '약관 열기' })
  await clickWithFocus(page, termsButton, { moveDuration: 1050, holdAfter: 800 })
  await page.locator('#original-terms').waitFor()
  await pause(page, 5100)
  await clickWithFocus(page, page.locator('#original-terms'), { moveDuration: 1000, holdAfter: 800 })
  await page.locator('.legacy-modal').waitFor()
  await pause(page, 2250)
  const termsConfirm = page.locator('.legacy-modal > button')
  await clickWithFocus(page, termsConfirm, { moveDuration: 950, holdAfter: 900 })

  await pause(page, 2500)
  const guideButton = page.getByRole('button', { name: /원본 신청 화면으로 안내/ })
  await clickWithFocus(page, guideButton, { moveDuration: 1050, holdAfter: 900 })
  await page.locator('#original-confirm').waitFor()
  await pause(page, 3750)

  const reasonSelect = page.locator('.legacy-form-table select')
  await moveCursorTo(page, reasonSelect, 1000)
  await reasonSelect.selectOption({ label: '이용 빈도가 낮음' })
  await pause(page, 1800)

  const consent = page.locator('#original-confirm input')
  await clickWithFocus(page, consent, { moveDuration: 1000, holdAfter: 1700 })
  const submitButton = page.getByRole('button', { name: '회원 해지 신청', exact: true })
  await pause(page, 4700)
  await clickWithFocus(page, submitButton, { moveDuration: 900, holdAfter: 1200 })

  await page.getByRole('heading', { name: '회원 해지 신청을 완료했어요!' }).waitFor()
  await pause(page, 7700)

  const video = page.video()
  await context.close()
  const sourcePath = await video.path()
  await rename(sourcePath, 'qa/video/yogiman-demo.webm')
}

try {
  await verifyLanding()
  await verifyDemo()
  if (process.env.YOGIMAN_SKIP_VIDEO !== '1') await recordWalkthrough()
  console.log('Visual QA and interaction capture completed.')
} finally {
  await browser.close()
}
