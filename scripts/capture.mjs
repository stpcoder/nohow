import assert from 'node:assert/strict'
import { mkdir, rename, rm } from 'node:fs/promises'
import { chromium } from 'playwright'

const baseUrl = (process.env.NOHOW_BASE_URL || 'http://127.0.0.1:4173/yogiman-ai').replace(/\/$/, '')
const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
await mkdir('qa/screenshots', { recursive: true })
await mkdir('qa/video/raw', { recursive: true })
const videoViewport = { width: 1440, height: 900 }
const pause = (page, milliseconds) => page.waitForTimeout(milliseconds)

async function installCaptureEffects(page) {
  await page.evaluate(() => {
    const style = document.createElement('style')
    style.dataset.captureEffects = 'true'
    style.textContent = `
      html, body { overflow: hidden !important; background: #111827; }
      #capture-cursor { position: fixed; left: 80px; top: 760px; width: 34px; height: 38px; z-index: 2147483647; pointer-events: none; filter: drop-shadow(0 4px 7px rgba(8,14,30,.35)); transition-property: left,top; transition-timing-function: cubic-bezier(.22,1,.36,1); }
      #capture-cursor svg { display: block; width: 100%; height: 100%; }
      .capture-click-ring { position: fixed; width: 22px; height: 22px; margin: -11px 0 0 -11px; border: 3px solid #baff38; border-radius: 50%; z-index: 2147483646; pointer-events: none; animation: capturePulse 720ms cubic-bezier(.16,1,.3,1) forwards; }
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
  await pause(page, 180)
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
  await page.mouse.move(x, y, { steps: 30 })
  await pause(page, duration + 100)
  return { x, y }
}

async function clickWithFocus(page, locator, options = {}) {
  const { moveDuration = 950, holdAfter = 900, position = { x: .5, y: .5 } } = options
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
  const { delay = 80, holdAfter = 800 } = options
  await moveCursorTo(page, locator, 850)
  await locator.focus()
  for (const character of value) {
    await page.keyboard.insertText(character)
    await pause(page, delay)
  }
  await pause(page, holdAfter)
}

async function completeCaptureWork(page, paced = false) {
  const click = (locator, holdAfter = 500) => paced ? clickWithFocus(page, locator, { moveDuration: 950, holdAfter }) : locator.click()
  await click(page.getByRole('button', { name: '매뉴얼 만들기', exact: true }), paced ? 1700 : 0)
  await click(page.getByRole('button', { name: /TR-2026-0812 출장비 정산/ }), paced ? 2500 : 0)
  await click(page.getByRole('button', { name: 'Excel 열기' }), paced ? 1500 : 0)
  await click(page.locator('.nh-sheet tbody tr').filter({ hasText: 'TR-2026-0812' }), paced ? 2200 : 0)
  await click(page.getByRole('button', { name: '파일 탐색기 열기' }), paced ? 1500 : 0)
  await click(page.getByRole('button', { name: /숙박_영수증.pdf/ }), paced ? 2200 : 0)
  await click(page.getByRole('button', { name: '통합업무포털 열기' }), paced ? 1700 : 0)
  await click(page.locator('.nh-portal-form label button'), paced ? 1600 : 0)
  const reason = page.getByRole('textbox', { name: '보완 사유' })
  if (paced) await typeWithCursor(page, reason, '숙박 영수증을 추가 첨부합니다.', { delay: 55, holdAfter: 1200 })
  else await reason.fill('숙박 영수증을 추가 첨부합니다.')
  await click(page.getByRole('button', { name: '보완 자료 제출', exact: true }), paced ? 2500 : 0)
  await click(page.getByRole('button', { name: '기록 종료하고 매뉴얼 만들기' }), paced ? 1200 : 0)
}

async function verifyLanding() {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
  const pageErrors = []
  desktop.on('pageerror', (error) => pageErrors.push(error.message))
  await desktop.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
  await desktop.screenshot({ path: 'qa/screenshots/landing-desktop.png', fullPage: true })
  assert.equal(await desktop.getByText('기록되지 않은 업무 경험은 조직에 남아 있지 않습니다.').count(), 1)
  assert.equal(await desktop.getByLabel('NoHow 출장비 정산 보완 POC 데모 영상').count(), 1)
  assert.deepEqual(pageErrors, [])
  await desktop.close()

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true })
  await mobile.goto(`${baseUrl}/`, { waitUntil: 'networkidle' })
  const dimensions = await mobile.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }))
  assert.equal(dimensions.scrollWidth, dimensions.innerWidth, `mobile overflow: ${JSON.stringify(dimensions)}`)
  await mobile.screenshot({ path: 'qa/screenshots/landing-mobile.png', fullPage: true })
  await mobile.close()
}

async function verifyDemo() {
  const page = await browser.newPage({ viewport: videoViewport, deviceScaleFactor: 1 })
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.goto(`${baseUrl}/#/demo`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: 'qa/screenshots/nohow-demo-start.png' })
  await completeCaptureWork(page)
  await page.getByRole('heading', { name: '업무 과정을 매뉴얼로 정리하고 있습니다.' }).waitFor()
  await page.getByRole('button', { name: '구성원들과 공유하기' }).waitFor({ timeout: 6000 })
  await page.screenshot({ path: 'qa/screenshots/nohow-demo-manual.png' })
  await page.getByRole('button', { name: '구성원들과 공유하기' }).click()
  await page.getByRole('heading', { name: '업무 매뉴얼을 공유했습니다.' }).waitFor()
  await page.screenshot({ path: 'qa/screenshots/nohow-demo-shared.png' })
  await page.getByRole('button', { name: /다른 구성원의 화면/ }).click()
  await page.getByRole('textbox', { name: '업무 매뉴얼 검색' }).fill('출장비 정산 보완은 어떻게 하지?')
  await page.getByRole('button', { name: /출장비 정산 보완/ }).click()
  for (let step = 0; step < 5; step += 1) await page.locator('.nh-guide-target').click()
  await page.getByRole('heading', { name: '출장비 정산 보완을 완료했습니다.' }).waitFor()
  await page.screenshot({ path: 'qa/screenshots/nohow-demo-success.png' })
  assert.deepEqual(pageErrors, [])
  await page.close()
}

async function recordWalkthrough() {
  await rm('qa/video/nohow-demo.webm', { force: true })
  const context = await browser.newContext({ viewport: videoViewport, recordVideo: { dir: 'qa/video/raw', size: videoViewport } })
  const page = await context.newPage()
  await page.goto(`${baseUrl}/#/demo`, { waitUntil: 'networkidle' })
  await installCaptureEffects(page)
  await pause(page, 4200)

  await completeCaptureWork(page, true)
  await page.getByRole('heading', { name: '업무 과정을 매뉴얼로 정리하고 있습니다.' }).waitFor()
  await pause(page, 2600)
  await page.getByRole('button', { name: '구성원들과 공유하기' }).waitFor({ timeout: 6000 })
  await pause(page, 5200)

  await clickWithFocus(page, page.getByRole('button', { name: '구성원들과 공유하기' }), { moveDuration: 1050, holdAfter: 1000 })
  await page.getByRole('heading', { name: '업무 매뉴얼을 공유했습니다.' }).waitFor()
  await pause(page, 3700)
  await clickWithFocus(page, page.getByRole('button', { name: /다른 구성원의 화면/ }), { moveDuration: 1000, holdAfter: 1200 })
  await pause(page, 2200)

  const search = page.getByRole('textbox', { name: '업무 매뉴얼 검색' })
  await typeWithCursor(page, search, '출장비 정산 보완은 어떻게 하지?', { delay: 75, holdAfter: 1900 })
  await clickWithFocus(page, page.getByRole('button', { name: /출장비 정산 보완/ }), { moveDuration: 1000, holdAfter: 1500 })
  await pause(page, 2500)

  for (const holdAfter of [2600, 2400, 2400, 2500, 1300]) {
    await clickWithFocus(page, page.locator('.nh-guide-target'), { moveDuration: 1000, holdAfter })
  }
  await page.getByRole('heading', { name: '출장비 정산 보완을 완료했습니다.' }).waitFor()
  await pause(page, 7500)

  const video = page.video()
  await context.close()
  const sourcePath = await video.path()
  await rename(sourcePath, 'qa/video/nohow-demo.webm')
}

try {
  await verifyLanding()
  await verifyDemo()
  if (process.env.NOHOW_SKIP_VIDEO !== '1') await recordWalkthrough()
  console.log('NoHow visual QA and interaction capture completed.')
} finally {
  await browser.close()
}
