export type IntentId = 'withdraw' | 'reserve' | 'expense'

export type TraceEvent = {
  id: string
  label: string
  group: string
  at: number
}

export type Capability = {
  id: IntentId
  title: string
  path: string[]
  signals: Array<{ term: string; weight: number }>
  risk: 'confirm' | 'safe'
}

export type IntentMatch = {
  intent: IntentId
  title: string
  path: string[]
  risk: Capability['risk']
  score: number
  evidence: TraceEvent[]
  ready: boolean
}

/**
 * A small, inspectable Capability Graph for the synthetic portal.
 * In production this data is generated and versioned per internal system.
 */
export const capabilityGraph: Capability[] = [
  {
    id: 'withdraw',
    title: '제휴 복지몰 회원 해지',
    path: ['복리후생', '제휴 복지몰', '회원관리', '회원 해지'],
    signals: [
      { term: '복지 포인트', weight: 4 },
      { term: '제휴 복지몰', weight: 5 },
      { term: '회원관리', weight: 6 },
      { term: '복리후생', weight: 2 },
      { term: '해지', weight: 7 },
    ],
    risk: 'confirm',
  },
  {
    id: 'reserve',
    title: '사내 회의실 예약',
    path: ['예약·시설', '회의실 예약', '시간 선택', '예약 확정'],
    signals: [
      { term: '예약·시설', weight: 2 },
      { term: '회의실', weight: 6 },
      { term: '예약', weight: 4 },
      { term: '일정', weight: 2 },
    ],
    risk: 'safe',
  },
  {
    id: 'expense',
    title: '법인카드 비용 정산',
    path: ['비용·자산', '법인카드 정산', '증빙 첨부', '결재 제출'],
    signals: [
      { term: '비용·자산', weight: 2 },
      { term: '법인카드', weight: 6 },
      { term: '비용', weight: 4 },
      { term: '정산', weight: 5 },
    ],
    risk: 'confirm',
  },
]

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, '')

export function inferIntent(trace: TraceEvent[]): IntentMatch | null {
  if (!trace.length) return null

  const ranked = capabilityGraph
    .map((capability) => {
      const evidence = trace.filter((event) => {
        const target = normalize(`${event.group} ${event.label}`)
        return capability.signals.some(({ term }) => target.includes(normalize(term)))
      })
      const score = trace.reduce((total, event) => {
        const target = normalize(`${event.group} ${event.label}`)
        return total + capability.signals.reduce(
          (sum, signal) => sum + (target.includes(normalize(signal.term)) ? signal.weight : 0),
          0,
        )
      }, 0)
      return { capability, evidence, score }
    })
    .sort((a, b) => b.score - a.score)

  const best = ranked[0]
  if (!best || best.score === 0) return null

  return {
    intent: best.capability.id,
    title: best.capability.title,
    path: best.capability.path,
    risk: best.capability.risk,
    score: best.score,
    evidence: best.evidence,
    ready: best.evidence.length >= 3 && best.score >= 15,
  }
}

export function makeTrace(label: string, group: string): TraceEvent {
  return {
    id: `${Date.now()}-${label}`,
    label,
    group,
    at: Date.now(),
  }
}
