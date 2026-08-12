globalThis.YogimanIntent = (() => {
  const capabilityGraph = [
    {
      id: 'withdraw',
      title: '제휴 복지몰 회원 해지',
      path: ['복리후생', '제휴 복지몰', '회원관리', '회원 해지'],
      signals: [['복지 포인트', 4], ['제휴 복지몰', 5], ['회원관리', 6], ['복리후생', 2], ['해지', 7], ['탈퇴', 7]],
      risk: 'confirm',
    },
    {
      id: 'reserve',
      title: '회의실 예약',
      path: ['예약·시설', '회의실 예약', '시간 선택', '예약 확정'],
      signals: [['예약·시설', 2], ['회의실', 6], ['예약', 4], ['일정', 2]],
      risk: 'safe',
    },
    {
      id: 'expense',
      title: '비용 정산',
      path: ['비용·자산', '법인카드 정산', '증빙 첨부', '결재 제출'],
      signals: [['비용·자산', 2], ['법인카드', 6], ['비용', 4], ['정산', 5]],
      risk: 'confirm',
    },
  ]

  const normalize = (value) => String(value || '').toLowerCase().replace(/\s+/g, '')

  function infer(trace) {
    if (!trace?.length) return null
    const ranked = capabilityGraph.map((capability) => {
      const evidence = trace.filter((event) => {
        const target = normalize(`${event.group} ${event.label}`)
        return capability.signals.some(([term]) => target.includes(normalize(term)))
      })
      const score = trace.reduce((total, event) => {
        const target = normalize(`${event.group} ${event.label}`)
        return total + capability.signals.reduce((sum, [term, weight]) => sum + (target.includes(normalize(term)) ? weight : 0), 0)
      }, 0)
      return { ...capability, evidence, score }
    }).sort((a, b) => b.score - a.score)
    const best = ranked[0]
    if (!best || best.score === 0) return null
    return { ...best, ready: best.evidence.length >= 3 && best.score >= 15 }
  }

  return { capabilityGraph, infer, normalize }
})()
