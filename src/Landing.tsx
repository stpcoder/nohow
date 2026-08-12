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
            <span>방금 누른 메뉴로</span>
            <br />하려던 일을 찾습니다.
          </h1>
          <p className="hero-description">
            여기만은 최근에 누른 메뉴를 사이트의 업무 지도와 대조해 지금 필요한 원본 기능을 보여줍니다.
            약관 확인과 최종 실행은 사용자가 직접 진행합니다.
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
                <div className="preview-trace-head"><small>최근 이동 경로</small><b>3/5</b></div>
                {['복지 포인트', '제휴 복지몰', '회원관리'].map((item, index) => (
                  <p key={item}><i>{index + 1}</i><span>{item}<small>최근 클릭</small></span><Check size={12} /></p>
                ))}
              </div>
              <div className="preview-intersection"><GitMerge size={13} /> 최근 메뉴 3개가 회원 해지와 연결됨</div>
                <div className="preview-result">
                  <div className="result-label"><ScanSearch size={14} /> 사이트 업무 지도</div>
                  <h3>제휴 복지몰 회원 해지</h3>
                  <p>복리후생 › 제휴 복지몰 › 회원관리 경로에서 찾았습니다.</p>
                  <div className="mini-step"><span>1</span><p><b>소멸 예정 포인트 확인</b><small>12,480 P</small></p><Check size={15} /></div>
                  <div className="mini-step active"><span>2</span><p><b>약관 읽고 동의</b><small>사람이 직접 확인해요</small></p><MousePointer2 size={15} /></div>
                  <button className="preview-action">찾던 업무가 맞아요 <ArrowRight size={14} /></button>
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
          <h2>최근에 누른 메뉴를 보면<br />찾는 업무를 알 수 있습니다.</h2>
          <p>
            사용자는 필요한 화면을 찾으며 이미 관련 메뉴를 누릅니다. 여기만은 그 메뉴를 사이트의 업무 지도와
            비교합니다. 같은 업무에 연결된 메뉴가 모이면 업무 이름과 처리 순서를 보여줍니다. 약관 동의와 최종
            신청은 사용자가 직접 진행합니다.
          </p>
        </div>
        <div className="handoff-line" aria-label="AI와 사람의 역할 분담">
          <div className="role role-ai">
            <Bot size={24} />
            <small>여기만</small>
            <strong>업무 찾기 · 원본 위치 안내</strong>
          </div>
          <div className="baton"><span>HAND<br />OFF</span><ArrowRight size={28} /></div>
          <div className="role role-human">
            <UserRound size={24} />
            <small>사용자</small>
            <strong>약관 확인 · 입력 · 최종 실행</strong>
          </div>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="how-heading">
          <p className="section-index">02 / 작동 방식</p>
          <h2>최근 이동 경로에서<br />업무를 찾습니다.</h2>
        </div>
        <div className="how-rail">
          <article>
            <span>1</span>
            <div><h3>사이트의 업무 지도를 만듭니다</h3><p>메뉴, 버튼, 화면 이동, 선행 조건을 연결해 실제 업무가 어디에서 시작되고 끝나는지 정리합니다.</p></div>
          </article>
          <article>
            <span>2</span>
            <div><h3>최근에 누른 메뉴를 확인합니다</h3><p>현재 화면과 최근 메뉴 이름만 이 탭에 보관합니다. 입력값과 문서 내용은 수집하지 않습니다.</p></div>
          </article>
          <article>
            <span>3</span>
            <div><h3>찾은 이유를 함께 보여줍니다</h3><p>어떤 메뉴가 업무와 연결됐는지 보여주고, 확인된 원본 약관과 실행 버튼으로 안내합니다.</p></div>
          </article>
        </div>
      </section>

      <section className="access-section">
        <div className="access-mark" aria-hidden="true">
          <Circle /><Circle /><Circle />
        </div>
        <p className="section-index">03 / 확장 가능성</p>
        <h2>복잡한 화면을<br />각자에게 맞게 정리합니다.</h2>
        <p>
          화면 오른쪽에 큰 글씨, 쉬운 설명, 필요한 기능만 표시할 수 있습니다. 기존 시스템을 교체하지 않고 사내 포털,
          공공 웹서비스와 모바일 웹에 같은 방식으로 적용할 수 있습니다.
        </p>
        <div className="access-tags">
          <span>사내 레거시 시스템</span><span>공공 웹서비스</span><span>시니어 접근성</span><span>모바일·앱 확장</span>
        </div>
      </section>

      <section className="final-cta-section">
        <div>
          <p className="section-index">직접 확인해 보세요</p>
          <h2>세 번의 클릭으로<br /><span>필요한 업무를 찾습니다.</span></h2>
        </div>
        <button className="final-cta" onClick={onDemo}>
          <AppWindow size={21} /> 작동하는 POC 열기 <ArrowRight size={19} />
        </button>
      </section>

      <footer>
        <span className="wordmark"><i className="wordmark-dot" /> 여기만</span>
        <p><Route size={13} /> 최근 이동 경로에서 필요한 업무를 찾습니다.</p>
        <small>2026 SK AI Hackathon · AI Idea League</small>
      </footer>
    </main>
  )
}
