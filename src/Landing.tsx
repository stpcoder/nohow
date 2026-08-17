import {
  ArrowRight,
  AppWindow,
  BookOpenCheck,
  Check,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Globe2,
  Mail,
  Monitor,
  MousePointer2,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react'
import nohowDemoVideo from '../qa/video/nohow-demo.mp4?url'
import nohowDemoPoster from '../qa/screenshots/nohow-demo-start.png?url'

const workApps = [
  { icon: Mail, name: '메일', detail: '보완 요청 확인' },
  { icon: FileSpreadsheet, name: 'Excel', detail: '정산 내역 조회' },
  { icon: FolderOpen, name: '파일 탐색기', detail: '증빙 파일 선택' },
  { icon: AppWindow, name: '업무 포털', detail: '보완 자료 등록' },
]

const capturedEvents = [
  ['메일', '보완 요청 메일 열기'],
  ['메일', '정산번호 TR-2026-0812 확인'],
  ['Excel', '출장비 정산 내역 검색'],
  ['Excel', '대상 정산 건 선택'],
  ['파일 탐색기', '숙박 영수증 파일 선택'],
  ['업무 포털', '개인비용 청구 메뉴 열기'],
  ['업무 포털', '보완 자료 첨부'],
  ['업무 포털', '처리 결과 확인'],
]

const manualSteps = [
  ['메일', '보완 요청 내용을 확인합니다.'],
  ['Excel', '대상 정산 건을 찾습니다.'],
  ['파일 탐색기', '누락된 증빙 파일을 준비합니다.'],
  ['업무 포털', '보완 자료와 사유를 등록합니다.'],
  ['업무 포털', '제출 결과를 확인합니다.'],
]

const capabilities = [
  { icon: Monitor, title: '평소처럼 일하면 업무 과정을 기록합니다.' },
  { icon: Sparkles, title: 'AI가 행동을 의미 있는 업무 단계로 정리합니다.' },
  { icon: Share2, title: '완성된 매뉴얼을 구성원들과 공유합니다.' },
  { icon: MousePointer2, title: '실제 업무 화면에서 다음 행동을 안내합니다.' },
]

export function Landing({ onDemo }: { onDemo: () => void }) {
  return (
    <main className="landing">
      <nav className="landing-nav" aria-label="주요 메뉴">
        <button className="wordmark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="wordmark-dot" />
          NoHow
        </button>
        <div className="nav-links">
          <a href="#problem">문제</a>
          <a href="#solution">작동 방식</a>
          <a href="#knowledge">조직 지식</a>
          <a href="#demo-video">데모 영상</a>
          <button className="nav-demo" onClick={onDemo}>NoHow 체험하기 <ArrowRight size={15} /></button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy hero-reveal">
          <h1>
            당신의 업무 경험을,
            <br /><span className="hero-highlight">모두의 노하우로 남기세요.</span>
          </h1>
          <p className="hero-description">
            <span>평소처럼 업무를 수행하면 NoHow가 과정을 매뉴얼로 만듭니다.</span>
            <span>완성된 업무 경험을 다른 구성원들과 공유하세요.</span>
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={onDemo}>NoHow 데모 체험하기 <ArrowRight size={17} /></button>
            <a className="text-cta" href="#demo-video">
              데모 영상 보기 <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="hero-product hero-reveal hero-reveal-late" aria-label="NoHow 업무 기록 화면 미리보기">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="windows-desktop-frame">
            <div className="windows-desktop-surface">
              <div className="windows-window window-mail">
                <div className="windows-titlebar"><span><Mail size={10} /> 메일</span><small>—  □  ×</small></div>
                <div className="mail-mock-body">
                  <aside><i /><i /><i /></aside>
                  <article><small>재무지원팀</small><b>[보완 요청] TR-2026-0812 출장비 정산</b><p>숙박비 증빙이 누락되었습니다.</p></article>
                </div>
              </div>

              <div className="windows-window window-excel">
                <div className="windows-titlebar excel-titlebar"><span><FileSpreadsheet size={10} /> 출장비_정산내역_8월.xlsx</span><small>—  □  ×</small></div>
                <div className="excel-ribbon"><b>파일</b><span>홈</span><span>삽입</span><span>데이터</span><span>검토</span></div>
                <div className="excel-formula">fx · TR-2026-0812</div>
                <table><tbody>
                  <tr><th>정산번호</th><th>항목</th><th>금액</th><th>상태</th></tr>
                  <tr><td>TR-2026-0807</td><td>교통비</td><td>68,000</td><td>완료</td></tr>
                  <tr className="excel-selected"><td>TR-2026-0812</td><td>숙박비</td><td>184,000</td><td>보완 요청</td></tr>
                  <tr><td>TR-2026-0816</td><td>식비</td><td>42,000</td><td>검토 중</td></tr>
                </tbody></table>
              </div>

              <div className="windows-window window-explorer">
                <div className="windows-titlebar"><span><FolderOpen size={10} /> 파일 탐색기</span><small>—  □  ×</small></div>
                <div className="explorer-path">출장비 정산 〉 부산 출장</div>
                <div className="explorer-files"><span><FolderOpen size={14} /> 교통비</span><span className="selected"><FileText size={14} /> 숙박_영수증.pdf</span></div>
              </div>

              <div className="windows-window window-portal">
                <div className="windows-titlebar portal-titlebar"><span><AppWindow size={10} /> 통합업무포털</span><small>—  □  ×</small></div>
                <div className="portal-mock-body"><small>비용·자산 〉 개인비용 청구</small><b>정산 보완 요청</b><span>TR-2026-0812</span><button>증빙 첨부</button></div>
              </div>

              <aside className="nohow-capture-panel">
                <div className="capture-panel-head">
                  <span className="mini-brand"><i /> NoHow</span>
                  <span className="capture-live"><i /> REC</span>
                </div>
                <div className="capture-panel-content">
                  <p>업무 기록 중</p>
                  <h3>출장비 정산 보완</h3>
                  <div className="capture-count"><strong>28</strong><span>개의 행동을 기록했습니다.</span></div>
                  <div className="capture-apps">
                    {workApps.map(({ icon: Icon, name }) => <span key={name}><Icon size={12} /> {name}</span>)}
                  </div>
                  <div className="capture-recent">
                    <b>최근 기록</b>
                    <p><Check size={11} /> 숙박 영수증 파일 선택</p>
                    <p><Check size={11} /> 보완 자료 첨부</p>
                    <p className="is-current"><span /> 처리 결과 확인 중</p>
                  </div>
                  <button>기록 종료</button>
                </div>
              </aside>

              <div className="windows-taskbar" aria-hidden="true">
                <i className="windows-start"><span /><span /><span /><span /></i>
                <Search size={13} />
                <Mail size={13} />
                <FileSpreadsheet size={13} />
                <FolderOpen size={13} />
                <AppWindow size={13} />
                <time>오후 2:18</time>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-video-section" id="demo-video">
        <div className="demo-video-heading">
          <h2>업무 경험이 매뉴얼이 되는 과정을 확인하세요.</h2>
          <p>메일과 Excel, 파일 탐색기와 사내 시스템을 오가는 NoHow POC입니다.</p>
        </div>
        <div className="demo-video-frame">
          <video controls playsInline preload="auto" poster={nohowDemoPoster} aria-label="NoHow 출장비 정산 보완 POC 데모 영상">
            <source src={nohowDemoVideo} type="video/mp4" />
          </video>
        </div>
        <div className="demo-video-note"><span>전체 데모 · 1분 43초</span><button className="nav-demo" onClick={onDemo}>직접 체험하기 <ArrowRight size={14} /></button></div>
      </section>

      <section className="friction-section" id="problem">
        <div className="friction-copy">
          <h2>찾고, 묻고, 다시 배우느라<br /><span className="accent-line">업무 시간이 낭비됩니다.</span></h2>
          <p>누군가 이미 해결한 업무도 기록이 남지 않으면 같은 탐색과 설명을 반복하게 됩니다.</p>
        </div>
        <div className="friction-data">
          <div className="friction-metrics">
            <article><strong>1,100회+</strong><p>하루 동안 업무 앱 사이를 오간 횟수</p></article>
            <article><strong>최대 35개</strong><p>한 사람이 업무에 사용하는 핵심 애플리케이션</p></article>
            <article><strong>약 20%</strong><p>정보를 찾고 모으는 데 사용하는 업무시간</p></article>
          </div>
          <ol className="metric-sources" aria-label="통계 출처">
            <li>1) <a href="https://www.pega.com/about/news/press-releases/research-reveals-employees-switch-apps-over-1100-times-day" target="_blank" rel="noreferrer">Pega, 500만 시간의 업무 활동 분석, 2018 · 1,100회+, 최대 35개</a></li>
            <li>2) <a href="https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/capturing-business-value-with-social-technologies" target="_blank" rel="noreferrer">McKinsey Global Institute, 지식 근로자 업무 분석, 2012 · 약 20%</a></li>
          </ol>
        </div>
      </section>

      <section className="focus-section" id="solution">
        <div className="focus-heading">
          <h2>업무를 한 번 수행하면,<br /><span className="accent-line">매뉴얼이 완성됩니다.</span></h2>
          <p>NoHow가 화면과 클릭, 프로그램 전환을 기록하고 업무 매뉴얼로 정리합니다.</p>
        </div>

        <div className="focus-compare" aria-label="업무 기록과 NoHow 매뉴얼 비교">
          <div className="menu-noise event-capture-card">
            <div className="compare-title"><span>실제 업무 기록</span><b>28개 행동</b></div>
            <div className="event-list">
              {capturedEvents.map(([app, event], index) => (
                <p key={event}><i>{index + 1}</i><span><small>{app}</small><b>{event}</b></span><Check size={13} /></p>
              ))}
            </div>
          </div>
          <div className="compare-arrow"><ArrowRight size={24} /></div>
          <div className="menu-focus manual-card">
            <div className="compare-title"><span>NoHow 매뉴얼</span><b>5단계</b></div>
            <h3>출장비 정산 보완</h3>
            <div className="focus-step-list">
              {manualSteps.map(([app, label], index) => (
                <p key={label}><i>{index + 1}</i><span><small>{app}</small><b>{label}</b></span></p>
              ))}
            </div>
          </div>
        </div>

        <div className="control-policy">
          <div><BookOpenCheck size={22} /><p><b>기록되지 않은 업무 경험은 조직에 남아 있지 않습니다.</b></p></div>
          <ArrowRight className="policy-arrow" size={24} />
          <div><Share2 size={22} /><p><b>사용자가 확인한 매뉴얼을 구성원들과 공유합니다.</b></p></div>
        </div>
      </section>

      <section className="learning-section" id="knowledge">
        <div className="learning-heading">
          <h2>한 사람의 업무 경험이<br /><span className="accent-line">모든 구성원을 위한 매뉴얼이 됩니다.</span></h2>
          <p>업무를 수행하며 남긴 경험을 다른 구성원이 쉽게 찾고 실제 업무에서 바로 사용할 수 있습니다.</p>
        </div>

        <div className="learning-flow" aria-label="NoHow 주요 기능">
          {capabilities.map(({ icon: Icon, title }, index) => (
            <article key={title}><span>{index + 1}</span><Icon size={21} /><h3>{title}</h3></article>
          ))}
        </div>

        <div className="learning-insight">
          <Search size={25} />
          <p><b>여러 사람의 경험이 쌓일수록 조직의 노하우는 더 쉽게 공유됩니다.</b><span>업무명과 사용 프로그램, 업무 목적을 바탕으로 누구나 필요한 매뉴얼을 쉽게 찾고 사용할 수 있습니다.</span></p>
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-heading">
          <h2>어떤 업무 환경에서도,<br /><span className="accent-line">쉽고 빠르게 매뉴얼을 만들고 공유하세요.</span></h2>
        </div>
        <div className="platform-list">
          <article>
            <Globe2 size={22} />
            <div><h3>웹사이트 업무 기록</h3><p>Chrome 확장 프로그램이 웹사이트의 화면과 UI 요소를 기록하고 실제 화면에서 안내합니다.</p></div>
          </article>
          <article>
            <AppWindow size={22} />
            <div><h3>여러 프로그램의 업무 기록</h3><p>사내 프로그램 등 여러 프로그램을 오가는 업무도 하나의 매뉴얼로 기록합니다.</p></div>
          </article>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="final-cta-copy">
          <h2>당신의 업무 경험을,<br /><span>모두의 노하우로 남기세요.</span></h2>
          <p>한 사람의 업무 경험이 구성원들을 위한 매뉴얼이 됩니다.</p>
        </div>
        <a className="final-cta" href="#solution">
          <FileText size={21} /> NoHow 작동 방식 보기 <ArrowRight size={19} />
        </a>
      </section>

      <footer>
        <span className="wordmark"><i className="wordmark-dot" /> NoHow</span>
        <small>2026 SK AI Hackathon · AI Solution League</small>
      </footer>
    </main>
  )
}
