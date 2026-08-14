import {
  ArrowRight,
  AppWindow,
  Check,
  ChevronRight,
  Database,
  ExternalLink,
  GitMerge,
  Globe2,
  Monitor,
  MousePointer2,
  Play,
  Route,
  ScanSearch,
  ShieldCheck,
  UserRound,
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

const noisyMenus = [
  '복지 포인트',
  '제휴 복지몰',
  '경조사 지원',
  '휴양시설',
  '건강검진',
  '학자금 지원',
  '회원관리',
  '결재선 관리',
  '증명서 발급',
  '비용 정산',
  '자산 반납',
  '권한 신청',
]

const focusedSteps = [
  ['1', '소멸 예정 포인트 확인'],
  ['2', '탈퇴 약관 읽고 동의'],
  ['3', '해지 사유 선택 후 직접 신청'],
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
          <a href="#problem">문제</a>
          <a href="#solution">해결 방식</a>
          <a href="#learning">업무 지도</a>
          <button className="nav-demo" onClick={onDemo}>
            데모 열기 <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy hero-reveal">
          <h1>
            복잡한 사내 시스템에서
            <br /><span>필요한 메뉴만<br className="mobile-break" /> 보여줍니다.</span>
          </h1>
          <p className="hero-description">
            여기만은 화면의 버튼·링크·메뉴와 실제 이용 경로를 업무별로 정리합니다. AI는 목적에 맞는
            원본 메뉴를 추천하고, 약관 확인과 최종 실행은 사용자가 직접 합니다.
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={onDemo}>
              회원 해지 데모 보기 <Play size={17} fill="currentColor" />
            </button>
            <a className="text-cta" href="#solution">
              작동 원리 보기 <ArrowRight size={16} />
            </a>
          </div>
          <p className="security-caption">
            <ShieldCheck size={15} /> AI는 실행하지 않습니다. 원본 버튼은 사용자가 직접 클릭합니다.
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
                    <p key={item}><i>{index + 1}</i><span>{item}<small>사용자가 클릭</small></span><Check size={12} /></p>
                  ))}
                </div>
                <div className="preview-intersection"><GitMerge size={13} /> 42개 메뉴에서 회원 해지 업무를 찾음</div>
                <div className="preview-result">
                  <div className="result-label"><ScanSearch size={14} /> 필요한 메뉴</div>
                  <h3>제휴 복지몰 회원 해지</h3>
                  <p>원본 화면의 42개 메뉴를 필요한 3단계로 정리했습니다.</p>
                  <div className="mini-step"><span>1</span><p><b>소멸 예정 포인트 확인</b><small>12,480 P</small></p><Check size={15} /></div>
                  <div className="mini-step active"><span>2</span><p><b>탈퇴 약관 읽고 동의</b><small>사용자가 직접 확인합니다</small></p><MousePointer2 size={15} /></div>
                  <button className="preview-action">원본 메뉴 안내 <ArrowRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="human-badge"><MousePointer2 size={16} /> 최종 클릭은 사용자</div>
        </div>
      </section>

      <section className="friction-section" id="problem">
        <div className="friction-copy">
          <h2>전산 업무의 병목은<br />기능을 찾는 시간입니다.</h2>
          <p>
            시스템이 늘고 화면이 바뀔 때마다 사용자는 메뉴 위치와 처리 순서를 다시 익힙니다.
            이 탐색 비용은 신규 입사자에게만 생기지 않습니다. 가끔 쓰는 업무 앞에서는 숙련자도 같은 메뉴를 다시 찾습니다.
          </p>
        </div>
        <div className="friction-proof">
          <strong>1,100회+</strong>
          <p>운영지원 인력이 하루 동안 업무 앱을 전환한 횟수입니다.</p>
          <a href="https://www.pega.com/about/news/press-releases/research-reveals-employees-switch-apps-over-1100-times-day" target="_blank" rel="noreferrer">
            Pega, 약 500만 시간 데스크톱 활동 분석 <ExternalLink size={13} />
          </a>
        </div>
      </section>

      <section className="focus-section" id="solution">
        <div className="focus-heading">
          <h2>42개 메뉴에서<br />필요한 3단계만 남깁니다.</h2>
          <p>
            여기만은 원본 시스템을 바꾸지 않습니다. AI가 목적과 관련된 기능을 찾아 여기만 패널에 정리하고,
            사용자가 누를 원본 버튼의 위치를 안내합니다.
          </p>
        </div>

        <div className="focus-compare" aria-label="원본 시스템과 여기만 화면 비교">
          <div className="menu-noise">
            <div className="compare-title"><span>원본 시스템</span><b>42개 메뉴</b></div>
            <div className="noise-list">
              {noisyMenus.map((menu) => <span key={menu}>{menu}</span>)}
              <span className="more-menus">외 30개</span>
            </div>
          </div>
          <div className="compare-arrow"><ArrowRight size={24} /></div>
          <div className="menu-focus">
            <div className="compare-title"><span>여기만</span><b>3단계</b></div>
            <h3>제휴 복지몰 회원 해지</h3>
            <div className="focus-step-list">
              {focusedSteps.map(([number, label]) => (
                <p key={number}><i>{number}</i><span>{label}</span></p>
              ))}
            </div>
          </div>
        </div>

        <div className="control-policy">
          <div><ScanSearch size={22} /><p><small>여기만</small><b>메뉴 분석 · 업무 추천 · 원본 위치 안내</b></p></div>
          <ArrowRight className="policy-arrow" size={24} />
          <div><UserRound size={22} /><p><small>사용자</small><b>약관 확인 · 값 입력 · 최종 버튼 클릭</b></p></div>
        </div>
        <p className="control-note">AI가 체크박스나 신청 버튼을 대신 누르지 않아 오작동과 과도한 권한 위임 위험을 줄입니다.</p>
      </section>

      <section className="learning-section" id="learning">
        <div className="learning-heading">
          <h2>사용 경로가 쌓일수록<br />업무 지도가 정확해집니다.</h2>
          <p>
            여러 사용자가 실제로 거친 메뉴 순서를 개인 식별자 없이 합산합니다. AI는 반복되는 경로를 업무 후보로 묶고,
            시스템 운영자가 확인한 경로만 사용자에게 배포합니다.
          </p>
        </div>

        <div className="learning-flow" aria-label="업무 지도가 만들어지는 과정">
          <article><span>1</span><Monitor size={21} /><h3>화면 구조를 읽습니다</h3><p>버튼, 링크, 메뉴 이름과 화면 이동을 연결합니다.</p></article>
          <article><span>2</span><Database size={21} /><h3>이용 경로를 합칩니다</h3><p>여러 사용자가 반복해서 거친 메뉴 순서를 집계합니다.</p></article>
          <article><span>3</span><GitMerge size={21} /><h3>업무 후보로 묶습니다</h3><p>AI가 공통 경로와 완료 지점을 같은 업무로 정리합니다.</p></article>
          <article><span>4</span><ShieldCheck size={21} /><h3>운영자가 승인합니다</h3><p>권한과 선행 조건을 확인한 지도만 배포합니다.</p></article>
        </div>

        <div className="learning-insight">
          <Route size={25} />
          <p><b>업무 지도는 사용 안내에서 끝나지 않습니다.</b><span>자주 쓰는 경로, 반복해서 되돌아가는 구간, 거의 쓰지 않는 메뉴를 보여줘 교육 자료와 시스템 개선의 근거가 됩니다.</span></p>
        </div>
        <p className="privacy-note">입력값, 문서 내용과 개인별 성과는 업무 지도에 저장하지 않습니다.</p>
      </section>

      <section className="platform-section">
        <div className="platform-heading">
          <h2>웹에서 검증하고,<br />사내 실행 프로그램으로 확장합니다.</h2>
          <p>화면 요소를 읽는 방법은 달라도 결과는 같은 업무 지도에 저장됩니다.</p>
        </div>
        <div className="platform-list">
          <article>
            <Globe2 size={22} />
            <div><span>현재 POC · 구현됨</span><h3>웹 사이트</h3><p>Chrome 확장 프로그램이 DOM과 접근성 이름을 읽어 원본 메뉴를 연결합니다.</p></div>
          </article>
          <article>
            <AppWindow size={22} />
            <div><span>다음 단계 · 확장 설계</span><h3>사내 실행 프로그램</h3><p>Windows UI Automation과 macOS Accessibility API로 버튼과 화면 이동을 같은 형식으로 수집합니다.</p></div>
          </article>
        </div>
      </section>

      <section className="final-cta-section">
        <div>
          <h2>42개 메뉴가<br /><span>3단계가 되는 순간을 보세요.</span></h2>
        </div>
        <button className="final-cta" onClick={onDemo}>
          <AppWindow size={21} /> 작동하는 POC 열기 <ArrowRight size={19} />
        </button>
      </section>

      <footer>
        <span className="wordmark"><i className="wordmark-dot" /> 여기만</span>
        <p><Route size={13} /> 필요한 메뉴만 보여주는 업무 AI</p>
        <small>2026 SK AI Hackathon · AI Idea League</small>
      </footer>
    </main>
  )
}
