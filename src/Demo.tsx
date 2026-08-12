import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  ExternalLink,
  FileText,
  Grid3X3,
  LayoutList,
  LockKeyhole,
  MousePointer2,
  PanelRightClose,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  WandSparkles,
  X,
} from 'lucide-react'
import { inferIntent, makeTrace, type IntentId, type IntentMatch, type TraceEvent } from './intent-engine'

type DemoProps = { onExit: () => void }
type PortalView = 'home' | 'withdraw' | 'reserve'
type ScanState = 'idle' | 'scanning' | 'ready'
type Intent = IntentId

const scanMessages = [
  '상단·좌측 메뉴 구조 읽는 중',
  '클릭 가능한 버튼과 링크 분류 중',
  '화면 전환 관계를 안전하게 연결 중',
  '약관·확정·취소처럼 주의할 행동 표시 중',
  '이 사이트만의 업무 지도 완성 중',
]

const menuGroups = [
  ['나의 업무', ['통합업무함', '요청·처리 현황', '개인 일정', '즐겨찾기']],
  ['전자결재', ['결재문서 작성', '결재 대기함', '참조 문서함', '문서 보관함', '부서 문서함']],
  ['인사·근태', ['근무 현황', '휴가 신청', '유연근무 변경', '인사정보 조회', '증명서 발급']],
  ['복리후생', ['복지 포인트', '제휴 복지몰', '건강검진 신청', '경조금 신청', '회원관리']],
  ['예약·시설', ['회의실 예약', '업무차량 예약', '좌석 예약', '방문객 등록', '사내식당 예약']],
  ['비용·자산', ['법인카드 정산', '개인비용 청구', '출장 신청', 'IT 자산 신청', '소프트웨어 신청']],
  ['교육·지식', ['사내 교육', '업무 매뉴얼', '전문가 찾기', '지식 문서']],
]

const workRows = [
  ['2026-0812-4471', 'AI 솔루션 이용 권한 신청', '디지털혁신팀', '김○○', '결재대기', '2026-08-12'],
  ['2026-0812-4428', '프로젝트 회의비 정산', '사업기획팀', '이○○', '보완요청', '2026-08-12'],
  ['2026-0811-4389', '선택적 근로시간 변경', 'HR지원팀', '박○○', '진행중', '2026-08-11'],
  ['2026-0811-4312', '모바일 단말 교체 신청', 'IT운영팀', '최○○', '접수완료', '2026-08-11'],
  ['2026-0810-4294', '국내출장 결과 보고', '경영지원팀', '정○○', '결재완료', '2026-08-10'],
  ['2026-0810-4201', '사내 교육 수강 신청', '인재개발팀', '한○○', '반려', '2026-08-10'],
]

export function Demo({ onExit }: DemoProps) {
  const [panelOpen, setPanelOpen] = useState(true)
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [scanIndex, setScanIndex] = useState(0)
  const [scanProgress, setScanProgress] = useState(0)
  const [intent, setIntent] = useState<Intent | null>(null)
  const [portalView, setPortalView] = useState<PortalView>('home')
  const [highlight, setHighlight] = useState('')
  const [siteCounts, setSiteCounts] = useState({ controls: 0, menus: 0, forms: 0 })
  const [completedIntent, setCompletedIntent] = useState<Intent | null>(null)
  const [activityTrace, setActivityTrace] = useState<TraceEvent[]>([])
  const intentMatch = useMemo(() => inferIntent(activityTrace), [activityTrace])

  useEffect(() => {
    if (scanState !== 'scanning') return
    let step = 0
    const controls = document.querySelectorAll('button, a, input, select, [role="button"]').length
    const menus = document.querySelectorAll('[data-yogi-menu]').length
    const forms = document.querySelectorAll('form, [data-yogi-flow]').length
    const timer = window.setInterval(() => {
      step += 1
      setScanIndex(Math.min(step, scanMessages.length - 1))
      setScanProgress(Math.min(step * 20, 100))
      if (step >= scanMessages.length) {
        window.clearInterval(timer)
        setSiteCounts({ controls, menus, forms })
        window.setTimeout(() => setScanState('ready'), 350)
      }
    }, 900)
    return () => window.clearInterval(timer)
  }, [scanState])

  const recordActivity = (label: string, group: string) => {
    if (scanState !== 'ready' || intent) return
    setActivityTrace((current) => {
      const next = [...current]
      const event = makeTrace(label, group)
      const existingIndex = next.findIndex((item) => item.label === event.label)
      if (existingIndex >= 0) next.splice(existingIndex, 1)
      next.push(event)
      return next.slice(-5)
    })
  }

  const resetDemo = () => {
    setScanState('idle')
    setIntent(null)
    setActivityTrace([])
    setCompletedIntent(null)
    setPortalView('home')
  }

  const revealOriginal = (view: PortalView, target: string) => {
    setPortalView(view)
    setHighlight(target)
    window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
    window.setTimeout(() => setHighlight(''), 4200)
  }

  return (
    <main className={`demo-shell ${panelOpen ? 'panel-is-open' : ''}`}>
      <div className="demo-utility">
        <button onClick={onExit}><ArrowLeft size={15} /> 랜딩으로</button>
        <p><span>POC 시연 환경</span> 실제 사내 정보가 아닌 가상 데이터입니다.</p>
        <button onClick={resetDemo}>데모 초기화</button>
      </div>

      <div className="demo-workspace">
        <LegacyPortal view={portalView} setView={setPortalView} highlight={highlight} completedIntent={completedIntent} onWorkflowComplete={setCompletedIntent} onActivity={recordActivity} traceMode={scanState === 'ready' && !intent} />

        {!panelOpen && (
          <button className="yogi-launcher" onClick={() => setPanelOpen(true)}>
            <WandSparkles size={19} /> <span>여기만</span>
          </button>
        )}

        {panelOpen && (
          <aside className="yogi-panel" aria-label="여기만 AI 패널">
            <div className="yogi-panel-header">
              <div className="panel-brand"><i /> 여기만 <small>beta</small></div>
              <button onClick={() => setPanelOpen(false)} aria-label="패널 닫기"><PanelRightClose size={20} /></button>
            </div>

            {scanState === 'idle' && (
              <div className="panel-onboarding panel-enter">
                <div className="scan-illustration">
                  <div className="scan-page"><span /><span /><span /><span /></div>
                  <div className="scan-lens"><ScanLine size={31} /></div>
                </div>
                <p className="panel-eyebrow">처음 방문한 사이트예요</p>
                <h2>복잡한 화면을 먼저 읽어볼게요.</h2>
                <p className="panel-body">메뉴와 버튼의 의미를 정리해 이 사이트만의 업무 지도를 만듭니다. 실행·제출·삭제 버튼은 누르지 않아요.</p>
                <button className="panel-primary" onClick={() => setScanState('scanning')}>
                  사이트 안전 탐색 시작 <ArrowRight size={17} />
                </button>
                <div className="safe-note"><ShieldCheck size={17} /><p><b>사람이 확인하기 전에는 실행하지 않음</b><span>읽기 전용 DOM 분석 · 위험 행동 자동 제외</span></p></div>
              </div>
            )}

            {scanState === 'scanning' && (
              <div className="panel-scanning panel-enter">
                <p className="panel-eyebrow">사이트 학습 중</p>
                <h2>{scanMessages[scanIndex]}</h2>
                <div className="scan-map">
                  {Array.from({ length: 11 }).map((_, index) => <i key={index} className={index <= scanIndex * 2 ? 'found' : ''} />)}
                  <span className="scan-beam" style={{ top: `${15 + scanIndex * 14}%` }} />
                </div>
                <div className="scan-progress"><span style={{ width: `${scanProgress}%` }} /></div>
                <div className="scan-progress-copy"><span>구조 분석</span><b>{scanProgress}%</b></div>
                <div className="scan-live-list">
                  {scanMessages.slice(0, scanIndex + 1).map((message, index) => (
                    <p key={message}><CheckCircle2 size={15} /> {message.replace(' 중', '')}{index === scanIndex && scanProgress < 100 ? <em>…</em> : null}</p>
                  ))}
                </div>
              </div>
            )}

            {scanState === 'ready' && !intent && (
              <ContextResolver
                siteCounts={siteCounts}
                trace={activityTrace}
                match={intentMatch}
                onConfirm={(nextIntent) => setIntent(nextIntent)}
                onReset={() => setActivityTrace([])}
                onRescan={resetDemo}
              />
            )}

            {scanState === 'ready' && intent && (
              <IntentResult intent={intent} match={intentMatch} completed={completedIntent === intent} onBack={() => { setIntent(null); setActivityTrace([]) }} revealOriginal={revealOriginal} />
            )}
          </aside>
        )}
      </div>
    </main>
  )
}

type IntentResultProps = {
  intent: Intent
  match: IntentMatch | null
  completed: boolean
  onBack: () => void
  revealOriginal: (view: PortalView, target: string) => void
}

function ContextResolver({ siteCounts, trace, match, onConfirm, onReset, onRescan }: {
  siteCounts: { controls: number; menus: number; forms: number }
  trace: TraceEvent[]
  match: IntentMatch | null
  onConfirm: (intent: Intent) => void
  onReset: () => void
  onRescan: () => void
}) {
  const ready = Boolean(match?.ready)
  return (
    <div className="panel-ready context-resolver panel-enter">
      <div className="ready-summary">
        <div className="ready-icon"><Check size={22} /></div>
        <div><p>기능 지도 준비 완료</p><span>{siteCounts.controls}개 조작 요소 · {siteCounts.menus}개 메뉴 · {Math.max(siteCounts.forms, 4)}개 업무 흐름</span></div>
      </div>

      {!trace.length ? (
        <>
          <p className="panel-eyebrow">대신 묻지 않고 맥락을 읽습니다</p>
          <h2>하던 일을 이어가세요.</h2>
          <p className="panel-body">왼쪽 포털에서 평소처럼 메뉴를 눌러보세요. 여기만이 현재 화면과 최근 클릭을 기능 지도에 겹쳐 목적을 복원합니다.</p>
          <div className="trace-empty">
            <MousePointer2 size={22} />
            <p><b>첫 번째 단서를 기다리고 있어요</b><span>입력값은 읽지 않고 버튼·링크의 이름만 세션에 보존합니다.</span></p>
          </div>
          <div className="context-privacy"><ShieldCheck size={16} /><span>텍스트 입력값 저장 안 함 · 이 탭의 최근 클릭 최대 5개</span></div>
        </>
      ) : (
        <>
          <p className="panel-eyebrow">사용자가 여기까지 온 경로</p>
          <h2>{ready ? '목적이 한곳에서 만났어요.' : '의도 단서를 모으고 있어요.'}</h2>
          <div className="context-stack">
            <section className="trace-card">
              <div className="context-card-head"><span>실시간 Intent Trace</span><b>{trace.length}/5</b></div>
              <div className="trace-list">
                {trace.map((event, index) => (
                  <div key={event.id} className={index === trace.length - 1 ? 'latest' : ''}>
                    <i>{index + 1}</i><p><b>{event.label}</b><span>{event.group}</span></p><Check size={13} />
                  </div>
                ))}
              </div>
            </section>

            <div className={`context-bridge ${ready ? 'matched' : ''}`}><span>{ready ? `${match?.evidence.length ?? 3}개의 단서가 같은 업무에서 만남` : '기능 지도와 대조 중'}</span></div>

            <section className={`graph-card ${ready ? 'matched' : ''}`}>
              <div className="context-card-head"><span>Capability Graph</span><b>v1.0</b></div>
              {match ? (
                <>
                  <p className="graph-title">{match.title}</p>
                  <div className="graph-path">{match.path.map((node, index) => <span key={node} className={index < Math.max(match.evidence.length, 1) ? 'active' : ''}>{node}</span>)}</div>
                </>
              ) : <p className="graph-wait">관련 업무 노드를 찾는 중입니다.</p>}
            </section>
          </div>

          {ready && match ? (
            <div className="intent-proposal panel-enter">
              <div><span>복원한 목적</span><b>{match.title}</b><small>근거 {match.evidence.length}개 일치 · 최종 실행은 사람 확인</small></div>
              <button className="panel-primary" onClick={() => onConfirm(match.intent)}>이 목적이 맞아요 <ArrowRight size={17} /></button>
            </div>
          ) : (
            <p className="context-hint"><MousePointer2 size={14} /> 왼쪽에서 관련 메뉴를 한두 번 더 눌러보세요.</p>
          )}
        </>
      )}
      <div className="context-secondary-actions">
        {trace.length > 0 && <button onClick={onReset}>흔적 지우기</button>}
        <button onClick={onRescan}><ScanLine size={13} /> 다시 학습</button>
      </div>
    </div>
  )
}

function IntentResult({ intent, match, completed, onBack, revealOriginal }: IntentResultProps) {
  const [withdrawStage, setWithdrawStage] = useState(2)

  useEffect(() => setWithdrawStage(2), [intent])

  if (intent === 'withdraw' && completed) {
    return (
      <div className="intent-result completion-screen panel-enter">
        <div className="completion-mark"><Check size={32} strokeWidth={3} /></div>
        <p className="panel-eyebrow">안내 완료</p>
        <h2>회원 해지 신청을 완료했어요!</h2>
        <p className="result-summary">여기만이 안내한 3단계를 모두 따라 원본 화면에서 신청이 정상 접수되었습니다.</p>
        <div className="completion-summary">
          <div><span>처리 결과</span><b>신청 접수 완료</b></div>
          <div><span>AI가 한 일</span><b>경로 탐색 · 약관 연결</b></div>
          <div><span>사람이 한 일</span><b>약관 확인 · 동의 · 최종 신청</b></div>
        </div>
        <div className="completion-steps">
          <p><i><Check size={12} /></i> 메뉴 경로 찾기</p>
          <p><i><Check size={12} /></i> 해지 약관 확인</p>
          <p><i><Check size={12} /></i> 직접 동의하고 신청</p>
        </div>
        <button className="panel-primary completion-action" onClick={onBack}>다른 업무 찾아보기 <ArrowRight size={17} /></button>
        <div className="human-control"><UserRound size={16} /><p><b>중요한 결정은 끝까지 직접</b><span>AI는 안내했고, 최종 신청은 사용자가 완료했습니다.</span></p></div>
      </div>
    )
  }

  if (intent === 'withdraw') {
    return (
      <div className="intent-result panel-enter">
        <button className="result-back" onClick={onBack}><ArrowLeft size={15} /> 목적 다시 찾기</button>
        <div className="understood"><Sparkles size={14} /> 클릭 근거 {match?.evidence.length ?? 3}개로 목적을 복원했어요</div>
        <blockquote>복지 포인트 → 제휴 복지몰 → 회원관리</blockquote>
        <div className="result-title-row"><div><small>추천 업무</small><h2>제휴 복지몰 회원 해지 신청</h2></div><span className="risk-badge">최종 확인 필요</span></div>
        <p className="result-summary">총 42개 메뉴 중 관련된 3단계만 남겼어요. 해지는 되돌릴 수 있어도 포인트는 복구되지 않으니, 마지막 신청은 원본 화면에서 직접 진행합니다.</p>

        <div className="decision-card">
          <span>신청 전 확인</span>
          <strong>12,480 P</strong>
          <p>해지 즉시 소멸 예정인 복지 포인트</p>
          <button onClick={() => revealOriginal('withdraw', 'original-balance')}><ExternalLink size={14} /> 원본에서 확인</button>
        </div>

        <div className="guided-steps">
          <div className="guided-step complete"><i><Check size={13} /></i><p><b>메뉴 경로 찾기</b><span>복리후생 › 제휴 복지몰 › 회원관리</span></p></div>
          <div className={`guided-step ${withdrawStage >= 3 ? 'complete' : 'active'}`}><i>{withdrawStage >= 3 ? <Check size={13} /> : '2'}</i><p><b>해지 약관 읽기</b><span>포인트·진행 중 주문 영향 확인</span></p><button onClick={() => { setWithdrawStage(3); revealOriginal('withdraw', 'original-terms') }}>약관 열기</button></div>
          <div className={`guided-step ${withdrawStage >= 3 ? 'active' : ''}`}><i>3</i><p><b>본인이 동의하고 신청</b><span>AI가 대신 체크하거나 제출하지 않음</span></p></div>
        </div>

        <button className="panel-primary danger-aware" onClick={() => { setWithdrawStage(3); revealOriginal('withdraw', 'original-confirm') }}>
          원본 신청 화면으로 안내 <MousePointer2 size={17} />
        </button>
        <div className="human-control"><UserRound size={16} /><p><b>여기서부터는 사람의 영역</b><span>약관 동의와 최종 신청은 원본 버튼을 직접 클릭하세요.</span></p></div>
      </div>
    )
  }

  if (intent === 'reserve') {
    return (
      <div className="intent-result panel-enter">
        <button className="result-back" onClick={onBack}><ArrowLeft size={15} /> 목적 다시 찾기</button>
        <div className="understood"><Sparkles size={14} /> 최근 행동과 기능 지도가 연결됐어요</div>
        <blockquote>예약·시설 → 회의실 예약 → 시간 선택</blockquote>
        <div className="result-title-row"><div><small>추천 업무</small><h2>사내 회의실 빠른 예약</h2></div><span className="low-risk-badge">바로 가능</span></div>
        <p className="result-summary">예약에 필요한 장소, 시간, 인원만 골라 원본 예약표로 연결합니다.</p>
        <div className="simple-fields">
          <label>위치<select><option>을지로 본관</option><option>판교 캠퍼스</option></select></label>
          <label>날짜<input type="date" defaultValue="2026-08-13" /></label>
          <div><label>시작<input type="time" defaultValue="14:00" /></label><label>종료<input type="time" defaultValue="15:00" /></label></div>
          <label>인원<select><option>4명</option><option>6명</option><option>8명</option></select></label>
        </div>
        <button className="panel-primary" onClick={() => revealOriginal('reserve', 'room-grid')}>조건에 맞는 회의실 3개 보기 <ArrowRight size={17} /></button>
        <div className="human-control"><CalendarDays size={16} /><p><b>선택과 확정은 직접</b><span>여기만은 빈 회의실까지 찾고, 실제 예약은 원본에서 진행합니다.</span></p></div>
      </div>
    )
  }

  if (intent === 'expense') {
    return (
      <div className="intent-result panel-enter">
        <button className="result-back" onClick={onBack}><ArrowLeft size={15} /> 목적 다시 찾기</button>
        <div className="understood"><Sparkles size={14} /> 관련 흐름 2개를 찾았어요</div>
        <blockquote>비용·자산 → 법인카드 정산</blockquote>
        <h2>어떤 비용을 정산하나요?</h2>
        <p className="result-summary">정산 방식에 따라 증빙과 결재선이 달라 먼저 구분이 필요해요.</p>
        <div className="choice-list">
          <button><span><b>법인카드 사용분</b><small>카드 내역을 불러와 영수증 첨부</small></span><ArrowRight size={17} /></button>
          <button><span><b>개인 비용 청구</b><small>교통비·소모품 등 개인 결제분</small></span><ArrowRight size={17} /></button>
        </div>
        <div className="human-control"><CircleHelp size={16} /><p><b>한 단계만 더 알려주세요</b><span>애매한 요청은 AI가 추측해 실행하지 않고 사람에게 되묻습니다.</span></p></div>
      </div>
    )
  }

  return null
}

type LegacyPortalProps = {
  view: PortalView
  setView: (view: PortalView) => void
  highlight: string
  completedIntent: Intent | null
  onWorkflowComplete: (intent: Intent) => void
  onActivity: (label: string, group: string) => void
  traceMode: boolean
}

function LegacyPortal({ view, setView, highlight, completedIntent, onWorkflowComplete, onActivity, traceMode }: LegacyPortalProps) {
  const [notice, setNotice] = useState('')
  const [termsOpen, setTermsOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [reason, setReason] = useState('')
  const timerRef = useRef<number | null>(null)

  const flash = (message: string) => {
    setNotice(message)
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setNotice(''), 2200)
  }

  const statusSummary = useMemo(() => ({ pending: 17, progress: 6, overdue: 2 }), [])

  return (
    <section className="legacy-portal" aria-label="가상 레거시 업무 포털">
      <header className="legacy-global">
        <div className="legacy-logo" onClick={() => setView('home')}><b>HANBIT</b><span>Enterprise Works</span></div>
        <div className="legacy-global-links"><button data-yogi-menu>업무포털</button><button data-yogi-menu>그룹웨어</button><button data-yogi-menu>지식관리</button><button data-yogi-menu>지원센터</button></div>
        <div className="legacy-user"><button><Bell size={14} /><em>4</em></button><span>디지털혁신팀 김○○</span><ChevronDown size={13} /><button>로그아웃</button></div>
      </header>
      <div className="legacy-toolbar">
        <button><Grid3X3 size={14} /> 전체서비스</button>
        <div className="legacy-search"><select aria-label="검색 범위"><option>통합검색</option></select><input aria-label="검색어" placeholder="검색어를 입력하세요" /><button><Search size={14} /></button></div>
        <span>최근 접속 2026-08-12 09:41:22</span><button>화면설정</button><button>도움말</button>
      </div>
      <div className="legacy-layout">
        <aside className="legacy-sidebar">
          <div className="sidebar-title"><LayoutList size={14} /> 전체 메뉴 <button>메뉴관리</button></div>
          {menuGroups.map(([group, items]) => (
            <div className="legacy-menu-group" key={group as string}>
              <b>{group as string}<ChevronDown size={11} /></b>
              {(items as string[]).map((item) => (
                <button key={item} data-yogi-menu data-trace-target={item} onClick={() => {
                  onActivity(item, group as string)
                  if (traceMode && ['복지 포인트', '제휴 복지몰', '회원관리'].includes(item)) {
                    flash(`‘${item}’에서 목적 단서를 확인했습니다.`)
                    return
                  }
                  if (item === '회의실 예약') setView('reserve')
                  else if (item === '회원관리') setView('withdraw')
                  else flash(`‘${item}’ 화면은 POC에서 축약되었습니다.`)
                }}>{item}<ChevronRight size={9} /></button>
              ))}
            </div>
          ))}
          <div className="legacy-banner"><b>보안 프로그램 점검</b><span>설치 상태를 확인하세요</span><button>확인</button></div>
        </aside>

        <div className="legacy-main">
          <div className="legacy-breadcrumb"><button onClick={() => setView('home')}>HOME</button><ChevronRight size={10} />{view === 'home' ? '통합업무함' : view === 'withdraw' ? '복리후생 > 제휴 복지몰 > 회원관리' : '예약·시설 > 회의실 예약'}</div>
          {view === 'home' && <LegacyHome statusSummary={statusSummary} flash={flash} setView={setView} onActivity={onActivity} />}
          {view === 'withdraw' && (
            <WithdrawPage
              highlight={highlight}
              termsOpen={termsOpen}
              setTermsOpen={setTermsOpen}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              reason={reason}
              setReason={setReason}
              submitted={completedIntent === 'withdraw'}
              onSubmit={() => onWorkflowComplete('withdraw')}
            />
          )}
          {view === 'reserve' && <ReservePage highlight={highlight} flash={flash} />}
        </div>
      </div>
      {notice && <div className="legacy-toast">{notice}</div>}
    </section>
  )
}

function LegacyHome({ statusSummary, flash, setView, onActivity }: { statusSummary: Record<string, number>, flash: (message: string) => void, setView: (view: PortalView) => void, onActivity: (label: string, group: string) => void }) {
  return (
    <>
      <div className="legacy-title"><div><h1>통합업무함</h1><p>전자결재 및 요청 업무의 처리 현황을 확인합니다.</p></div><div><button>사용자 매뉴얼</button><button>화면 인쇄</button></div></div>
      <div className="legacy-tabbar"><button className="active">나의 업무</button><button>부서 업무</button><button>대리결재</button><button>완료 업무</button><button>임시저장</button></div>
      <div className="legacy-status-grid">
        <button onClick={() => flash('결재 대기함을 불러옵니다.')}><span>결재 대기</span><b>{statusSummary.pending}</b><small>오늘 +4</small></button>
        <button onClick={() => flash('진행 중 업무를 불러옵니다.')}><span>진행 중</span><b>{statusSummary.progress}</b><small>오늘 +1</small></button>
        <button className="warning" onClick={() => flash('기한 초과 업무를 불러옵니다.')}><span>기한 초과</span><b>{statusSummary.overdue}</b><small>확인 필요</small></button>
        <button onClick={() => flash('완료 업무를 불러옵니다.')}><span>이번 달 완료</span><b>48</b><small>전월 +12%</small></button>
      </div>
      <div className="legacy-filters">
        <table><tbody>
          <tr><th>처리 상태</th><td><select><option>전체</option></select><label><input type="checkbox" /> 결재대기</label><label><input type="checkbox" /> 보완요청</label><label><input type="checkbox" /> 진행중</label></td><th>조회 기간</th><td><input value="2026-07-13" readOnly /> ~ <input value="2026-08-12" readOnly /><button>1개월</button><button>3개월</button></td></tr>
          <tr><th>검색 조건</th><td colSpan={3}><select><option>문서 제목</option></select><input className="wide" placeholder="검색어" /><button className="legacy-blue">조회</button><button>초기화</button></td></tr>
        </tbody></table>
      </div>
      <div className="legacy-table-head"><b>업무 목록 <span>총 128건</span></b><div><select><option>20개씩 보기</option></select><button>엑셀 다운로드</button><button>일괄 처리</button></div></div>
      <table className="legacy-data-table"><thead><tr><th><input type="checkbox" /></th><th>문서번호</th><th>문서제목</th><th>담당부서</th><th>기안자</th><th>처리상태</th><th>기안일</th></tr></thead><tbody>
        {workRows.map((row) => <tr key={row[0]}><td><input type="checkbox" /></td>{row.map((cell, index) => <td key={cell} className={index === 4 ? `status-${cell}` : ''}>{cell}</td>)}</tr>)}
      </tbody></table>
      <div className="legacy-paging"><button>«</button><button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>›</button><button>»</button></div>
      <div className="legacy-quick-actions" data-yogi-flow>
        <b>자주 찾는 업무</b>
        <button data-yogi-menu onClick={() => { onActivity('회의실 예약', '예약·시설'); setView('reserve') }}>회의실 예약</button><button data-yogi-menu>휴가 신청</button><button data-yogi-menu onClick={() => onActivity('비용 정산', '비용·자산')}>비용 정산</button><button data-yogi-menu>증명서 발급</button><button data-yogi-menu>IT 서비스 신청</button>
      </div>
    </>
  )
}

type WithdrawPageProps = {
  highlight: string
  termsOpen: boolean
  setTermsOpen: (value: boolean) => void
  confirmed: boolean
  setConfirmed: (value: boolean) => void
  reason: string
  setReason: (value: string) => void
  submitted: boolean
  onSubmit: () => void
}

function WithdrawPage(props: WithdrawPageProps) {
  const { highlight, termsOpen, setTermsOpen, confirmed, setConfirmed, reason, setReason, submitted, onSubmit } = props
  if (submitted) return (
    <div className="legacy-complete"><CheckCircle2 size={42} /><h1>회원 해지 신청이 접수되었습니다.</h1><p>가상 시연이므로 실제 정보나 계정에는 영향을 주지 않습니다.</p><button onClick={() => window.location.reload()}>처음으로</button></div>
  )
  return (
    <div data-yogi-flow="membership-withdrawal">
      <div className="legacy-title"><div><h1>제휴 복지몰 회원관리</h1><p>개인정보 및 서비스 이용 상태를 변경합니다.</p></div><div><button>이용안내</button><button>FAQ</button></div></div>
      <div className="legacy-info-box"><AlertTriangle size={17} /><div><b>회원 해지는 복지몰 서비스에만 적용됩니다.</b><p>회사 포털 계정과 인사정보는 유지되며, 해지 후 동일 사번으로 재가입할 수 있습니다.</p></div></div>
      <table className="legacy-form-table"><tbody>
        <tr><th>회원 상태</th><td><span className="legacy-status-on">정상 이용</span></td><th>가입일</th><td>2024-03-11</td></tr>
        <tr id="original-balance" className={highlight === 'original-balance' ? 'yogi-highlight' : ''}><th>잔여 복지 포인트</th><td><b className="point-balance">12,480 P</b></td><th>소멸 예정일</th><td>회원 해지 즉시</td></tr>
        <tr><th>진행 중 주문</th><td>0건</td><th>미처리 환불</th><td>0건</td></tr>
      </tbody></table>
      <h2 className="legacy-subtitle">회원 해지 유의사항</h2>
      <div className="legacy-terms-summary">
        <ol><li>해지 즉시 남은 복지 포인트가 소멸되며 복구되지 않습니다.</li><li>쿠폰과 장바구니 정보가 모두 삭제됩니다.</li><li>거래 기록은 관계 법령에 따라 일정 기간 보관될 수 있습니다.</li><li>재가입 시 기존 혜택과 이용 이력은 복원되지 않습니다.</li></ol>
        <button id="original-terms" className={highlight === 'original-terms' ? 'yogi-highlight' : ''} onClick={() => setTermsOpen(true)}><FileText size={13} /> 전체 약관 보기</button>
      </div>
      <h2 className="legacy-subtitle">해지 사유 및 본인 확인</h2>
      <table className="legacy-form-table"><tbody>
        <tr><th>해지 사유 <em>*</em></th><td><select value={reason} onChange={(event) => setReason(event.target.value)}><option value="">선택하세요</option><option>이용 빈도가 낮음</option><option>서비스 불만족</option><option>개인정보 우려</option><option>기타</option></select></td></tr>
        <tr id="original-confirm" className={highlight === 'original-confirm' ? 'yogi-highlight' : ''}><th>필수 동의 <em>*</em></th><td><label className="legacy-check"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> 회원 해지 시 포인트 소멸 및 개인정보 처리에 관한 유의사항을 확인했습니다.</label></td></tr>
      </tbody></table>
      <div className="legacy-form-actions"><button>취소</button><button className="legacy-danger" disabled={!confirmed || !reason} onClick={onSubmit}><LockKeyhole size={13} /> 회원 해지 신청</button></div>
      {termsOpen && <div className="legacy-modal-backdrop"><div className="legacy-modal"><div><h2>제휴 복지몰 회원 해지 약관</h2><button onClick={() => setTermsOpen(false)}><X size={17} /></button></div><article><b>제1조 (목적)</b><p>본 약관은 가상 시연용 복지몰의 회원 해지 절차를 설명하기 위해 작성된 예시 문서입니다.</p><b>제2조 (포인트의 처리)</b><p>회원이 해지를 신청하면 보유한 미사용 포인트는 즉시 소멸하며, 해지 철회 또는 재가입 이후에도 복원되지 않습니다.</p><b>제3조 (주문 및 환불)</b><p>진행 중인 주문 또는 환불이 있는 경우 해당 처리가 완료될 때까지 해지가 제한될 수 있습니다.</p><b>제4조 (개인정보)</b><p>법령상 보관 의무가 없는 개인정보는 해지 절차 완료 후 지체 없이 파기합니다.</p></article><button className="legacy-blue" onClick={() => setTermsOpen(false)}>확인</button></div></div>}
    </div>
  )
}

function ReservePage({ highlight, flash }: { highlight: string, flash: (message: string) => void }) {
  return (
    <div data-yogi-flow="meeting-room-reservation">
      <div className="legacy-title"><div><h1>회의실 예약</h1><p>사업장별 회의실 현황을 조회하고 예약합니다.</p></div><div><button>예약내역</button><button>운영기준</button></div></div>
      <div className="legacy-filters reserve-filter"><table><tbody><tr><th>사업장</th><td><select><option>을지로 본관</option></select></td><th>예약일</th><td><input value="2026-08-13" readOnly /></td><th>시간</th><td><select><option>14:00</option></select> ~ <select><option>15:00</option></select></td><td><button className="legacy-blue">조회</button></td></tr></tbody></table></div>
      <div className={`room-grid ${highlight === 'room-grid' ? 'yogi-highlight' : ''}`} id="room-grid">
        <div className="room-grid-head"><b>2026.08.13 (목) · 을지로 본관</b><span><i className="available" />예약 가능 <i className="busy" />예약됨</span></div>
        <table><thead><tr><th>회의실</th><th>정원</th>{['13:00','13:30','14:00','14:30','15:00','15:30'].map((time) => <th key={time}>{time}</th>)}</tr></thead><tbody>
          {['A-301 프로젝트룸','A-302 회의실','B-401 이노베이션룸','B-402 포커스룸','C-501 화상회의실'].map((room, roomIndex) => <tr key={room}><th>{room}</th><td>{[6,8,12,4,10][roomIndex]}명</td>{Array.from({ length: 6 }).map((_, cellIndex) => { const busy = (roomIndex + cellIndex) % 4 === 1; return <td key={cellIndex}><button className={busy ? 'busy' : 'available'} disabled={busy} onClick={() => flash(`${room} ${13 + Math.floor(cellIndex/2)}:${cellIndex%2?'30':'00'} 예약 확인 화면을 엽니다.`)}>{busy ? '예약' : '선택'}</button></td>})}</tr>)}
        </tbody></table>
      </div>
      <div className="legacy-info-box"><CircleHelp size={17} /><div><b>예약 시 유의사항</b><p>10분 이상 사용하지 않으면 예약이 자동 취소되며, 외부 방문객이 있는 경우 별도 등록이 필요합니다.</p></div></div>
    </div>
  )
}
