import { useEffect, useState } from 'react'
import './demo.css'
import './capture-guide.css'
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Mail,
  Monitor,
  MousePointer2,
  Play,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react'

type DemoProps = { onExit: () => void }
type Phase = 'welcome' | 'capture' | 'structuring' | 'review' | 'shared' | 'library' | 'guide' | 'success'
type WorkApp = 'mail' | 'excel' | 'explorer' | 'portal'

const requestId = 'TR-2026-0812'

const appMeta: Record<WorkApp, { label: string; icon: typeof Mail }> = {
  mail: { label: '메일', icon: Mail },
  excel: { label: 'Excel', icon: FileSpreadsheet },
  explorer: { label: '파일 탐색기', icon: FolderOpen },
  portal: { label: '통합업무포털', icon: AppWindow },
}

const manualSteps = [
  { app: '메일', title: '보완 요청 내용을 확인합니다.', detail: '정산번호와 누락된 증빙을 확인합니다.' },
  { app: 'Excel', title: '대상 정산 건을 찾습니다.', detail: 'TR-2026-0812 정산 행을 선택합니다.' },
  { app: '파일 탐색기', title: '숙박 영수증을 준비합니다.', detail: '부산 출장 폴더에서 증빙 파일을 선택합니다.' },
  { app: '업무 포털', title: '보완 자료와 사유를 등록합니다.', detail: '영수증을 첨부하고 보완 사유를 입력합니다.' },
  { app: '업무 포털', title: '제출 결과를 확인합니다.', detail: '접수 완료 상태와 처리 번호를 확인합니다.' },
]

type CapturePrompt = { text: string; targetApp?: WorkApp }

function getCapturePrompt({
  activeApp,
  mailOpened,
  rowSelected,
  fileSelected,
  attached,
  reason,
  submitted,
}: {
  activeApp: WorkApp
  mailOpened: boolean
  rowSelected: boolean
  fileSelected: boolean
  attached: boolean
  reason: string
  submitted: boolean
}): CapturePrompt {
  if (!mailOpened) return { text: '보완 요청 메일을 클릭해 보세요.' }
  if (!rowSelected && activeApp !== 'excel') return { text: '아래 작업표시줄에서 Excel을 열어 보세요.', targetApp: 'excel' }
  if (!rowSelected) return { text: 'TR-2026-0812 정산 행을 클릭해 보세요.' }
  if (!fileSelected && activeApp !== 'explorer') return { text: '아래 작업표시줄에서 파일 탐색기를 열어 보세요.', targetApp: 'explorer' }
  if (!fileSelected) return { text: '숙박_영수증.pdf를 클릭해 보세요.' }
  if (!attached && activeApp !== 'portal') return { text: '아래 작업표시줄에서 통합업무포털을 열어 보세요.', targetApp: 'portal' }
  if (!attached) return { text: '파일 선택 버튼을 클릭해 보세요.' }
  if (!reason.trim()) return { text: '보완 사유를 입력해 보세요.' }
  if (!submitted) return { text: '보완 자료 제출 버튼을 클릭해 보세요.' }
  return { text: '기록을 종료하고 매뉴얼을 만들어 보세요.' }
}

export function Demo({ onExit }: DemoProps) {
  const [phase, setPhase] = useState<Phase>('welcome')
  const [activeApp, setActiveApp] = useState<WorkApp>('mail')
  const [events, setEvents] = useState<string[]>([])
  const [mailOpened, setMailOpened] = useState(false)
  const [rowSelected, setRowSelected] = useState(false)
  const [fileSelected, setFileSelected] = useState(false)
  const [attached, setAttached] = useState(false)
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [query, setQuery] = useState('')
  const [guideStep, setGuideStep] = useState(0)

  const capturePrompt = getCapturePrompt({
    activeApp, mailOpened, rowSelected, fileSelected, attached, reason, submitted,
  })

  useEffect(() => {
    if (phase !== 'structuring') return
    const timer = window.setTimeout(() => setPhase('review'), 3200)
    return () => window.clearTimeout(timer)
  }, [phase])

  const addEvent = (event: string) => setEvents((current) => current.includes(event) ? current : [...current, event])
  const switchApp = (app: WorkApp) => {
    setActiveApp(app)
    if (phase === 'capture') addEvent(`${appMeta[app].label} 열기`)
  }
  const startCapture = () => {
    setPhase('capture')
    setActiveApp('mail')
    addEvent('업무 기록 시작')
  }
  const resetDemo = () => {
    setPhase('welcome'); setActiveApp('mail'); setEvents([]); setMailOpened(false); setRowSelected(false)
    setFileSelected(false); setAttached(false); setReason(''); setSubmitted(false); setQuery(''); setGuideStep(0)
  }
  const runGuideAction = (step: number) => {
    if (phase !== 'guide' || guideStep !== step) return
    const next = step + 1
    if (next >= manualSteps.length) return setPhase('success')
    setGuideStep(next)
    setActiveApp((['mail', 'excel', 'explorer', 'portal', 'portal'] as WorkApp[])[next])
  }

  return (
    <main className="nh-demo-shell">
      <header className="nh-demo-topbar">
        <button onClick={onExit}><ArrowLeft size={15} /> 랜딩으로</button>
        <p><span>NoHow POC</span> 실제 사내 정보가 아닌 가상 업무 환경입니다.</p>
        <button onClick={resetDemo}>처음부터 보기</button>
      </header>
      <section className="nh-desktop" aria-label="Windows 업무 환경">
        <div className="nh-wallpaper-mark"><i /><span>WORKSPACE</span></div>
        <WorkWindow
          activeApp={activeApp} phase={phase} guideStep={guideStep} mailOpened={mailOpened}
          rowSelected={rowSelected} fileSelected={fileSelected} attached={attached} reason={reason} submitted={submitted}
          onMailOpen={() => { setMailOpened(true); addEvent('보완 요청 메일 열기'); runGuideAction(0) }}
          onRowSelect={() => { setRowSelected(true); addEvent('대상 정산 건 선택'); runGuideAction(1) }}
          onFileSelect={() => { setFileSelected(true); addEvent('숙박 영수증 선택'); runGuideAction(2) }}
          onAttach={() => { setAttached(true); addEvent('보완 자료 첨부'); runGuideAction(3) }}
          onReasonChange={(value) => { setReason(value); if (value.length > 3) addEvent('보완 사유 입력') }}
          onSubmit={() => {
            if (phase === 'guide') return runGuideAction(4)
            if (!attached || !reason) return
            setSubmitted(true); addEvent('보완 자료 제출 완료')
          }}
        />
        <NoHowPanel phase={phase} events={events} captureReady={submitted} captureInstruction={capturePrompt.text} query={query} guideStep={guideStep}
          onStart={startCapture} onStop={() => setPhase('structuring')} onShare={() => setPhase('shared')}
          onContinue={() => { setPhase('library'); setQuery('') }} onQuery={setQuery}
          onOpenManual={() => { setPhase('guide'); setGuideStep(0); setActiveApp('mail') }} />
        <Taskbar activeApp={activeApp} phase={phase} captureTargetApp={capturePrompt.targetApp} onSwitch={switchApp} />
      </section>
    </main>
  )
}

function Taskbar({ activeApp, phase, captureTargetApp, onSwitch }: { activeApp: WorkApp; phase: Phase; captureTargetApp?: WorkApp; onSwitch: (app: WorkApp) => void }) {
  const disabled = !['capture', 'welcome'].includes(phase)
  return <nav className="nh-taskbar" aria-label="업무 프로그램">
    <span className="nh-start" aria-hidden="true"><i /><i /><i /><i /></span>
    <button aria-label="Windows 검색"><Search size={18} /></button>
    {(Object.keys(appMeta) as WorkApp[]).map((app) => {
      const Icon = appMeta[app].icon
      const target = phase === 'capture' && captureTargetApp === app
      return <button key={app} disabled={disabled} className={`${activeApp === app ? 'is-active' : ''} ${target ? 'nh-capture-target' : ''}`} onClick={() => onSwitch(app)} aria-label={`${appMeta[app].label} 열기`}><Icon size={20} /></button>
    })}
    <div className="nh-taskbar-time"><b>오후 2:18</b><span>2026-08-18</span></div>
  </nav>
}

type WorkWindowProps = {
  activeApp: WorkApp; phase: Phase; guideStep: number; mailOpened: boolean; rowSelected: boolean
  fileSelected: boolean; attached: boolean; reason: string; submitted: boolean
  onMailOpen: () => void; onRowSelect: () => void; onFileSelect: () => void; onAttach: () => void
  onReasonChange: (value: string) => void; onSubmit: () => void
}

function WorkWindow(props: WorkWindowProps) {
  const { activeApp, phase, guideStep } = props
  const Icon = appMeta[activeApp].icon
  return <article className={`nh-work-window app-${activeApp}`}>
    <div className="nh-window-titlebar"><span><Icon size={15} /> {activeApp === 'excel' ? '출장비_정산내역_8월.xlsx' : appMeta[activeApp].label}</span><span className="nh-window-actions"><i>−</i><i>□</i><i>×</i></span></div>
    {activeApp === 'mail' && <MailApp {...props} />}
    {activeApp === 'excel' && <ExcelApp {...props} />}
    {activeApp === 'explorer' && <ExplorerApp {...props} />}
    {activeApp === 'portal' && <PortalApp {...props} />}
    {phase === 'guide' && <div className="nh-guide-label"><MousePointer2 size={14} /> {guideStep + 1}단계 · 파란색으로 표시된 항목을 선택하세요.</div>}
  </article>
}

function MailApp({ phase, guideStep, mailOpened, onMailOpen }: WorkWindowProps) {
  const guided = phase === 'guide' && guideStep === 0
  const captureTarget = phase === 'capture' && !mailOpened
  return <div className="nh-mail-app">
    <aside className="nh-app-sidebar"><button className="is-selected">받은 편지함 <b>12</b></button><button>중요 편지함</button><button>보낸 편지함</button><button>임시 보관함</button><button>업무 알림</button></aside>
    <section className="nh-mail-list"><div className="nh-app-toolbar"><button>새 메일</button><span>받은 편지함</span><Search size={15} /></div>
      <button className={`nh-mail-row ${mailOpened ? 'is-read' : 'is-unread'} ${guided ? 'nh-guide-target' : ''} ${captureTarget ? 'nh-capture-target' : ''}`} onClick={onMailOpen}><CircleUserRound size={25} /><span><b>재무지원팀</b><strong>[보완 요청] {requestId} 출장비 정산</strong><small>숙박비 증빙이 누락되었습니다. 영수증을 추가해 주세요.</small></span><time>오후 2:03</time></button>
      {['법인카드 사용 내역 안내', '8월 비용 마감 일정', '국내 출장 사전 승인 완료', '복리후생 포인트 안내'].map((title, index) => <div className="nh-mail-row muted" key={title}><CircleUserRound size={25} /><span><b>{index % 2 ? 'HR지원팀' : '재무지원팀'}</b><strong>{title}</strong><small>업무 관련 안내 메일입니다.</small></span><time>오전 {9 + index}:20</time></div>)}
    </section>
    <section className="nh-mail-content">{mailOpened || guided ? <><small>재무지원팀 · 오후 2:03</small><h2>[보완 요청] {requestId} 출장비 정산</h2><p>안녕하세요. 부산 출장 정산 건의 <b>숙박 영수증</b>이 누락되어 보완을 요청드립니다.</p><dl><div><dt>정산번호</dt><dd>{requestId}</dd></div><div><dt>항목</dt><dd>숙박비 · 184,000원</dd></div><div><dt>요청사항</dt><dd>숙박 영수증 추가 첨부</dd></div></dl><p>통합업무포털에서 증빙을 추가한 뒤 다시 제출해 주세요.</p></> : <div className="nh-empty-app"><Mail size={38} /><p>확인할 메일을 선택하세요.</p></div>}</section>
  </div>
}

function ExcelApp({ phase, guideStep, rowSelected, onRowSelect }: WorkWindowProps) {
  const guided = phase === 'guide' && guideStep === 1
  const captureTarget = phase === 'capture' && !rowSelected
  return <div className="nh-excel-app">
    <div className="nh-excel-tabs"><b>파일</b><span>홈</span><span>삽입</span><span>페이지 레이아웃</span><span>수식</span><span>데이터</span><span>검토</span><span>보기</span></div>
    <div className="nh-excel-ribbon"><button>붙여넣기</button><button>복사</button><button>정렬 및 필터</button><button>조건부 서식</button><button>표 서식</button></div>
    <div className="nh-formula"><span>D12</span><b>fx</b><p>{rowSelected || guided ? requestId : ''}</p></div>
    <table className="nh-sheet"><thead><tr><th /><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr></thead><tbody>
      <tr><th>1</th><td>정산번호</td><td>출장일</td><td>지역</td><td>항목</td><td>금액</td><td>상태</td></tr>
      <tr><th>2</th><td>TR-2026-0807</td><td>2026-08-07</td><td>대전</td><td>교통비</td><td>68,000원</td><td>완료</td></tr>
      <tr className={`${rowSelected ? 'selected' : ''} ${guided ? 'nh-guide-target' : ''} ${captureTarget ? 'nh-capture-target' : ''}`} onClick={onRowSelect}><th>3</th><td>{requestId}</td><td>2026-08-12</td><td>부산</td><td>숙박비</td><td>184,000원</td><td>보완 요청</td></tr>
      <tr><th>4</th><td>TR-2026-0816</td><td>2026-08-16</td><td>울산</td><td>식비</td><td>42,000원</td><td>검토 중</td></tr>
      {Array.from({ length: 10 }).map((_, index) => <tr key={index}><th>{index + 5}</th><td /><td /><td /><td /><td /><td /></tr>)}
    </tbody></table><div className="nh-excel-status"><span>준비</span><b>출장비 정산 내역</b><span>100%</span></div>
  </div>
}

function ExplorerApp({ phase, guideStep, fileSelected, onFileSelect }: WorkWindowProps) {
  const guided = phase === 'guide' && guideStep === 2
  const captureTarget = phase === 'capture' && !fileSelected
  return <div className="nh-explorer-app">
    <div className="nh-explorer-tools"><button>새로 만들기</button><button>잘라내기</button><button>복사</button><button>붙여넣기</button><button>정렬</button><button>보기</button></div>
    <div className="nh-explorer-address"><button>←</button><button>→</button><p>문서 › 출장비 정산 › 부산 출장</p><label><Search size={14} /><input aria-label="파일 검색" placeholder="부산 출장 검색" /></label></div>
    <aside><button>홈</button><button>갤러리</button><hr /><button>바탕 화면</button><button>다운로드</button><button className="is-selected">문서</button><button>사진</button></aside>
    <section className="nh-file-grid"><button><FolderOpen size={43} /><span>교통비 증빙</span></button><button><FolderOpen size={43} /><span>회의 자료</span></button><button className={`${fileSelected ? 'is-selected' : ''} ${guided ? 'nh-guide-target' : ''} ${captureTarget ? 'nh-capture-target' : ''}`} onClick={onFileSelect}><FileText size={43} /><span>숙박_영수증.pdf</span><small>PDF · 428KB</small></button><button><FileSpreadsheet size={43} /><span>출장비_정산내역.xlsx</span><small>Excel · 32KB</small></button></section>
    <footer>4개 항목 | {fileSelected ? '1개 항목 선택됨' : '항목을 선택하세요'}</footer>
  </div>
}

function PortalApp({ phase, guideStep, attached, reason, submitted, onAttach, onReasonChange, onSubmit }: WorkWindowProps) {
  const attachGuided = phase === 'guide' && guideStep === 3
  const submitGuided = phase === 'guide' && guideStep === 4
  const attachCaptureTarget = phase === 'capture' && !attached
  const reasonCaptureTarget = phase === 'capture' && attached && !reason.trim()
  const submitCaptureTarget = phase === 'capture' && attached && Boolean(reason.trim()) && !submitted
  const effectiveAttached = phase === 'guide' ? guideStep >= 4 : attached
  return <div className="nh-portal-app">
    <header><div className="nh-portal-brand"><i /> SK 통합업무포털</div><nav><button>업무</button><button>전자결재</button><button>인사</button><button>비용·자산</button><button>예약·시설</button></nav><span>김노하 님</span></header>
    <aside><b>비용·자산</b><button>법인카드 정산</button><button className="is-selected">개인비용 청구</button><button>출장 신청</button><button>정산 현황</button><button>자산 신청</button></aside>
    <section><p className="nh-breadcrumb">비용·자산 › 개인비용 청구 › 보완 요청</p><div className="nh-portal-heading"><div><h2>출장비 정산 보완</h2><p>요청된 증빙과 사유를 등록해 주세요.</p></div><span>보완 요청</span></div>
      <div className="nh-request-summary"><div><small>정산번호</small><b>{requestId}</b></div><div><small>출장지</small><b>부산</b></div><div><small>정산금액</small><b>184,000원</b></div><div><small>요청항목</small><b>숙박 영수증</b></div></div>
      <div className="nh-portal-form"><label><span className="nh-field-label">증빙 파일 <em>*</em></span><div><button className={`${attachGuided ? 'nh-guide-target' : ''} ${attachCaptureTarget ? 'nh-capture-target' : ''}`} onClick={onAttach}><FolderOpen size={16} /> 파일 선택</button><span>{effectiveAttached ? '숙박_영수증.pdf · 428KB' : '선택된 파일이 없습니다.'}</span>{effectiveAttached && <CheckCircle2 size={17} />}</div></label>
        <label><span className="nh-field-label">보완 사유 <em>*</em></span><textarea className={reasonCaptureTarget ? 'nh-capture-target' : ''} aria-label="보완 사유" value={phase === 'guide' ? '숙박 영수증을 추가 첨부합니다.' : reason} onChange={(event) => onReasonChange(event.target.value)} placeholder="보완 사유를 입력하세요." /></label>
        <div className="nh-portal-notice"><b>제출 전 확인</b><p>첨부한 파일과 정산 금액을 확인한 뒤 제출해 주세요.</p></div>
        <div className="nh-portal-actions"><button>임시 저장</button><button className={`primary ${submitGuided ? 'nh-guide-target' : ''} ${submitCaptureTarget ? 'nh-capture-target' : ''}`} onClick={onSubmit}>{submitted ? '제출 완료' : '보완 자료 제출'}</button></div>
      </div>
    </section>
  </div>
}

type NoHowPanelProps = { phase: Phase; events: string[]; captureReady: boolean; captureInstruction: string; query: string; guideStep: number; onStart: () => void; onStop: () => void; onShare: () => void; onContinue: () => void; onQuery: (value: string) => void; onOpenManual: () => void }

function NoHowPanel(props: NoHowPanelProps) {
  const { phase } = props
  if (phase === 'structuring') return <StructureOverlay />
  if (phase === 'review') return <ManualReview onShare={props.onShare} />
  if (phase === 'shared') return <ShareSuccess onContinue={props.onContinue} />
  if (phase === 'library') return <ManualLibrary query={props.query} onQuery={props.onQuery} onOpen={props.onOpenManual} />
  if (phase === 'success') return <GuideSuccess />
  return <aside className={`nh-panel ${phase === 'guide' ? 'is-guide' : ''}`} aria-label="NoHow 패널">
    <div className="nh-panel-header"><span className="nh-brand"><i /> NoHow</span>{phase === 'capture' && <span className="nh-recording"><i /> REC</span>}{phase === 'guide' && <span className="nh-guide-mode">LIVE GUIDE</span>}</div>
    {phase === 'welcome' && <div className="nh-panel-welcome"><div className="nh-welcome-visual"><Monitor size={35} /><span><MousePointer2 size={19} /></span></div><p className="nh-eyebrow">WORK CAPTURE</p><h1>평소처럼 일하면<br />매뉴얼이 완성됩니다.</h1><p>메일과 Excel, 파일 탐색기와 사내 프로그램을 오가는 업무도 하나의 과정으로 기록합니다.</p><button className="nh-primary" onClick={props.onStart}><Play size={17} fill="currentColor" /> 매뉴얼 만들기</button><div className="nh-mini-flow"><span>기록</span><ChevronRight size={13} /><span>AI 정리</span><ChevronRight size={13} /><span>공유</span><ChevronRight size={13} /><span>안내</span></div></div>}
    {phase === 'capture' && <div className="nh-panel-capture"><p className="nh-eyebrow">업무 기록 중</p><h2>출장비 정산 보완</h2><div className="nh-event-total"><strong>{Math.max(4, props.events.length * 3 + 1)}</strong><span>개의 화면과 행동을<br />기록하고 있습니다.</span></div><div className="nh-app-chips">{Object.entries(appMeta).map(([key, meta]) => { const Icon = meta.icon; return <span key={key}><Icon size={12} /> {meta.label}</span> })}</div><div className="nh-capture-next"><MousePointer2 size={17} /><p><span>다음 작업</span><b>{props.captureInstruction}</b></p></div><div className="nh-recent-events"><b>최근 기록</b>{props.events.slice(-4).reverse().map((event, index) => <p key={event} className={index === 0 ? 'current' : ''}>{index === 0 ? <span /> : <Check size={13} />} {event}</p>)}</div><button className={`nh-primary ${props.captureReady ? 'nh-capture-target nh-capture-target-panel' : ''}`} disabled={!props.captureReady} onClick={props.onStop}>{props.captureReady ? '기록 종료하고 매뉴얼 만들기' : '업무를 완료하면 기록을 종료할 수 있습니다.'}</button></div>}
    {phase === 'guide' && <div className="nh-panel-guide"><p className="nh-eyebrow">출장비 정산 보완</p><h2>{props.guideStep + 1} / {manualSteps.length}</h2><div className="nh-guide-card"><span>{manualSteps[props.guideStep].app}</span><h3>{manualSteps[props.guideStep].title}</h3><p>{manualSteps[props.guideStep].detail}</p></div><div className="nh-guide-progress">{manualSteps.map((step, index) => <i key={step.title} className={index < props.guideStep ? 'done' : index === props.guideStep ? 'active' : ''}>{index < props.guideStep ? <Check size={11} /> : index + 1}</i>)}</div><div className="nh-guide-hint"><MousePointer2 size={16} /><p><b>현재 화면에서 바로 따라 하세요.</b><span>파란색으로 표시된 위치를 직접 선택하면 다음 단계로 이동합니다.</span></p></div></div>}
  </aside>
}

function StructureOverlay() {
  return <section className="nh-center-modal nh-structure-modal"><div className="nh-ai-orbit"><Bot size={31} /><i /><i /><i /></div><p className="nh-eyebrow">AI STRUCTURE</p><h2>업무 과정을 매뉴얼로 정리하고 있습니다.</h2><p>화면과 클릭, 프로그램 전환을 연결해 의미 있는 업무 단계를 찾습니다.</p><div className="nh-structure-progress"><span /></div><div className="nh-structure-status"><span><Check size={14} /> 28개 화면과 행동 확인</span><span><Check size={14} /> 4개 프로그램 연결</span><span className="active"><Sparkles size={14} /> 업무 단계와 설명 생성 중</span></div></section>
}

function ManualReview({ onShare }: { onShare: () => void }) {
  return <section className="nh-manual-modal"><header><div><p className="nh-eyebrow">AI가 정리한 매뉴얼</p><h2>출장비 정산 보완</h2><span>28개 행동을 5개의 업무 단계로 정리했습니다.</span></div><button className="nh-primary" onClick={onShare}><Share2 size={16} /> 구성원들과 공유하기</button></header><div className="nh-manual-meta"><span>메일</span><span>Excel</span><span>파일 탐색기</span><span>업무 포털</span><b>예상 소요 4분</b></div><div className="nh-manual-step-grid">{manualSteps.map((step, index) => <article key={step.title}><i>{index + 1}</i><div className={`nh-step-thumb thumb-${index + 1}`}><span>{step.app}</span><MousePointer2 size={16} /></div><div><small>{step.app}</small><h3>{step.title}</h3><p>{step.detail}</p></div><button aria-label={`${index + 1}단계 수정`}>수정</button></article>)}</div></section>
}

function ShareSuccess({ onContinue }: { onContinue: () => void }) {
  return <section className="nh-center-modal nh-shared-modal"><div className="nh-success-mark"><Check size={34} /></div><p className="nh-eyebrow">KNOWLEDGE SHARING</p><h2>업무 매뉴얼을 공유했습니다.</h2><p>재무지원팀 구성원이라면 누구나 이 매뉴얼을 검색하고 사용할 수 있습니다.</p><div className="nh-share-people"><span>김</span><span>이</span><span>박</span><span>+24</span></div><button className="nh-primary" onClick={onContinue}>다른 구성원의 화면에서 이어보기 <ArrowRight size={16} /></button></section>
}

function ManualLibrary({ query, onQuery, onOpen }: { query: string; onQuery: (value: string) => void; onOpen: () => void }) {
  const showResult = query.length > 4
  return <section className="nh-library-modal"><header><span className="nh-brand"><i /> NoHow</span><div><CircleUserRound size={18} /> 이노하 · 재무지원팀</div></header><div className="nh-library-content"><p className="nh-eyebrow">다른 구성원의 업무 화면</p><h2>필요한 업무 매뉴얼을 찾아보세요.</h2><label className="nh-library-search"><Search size={20} /><input autoFocus aria-label="업무 매뉴얼 검색" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="어떤 업무를 수행하려고 하나요?" /></label>{showResult ? <button className="nh-search-result" onClick={onOpen}><div className="nh-search-icon"><FileText size={23} /></div><div><span>가장 관련 있는 매뉴얼 · 재무지원팀</span><h3>출장비 정산 보완</h3><p>메일 → Excel → 파일 탐색기 → 통합업무포털 · 5단계 · 약 4분</p></div><ArrowRight size={21} /></button> : <div className="nh-library-recent"><p>최근 많이 사용한 매뉴얼</p><span>법인카드 정산</span><span>휴가 신청 변경</span><span>출장 결과 보고</span></div>}</div></section>
}

function GuideSuccess() {
  return <section className="nh-center-modal nh-guide-success"><div className="nh-success-mark"><Check size={37} /></div><p className="nh-eyebrow">LIVE GUIDE COMPLETE</p><h2>출장비 정산 보완을 완료했습니다.</h2><p>NoHow 매뉴얼의 5단계를 실제 업무 화면에서 모두 수행했습니다.</p><div className="nh-complete-summary"><span><b>4개</b> 사용한 프로그램</span><span><b>5단계</b> 완료한 업무</span><span><b>4분</b> 예상 소요 시간</span></div><blockquote>한 사람의 업무 경험이 모든 구성원의 매뉴얼이 됩니다.</blockquote></section>
}
