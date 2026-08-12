const app = document.querySelector('#app')
const statusEl = document.querySelector('#status')
let inventory = null
let tracePoll = null
let currentMatch = null

const templates = {
  start: document.querySelector('#start-template'),
  loading: document.querySelector('#loading-template'),
  ready: document.querySelector('#ready-template'),
  result: document.querySelector('#result-template'),
}

function render(name) {
  if (tracePoll) window.clearInterval(tracePoll)
  tracePoll = null
  app.replaceChildren(templates[name].content.cloneNode(true))
}

function send(message) {
  return chrome.runtime.sendMessage(message)
}

function escapeHtml(value) {
  const element = document.createElement('span')
  element.textContent = String(value || '')
  return element.innerHTML
}

function startScreen() {
  render('start')
  document.querySelector('#scan').addEventListener('click', runScan)
}

async function runScan() {
  render('loading')
  statusEl.innerHTML = '<i></i> 읽는 중'
  const messages = ['메뉴 구조 읽기', '버튼과 링크 분류', '입력 흐름 연결', '주의 행동 표시', '업무 지도 완성']
  let progress = 0
  const timer = setInterval(() => {
    progress = Math.min(progress + 20, 100)
    document.querySelector('.progress i').style.width = `${progress}%`
    document.querySelector('#progress-value').textContent = `${progress}%`
    const index = Math.min(progress / 20 - 1, messages.length - 1)
    document.querySelector('#loading-title').textContent = `${messages[index]} 중`
    document.querySelector('#load-list').innerHTML = messages.slice(0, index + 1).map((message) => `<p>${message}</p>`).join('')
  }, 700)

  const response = await send({ type: 'YOGIMAN_SCAN' })
  await new Promise((resolve) => setTimeout(resolve, 3650))
  clearInterval(timer)
  if (!response?.ok) {
    statusEl.textContent = '연결 필요'
    app.innerHTML = `<section><p class="eyebrow">연결할 수 없어요</p><h1>일반 웹페이지에서<br>다시 열어 주세요.</h1><p class="body-copy">${escapeHtml(response?.error || 'Chrome 내부 페이지와 확장 프로그램 스토어에서는 작동하지 않습니다.')}</p><button class="primary" id="retry">다시 시도</button></section>`
    document.querySelector('#retry').addEventListener('click', startScreen)
    return
  }
  inventory = response
  readyScreen()
}

async function readyScreen() {
  render('ready')
  statusEl.innerHTML = '<i></i> 연결됨'
  document.querySelector('#page-title').textContent = inventory.page.title
  document.querySelector('#site-stats').textContent = `${inventory.stats.total}개 버튼·링크 · ${inventory.stats.forms}개 입력 화면 · 확인이 필요한 행동 ${inventory.stats.cautions}개`
  document.querySelector('#rescan').addEventListener('click', runScan)
  document.querySelector('#clear-trace').addEventListener('click', async () => {
    await send({ type: 'YOGIMAN_CLEAR_TRACE' })
    await refreshContext()
  })
  await refreshContext()
  tracePoll = window.setInterval(refreshContext, 900)
}

async function refreshContext() {
  const container = document.querySelector('#context-content')
  if (!container) return
  const response = await send({ type: 'YOGIMAN_GET_TRACE' })
  const trace = response?.ok ? response.trace || [] : []
  currentMatch = globalThis.YogimanIntent.infer(trace)
  renderContext(container, trace, currentMatch)
}

function renderContext(container, trace, match) {
  if (!trace.length) {
    container.innerHTML = `
      <p class="eyebrow">최근 이동 경로를 확인합니다</p>
      <h1>하던 일을 이어가세요.</h1>
      <p class="body-copy">이 탭에서 평소처럼 메뉴를 눌러보세요. 최근에 누른 메뉴와 사이트의 업무 지도를 대조합니다.</p>
      <div class="trace-empty"><b>↖</b><p><strong>먼저 관련 메뉴를 눌러보세요</strong><span>입력값은 읽지 않고 버튼·링크 이름만 이 탭에 보관합니다.</span></p></div>
      <div class="privacy">✓ 텍스트 입력값 저장 안 함 · 최근 클릭 최대 5개</div>`
    return
  }

  const evidenceCount = match?.evidence?.length || 0
  const traceRows = trace.map((event, index) => `
    <div class="trace-row ${index === trace.length - 1 ? 'latest' : ''}">
      <i>${index + 1}</i><p><strong>${escapeHtml(event.label)}</strong><span>${escapeHtml(event.group || event.kind)}</span></p><b>✓</b>
    </div>`).join('')
  const graphPath = match?.path?.map((node, index) => `<span class="${index < Math.max(evidenceCount, 1) ? 'active' : ''}">${escapeHtml(node)}</span>`).join('') || ''

  container.innerHTML = `
    <p class="eyebrow">최근에 누른 메뉴</p>
    <h1>${match?.ready ? '관련 업무를 찾았어요.' : '관련 업무를 찾고 있어요.'}</h1>
    <div class="context-stack">
      <article class="trace-card"><div class="card-head"><span>최근 이동 경로</span><b>${trace.length}/5</b></div>${traceRows}</article>
      <div class="bridge ${match?.ready ? 'matched' : ''}"><span>${match?.ready ? `최근 메뉴 ${evidenceCount}개가 같은 업무와 연결됨` : '사이트 업무 지도와 비교 중'}</span></div>
      <article class="graph-card ${match?.ready ? 'matched' : ''}"><div class="card-head"><span>사이트 업무 지도</span><b>v1.0</b></div>${match ? `<h2>${escapeHtml(match.title)}</h2><div class="graph-path">${graphPath}</div>` : '<p class="graph-wait">관련 업무를 찾는 중입니다.</p>'}</article>
    </div>
    ${match?.ready ? `<div class="proposal"><span>찾은 업무</span><strong>${escapeHtml(match.title)}</strong><small>최근에 누른 메뉴 ${evidenceCount}개가 이 업무와 연결됩니다.</small><button class="primary" id="confirm-intent">찾던 업무가 맞아요 →</button></div>` : '<p class="context-hint">↖ 관련 메뉴를 한두 번 더 눌러보세요.</p>'}`
  document.querySelector('#confirm-intent')?.addEventListener('click', () => showResults(match))
}

function capabilityTerms(match) {
  return [...new Set([
    match.title,
    ...match.path,
    ...match.signals.map(([term]) => term),
  ].flatMap((term) => String(term).split(/[\s·›/]+/)).filter((term) => term.length >= 2))]
}

function findMatches(match) {
  const terms = capabilityTerms(match)
  return inventory.items
    .map((item) => {
      const target = globalThis.YogimanIntent.normalize(item.text)
      const matchedTerms = terms.filter((term) => target.includes(globalThis.YogimanIntent.normalize(term)))
      const kindBonus = item.kind === '메뉴' ? 1.5 : item.kind === '실행' ? 1 : 0
      return { ...item, score: matchedTerms.length * 3 + kindBonus, matches: matchedTerms }
    })
    .filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score)
    .filter((item, index, list) => list.findIndex((candidate) => candidate.text === item.text) === index)
    .slice(0, 5)
}

function showResults(match) {
  const matches = findMatches(match)
  render('result')
  document.querySelector('#quote').textContent = match.path.join(' → ')
  document.querySelector('#found-label').textContent = `최근에 누른 메뉴 ${match.evidence.length}개로 찾았어요`
  document.querySelector('#result-title').textContent = match.title
  document.querySelector('#result-copy').textContent = matches.length
    ? '업무 지도에 등록된 원본 위치를 표시합니다. 실제 클릭과 최종 결정은 직접 진행합니다.'
    : '현재 화면에서 실행 버튼을 찾지 못했습니다. 안내된 메뉴로 이동한 뒤 사이트를 다시 확인해 주세요.'
  const list = document.querySelector('#result-list')
  list.innerHTML = matches.map((item, index) => `
    <article class="result-item ${item.risk === 'confirm' ? 'caution' : ''}">
      <div class="result-top"><span>${escapeHtml(item.kind)}</span>${item.risk === 'confirm' ? '<i>사람 확인 필요</i>' : ''}</div>
      <h2>${escapeHtml(item.text.slice(0, 82))}</h2>
      <p>찾은 기준: ${escapeHtml(item.matches.join(' · '))}</p>
      <button data-index="${index}">원본 위치 표시</button>
    </article>`).join('')
  list.querySelectorAll('button').forEach((button) => button.addEventListener('click', async () => {
    const item = matches[Number(button.dataset.index)]
    const response = await send({ type: 'YOGIMAN_HIGHLIGHT', id: item.id })
    button.textContent = response?.ok ? '원본에 표시했어요 · 직접 클릭하세요' : '화면이 바뀌었어요 · 다시 읽어주세요'
  }))
  document.querySelector('#back').addEventListener('click', readyScreen)
}

startScreen()
