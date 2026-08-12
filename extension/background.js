const CONTENT_SCRIPT_ID = 'yogiman-content-script'

const traceKey = (tabId) => `trace:${tabId}`

async function appendTrace(tabId, event) {
  const key = traceKey(tabId)
  const stored = await chrome.storage.session.get(key)
  const current = Array.isArray(stored[key]) ? stored[key] : []
  const clean = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: String(event?.label || '').replace(/\s+/g, ' ').trim().slice(0, 100),
    group: String(event?.group || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    kind: String(event?.kind || '실행').slice(0, 20),
    path: String(event?.path || '').slice(0, 160),
    at: Number(event?.at) || Date.now(),
  }
  if (!clean.label) return current
  const deduplicated = current.filter((item) => item.label !== clean.label)
  const next = [...deduplicated, clean].slice(-5)
  await chrome.storage.session.set({ [key]: next })
  return next
}

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab
}

async function ensureContentScript(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'YOGIMAN_PING' })
    return
  } catch {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] })
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
})

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.windowId || !/^https?:/.test(tab.url || '')) return
  await ensureContentScript(tab.id)
  await chrome.sidePanel.open({ windowId: tab.windowId })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.type?.startsWith('YOGIMAN_')) return false
  ;(async () => {
    if (message.type === 'YOGIMAN_TRACE_EVENT' && sender.tab?.id) {
      const trace = await appendTrace(sender.tab.id, message.event)
      sendResponse({ ok: true, trace })
      return
    }
    const tab = await activeTab()
    if (!tab?.id || !/^https?:/.test(tab.url || '')) {
      sendResponse({ ok: false, error: '일반 웹페이지에서 다시 시도해 주세요.' })
      return
    }
    if (message.type === 'YOGIMAN_GET_TRACE') {
      const key = traceKey(tab.id)
      const stored = await chrome.storage.session.get(key)
      sendResponse({ ok: true, trace: stored[key] || [] })
      return
    }
    if (message.type === 'YOGIMAN_CLEAR_TRACE') {
      await chrome.storage.session.remove(traceKey(tab.id))
      sendResponse({ ok: true })
      return
    }
    await ensureContentScript(tab.id)
    const response = await chrome.tabs.sendMessage(tab.id, message)
    sendResponse(response)
  })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }))
  return true
})
