(() => {
  if (window.__YOGIMAN_CONTENT_READY__) return
  window.__YOGIMAN_CONTENT_READY__ = true

  const elementMap = new Map()
  let activeBadge = null
  let activeElement = null

  const isVisible = (element) => {
    const style = window.getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 1 && rect.height > 1
  }

  const elementText = (element) => {
    const labelledBy = element.getAttribute('aria-labelledby')
    const labelText = labelledBy
      ? labelledBy.split(' ').map((id) => document.getElementById(id)?.innerText || '').join(' ')
      : ''
    const associatedLabel = element.id ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.innerText : ''
    return [
      element.getAttribute('aria-label'), labelText, associatedLabel, element.innerText,
      element.getAttribute('placeholder'), element.getAttribute('title'), element.name,
    ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().slice(0, 180)
  }

  const inferKind = (element) => {
    if (element.matches('input,textarea,select')) return '입력'
    if (element.matches('a')) return '이동'
    if (element.closest('nav,[role=navigation]')) return '메뉴'
    return '실행'
  }

  const inferRisk = (text, element) => {
    const destructive = /(탈퇴|해지|삭제|제거|폐기|취소|결제|송금|제출|확정|승인|반려|발송)/i.test(text)
    const formSubmit = element.matches('button[type=submit],input[type=submit]')
    return destructive || formSubmit ? 'confirm' : 'safe'
  }

  const scan = () => {
    elementMap.clear()
    const selector = 'a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=link],[tabindex]:not([tabindex="-1"])'
    const items = [...document.querySelectorAll(selector)]
      .filter(isVisible)
      .map((element, index) => {
        const text = elementText(element)
        if (!text) return null
        const id = `ym-${Date.now().toString(36)}-${index}`
        elementMap.set(id, element)
        const href = element.matches('a[href]') ? element.href : ''
        return {
          id,
          text,
          kind: inferKind(element),
          risk: inferRisk(text, element),
          tag: element.tagName.toLowerCase(),
          href: href && new URL(href, location.href).origin === location.origin ? href : '',
        }
      })
      .filter(Boolean)

    return {
      ok: true,
      page: { title: document.title || location.hostname, url: location.href, hostname: location.hostname },
      stats: {
        total: items.length,
        menus: items.filter((item) => item.kind === '메뉴').length,
        forms: document.querySelectorAll('form').length,
        cautions: items.filter((item) => item.risk === 'confirm').length,
      },
      items: items.slice(0, 350),
    }
  }

  const clickable = (target) => target instanceof Element
    ? target.closest('a[href],button,[role=button],[role=link],summary,input[type=button],input[type=submit]')
    : null

  document.addEventListener('click', (event) => {
    const element = clickable(event.target)
    if (!element || !isVisible(element)) return
    const label = elementText(element).slice(0, 100)
    if (!label) return
    chrome.runtime.sendMessage({
      type: 'YOGIMAN_TRACE_EVENT',
      event: {
        label,
        group: document.title || location.hostname,
        kind: inferKind(element),
        path: location.pathname,
        at: Date.now(),
      },
    }).catch(() => {})
  }, true)

  const clearHighlight = () => {
    if (activeElement) {
      activeElement.style.removeProperty('outline')
      activeElement.style.removeProperty('outline-offset')
      activeElement.style.removeProperty('position')
      activeElement.style.removeProperty('z-index')
    }
    activeBadge?.remove()
    activeBadge = null
    activeElement = null
  }

  const highlight = (id) => {
    const element = elementMap.get(id)
    if (!element || !document.contains(element)) return { ok: false, error: '화면이 변경되어 요소를 다시 찾아야 합니다.' }
    clearHighlight()
    activeElement = element
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    element.style.setProperty('outline', '4px solid #baff38', 'important')
    element.style.setProperty('outline-offset', '4px', 'important')
    element.style.setProperty('position', 'relative', 'important')
    element.style.setProperty('z-index', '2147483645', 'important')
    element.focus({ preventScroll: true })

    activeBadge = document.createElement('div')
    activeBadge.textContent = '여기만 · 직접 클릭하세요'
    Object.assign(activeBadge.style, {
      position: 'fixed', zIndex: '2147483647', right: '24px', bottom: '24px',
      padding: '12px 16px', borderRadius: '999px', background: '#baff38', color: '#16200b',
      font: '700 13px sans-serif', boxShadow: '0 12px 35px rgba(24, 39, 7, .25)',
    })
    document.documentElement.appendChild(activeBadge)
    window.setTimeout(clearHighlight, 6000)
    return { ok: true }
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'YOGIMAN_PING') sendResponse({ ok: true })
    if (message.type === 'YOGIMAN_SCAN') sendResponse(scan())
    if (message.type === 'YOGIMAN_HIGHLIGHT') sendResponse(highlight(message.id))
    if (message.type === 'YOGIMAN_CLEAR') { clearHighlight(); sendResponse({ ok: true }) }
    return true
  })
})()
