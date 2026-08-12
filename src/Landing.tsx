import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  AppWindow,
  Circle,
  MousePointer2,
  Play,
  ScanSearch,
  ShieldCheck,
  UserRound,
  GitMerge,
  Route,
} from 'lucide-react'

type LandingProps = {
  onDemo: () => void
}

const legacyRows = [
  ['WF-3912', '복리후생 신청', '결재대기'],
  ['WF-3904', '출장 정산 보완', '반려'],
  ['WF-3897', '근태 변경 신청', '진행중'],
  ['WF-3881', '증명서 발급', '완료'],
]

export function Landing({ onDemo }: LandingProps) {
  return (
    <main className="landing">
      <nav className="landing-nav" aria-label="주요 메뉴">
        <button className="wordmark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="wordmark-dot" />
          여기만
        </button>
        <div className="nav-links">
          <a href="#why">왜 여기만인가</a>
          <a href="#how">작동 방식</a>
          <button className="nav-demo" onClick={onDemo}>
            데모 열기 <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy hero-reveal">
          <p className="hero-kicker">AI IDEA LEAGUE · WORKING POC</p>
          <h1>
            여기까지 온 경로가,
            <br />
            <span>곧 프롬프트입니다.</span>
          </h1>
          <p className="hero-description">
            여기만은 최근 클릭과 현재 화면을 사이트 기능 지도에 겹쳐, 사용자가 하려던 업무와
            필요한 원본 단계만 보여줍니다. 질문을 입력하지 않아도 맥락이 근거와 함께 드러납니다.
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={onDemo}>
              3분 데모 시작 <Play size={17} fill="currentColor" />
            </button>
            <a className="text-cta" href="#how">
              어떻게 다른가요 <ArrowRight size={16} />
            </a>
          </div>
          <p className="security-caption">
            <ShieldCheck size={15} /> 가상 데이터만 사용한 보안 친화적 시연 환경
          </p>
        </div>

        <div className="hero-product hero-reveal hero-reveal-late" aria-label="여기만 제품 미리보기">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots"><i /><i /><i /></div>
              <div className="browser-address">portal.hanbit.demo / main</div>
              <div className="browser-menu">•••</div>
            </div>
            <div className="browser-body">
              <div className="legacy-mini">
                <div className="legacy-mini-head">
                  <b>HANBIT WORKS</b>
                  <span>통합업무지원시스템</span>
                  <small>사용자 10002491</small>
                </div>
                <div className="legacy-mini-body">
                  <aside>
                    {['업무관리', '전자결재', '인사관리', '복리후생', '시설예약', '자산관리', '증명서', '시스템관리'].map((item) => (
                      <span key={item}>{item}<ChevronRight size={9} /></span>
                    ))}
                  </aside>
                  <div className="legacy-mini-content">
                    <div className="legacy-tabs"><b>나의 업무</b><span>공지사항</span><span>처리현황</span><span>바로가기</span></div>
                    <div className="legacy-widgets">
                      <div><b>결재 대기함</b><strong>17</strong><small>오늘 4건 추가</small></div>
                      <div><b>미처리 업무</b><strong>06</strong><small>기한 초과 2건</small></div>
                      <div><b>공지사항</b><strong>24</strong><small>필독 3건</small></div>
                    </div>
                    <table>
                      <tbody>
                        {legacyRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="preview-dim" />
              <div className="preview-panel">
                <div className="preview-panel-top">
                  <span className="mini-brand"><i /> 여기만</span>
                  <span className="connected"><i /> 연결됨</span>
                </div>
              <div className="preview-trace">
                <div className="preview-trace-head"><small>실시간 Intent Trace</small><b>3/5</b></div>
                {['복지 포인트', '제휴 복지몰', '회원관리'].map((item, index) => (
                  <p key={item}><i>{index + 1}</i><span>{item}<small>최근 클릭</small></span><Check size={12} /></p>
                ))}
              </div>
              <div className="preview-intersection"><GitMerge size={13} /> 3개의 단서가 같은 업무에서 만남</div>
                <div className="preview-result">
                  <div className="result-label"><ScanSearch size={14} /> Capability Graph · v1.0</div>
                  <h3>제휴 복지몰 회원 해지</h3>
                  <p>복리후생 › 제휴 복지몰 › 회원관리 경로와 최근 행동이 일치했습니다.</p>
                  <div className="mini-step"><span>1</span><p><b>소멸 예정 포인트 확인</b><small>12,480 P</small></p><Check size={15} /></div>
                  <div className="mini-step active"><span>2</span><p><b>약관 읽고 동의</b><small>사람이 직접 확인해요</small></p><MousePointer2 size={15} /></div>
                  <button className="preview-action">이 목적이 맞아요 <ArrowRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="human-badge"><MousePointer2 size={16} /> 사람의 클릭</div>
        </div>
      </section>

      <section className="statement-section" id="why">
        <p className="section-index">01 / 관점의 전환</p>
        <div className="statement-copy">
          <h2>목적을 물어보기 전에,<br />도달한 경로를 읽습니다.</h2>
          <p>
            사용자는 이미 메뉴를 열고, 목록을 살피고, 특정 화면에 도착하며 목적의 단서를 남깁니다.
            여기만은 그 단서를 사이트의 기능 구조와 대조해 목적 후보와 근거를 함께 보여주고,
            약관 동의·비용 결재·회원 탈퇴처럼 책임이 필요한 순간은 사람이 직접 이어갑니다.
          </p>
        </div>
        <div className="handoff-line" aria-label="AI와 사람의 역할 분담">
          <div className="role role-ai">
            <Bot size={24} />
            <small>AI가 먼저</small>
            <strong>찾고 · 읽고 · 연결합니다</strong>
          </div>
          <div className="baton"><span>HAND<br />OFF</span><ArrowRight size={28} /></div>
          <div className="role role-human">
            <UserRound size={24} />
            <small>사람이 끝까지</small>
            <strong>이해하고 · 선택하고 · 확정합니다</strong>
          </div>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="how-heading">
          <p className="section-index">02 / 작동 방식</p>
          <h2>두 지도를 겹치면,<br />목적이 보입니다.</h2>
        </div>
        <div className="how-rail">
          <article>
            <span>1</span>
            <div><h3>Capability Graph를 만듭니다</h3><p>DOM, 메뉴, 버튼, 화면 이동, 선행 조건과 위험도를 시스템별 기능 지도로 버전 관리합니다.</p></div>
          </article>
          <article>
            <span>2</span>
            <div><h3>Intent Trace를 모읍니다</h3><p>현재 화면과 최근 클릭의 이름만 세션에 보존합니다. 입력값과 문서 내용은 목적 추론에 사용하지 않습니다.</p></div>
          </article>
          <article>
            <span>3</span>
            <div><h3>교차 근거를 보여줍니다</h3><p>두 지도에서 만난 업무와 일치한 단서를 제안하고, 확인된 원본 약관·입력창·실행 버튼만 연결합니다.</p></div>
          </article>
        </div>
      </section>

      <section className="access-section">
        <div className="access-mark" aria-hidden="true">
          <Circle /><Circle /><Circle />
        </div>
        <p className="section-index">03 / 확장 가능성</p>
        <h2>누구에게나 같은 웹이<br />같이 쉬운 것은 아니니까.</h2>
        <p>
          작은 글씨와 깊은 메뉴에 익숙하지 않은 고령자, 손의 움직임이 불편한 사용자, 처음 접하는 업무 시스템 앞의
          신규 구성원까지. 여기만은 기존 시스템을 다시 만드는 비용 없이 각 사람에게 필요한 인터페이스를 건넵니다.
        </p>
        <div className="access-tags">
          <span>사내 레거시 시스템</span><span>공공 웹서비스</span><span>시니어 접근성</span><span>모바일·앱 확장</span>
        </div>
      </section>

      <section className="final-cta-section">
        <div>
          <p className="section-index">직접 확인해 보세요</p>
          <h2>세 번의 클릭이<br /><span>하나의 목적</span>이 되는 순간.</h2>
        </div>
        <button className="final-cta" onClick={onDemo}>
          <AppWindow size={21} /> 작동하는 POC 열기 <ArrowRight size={19} />
        </button>
      </section>

      <footer>
        <span className="wordmark"><i className="wordmark-dot" /> 여기만</span>
        <p><Route size={13} /> 사용자가 온 경로가 곧 프롬프트입니다.</p>
        <small>2026 SK AI Hackathon · AI Idea League</small>
      </footer>
    </main>
  )
}
