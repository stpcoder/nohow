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
import demoVideo from '../qa/video/yogiman-demo.mp4?url'
import demoPoster from '../qa/screenshots/demo-context-inference.png?url'

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
          <a href="#demo-video">데모 영상</a>
          <a href="#solution">해결 방식</a>
          <a href="#learning">확장 가능성</a>
          <button className="nav-demo" onClick={onDemo}>
            데모 체험하기 <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy hero-reveal">
          <h1>
            필요한 메뉴만 보여주는,
            <br /><span>여기만</span>
          </h1>
          <p className="hero-description">
            업무의 병목은 필요한 기능을 찾고 익히는 시간입니다.
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={onDemo}>
              데모 체험하기 <Play size={17} fill="currentColor" />
            </button>
            <a className="text-cta" href="#demo-video">
              80초 영상 보기 <ArrowRight size={16} />
            </a>
          </div>
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
                    <p key={item}><i>{index + 1}</i><span>{item}</span><Check size={12} /></p>
                  ))}
                </div>
                <div className="preview-intersection"><GitMerge size={13} /> 42개 메뉴에서 회원 해지 업무를 찾음</div>
                <div className="preview-result">
                  <div className="result-label"><ScanSearch size={14} /> 필요한 메뉴</div>
                  <h3>제휴 복지몰 회원 해지</h3>
                  <div className="mini-step"><span>1</span><p><b>소멸 예정 포인트 확인</b><small>12,480 P</small></p><Check size={15} /></div>
                  <div className="mini-step active"><span>2</span><p><b>탈퇴 약관 읽고 동의</b></p><MousePointer2 size={15} /></div>
                  <button className="preview-action">원본 메뉴 안내 <ArrowRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-video-section" id="demo-video">
        <div className="demo-video-heading">
          <h2>80초 데모를 확인하세요.</h2>
          <p>사이트 탐색부터 회원 해지 목적 발견, 원본 약관 확인과 최종 신청까지 전체 POC 과정을 80초에 담았습니다.</p>
        </div>
        <div className="demo-video-frame">
          <video controls playsInline preload="metadata" poster={demoPoster} width="1440" height="900" aria-label="여기만 회원 해지 POC 데모 영상">
            <source src={demoVideo} type="video/mp4" />
            브라우저가 MP4 영상 재생을 지원하지 않습니다.
          </video>
        </div>
      </section>

      <section className="friction-section" id="problem">
        <div className="friction-copy">
          <h2>신입사원과 숙련자 모두에게<br />복잡한 사내 시스템은 어려운 벽입니다.</h2>
          <p>익숙하지 않은 업무를 처리할 때마다 메뉴 위치와 순서를 다시 찾아야 합니다.</p>
        </div>
        <div className="friction-proof">
          <strong>1,100회+</strong>
          <p>업무를 하며 하루 평균 앱 사이를 오간 횟수입니다.</p>
          <a href="https://www.pega.com/about/news/press-releases/research-reveals-employees-switch-apps-over-1100-times-day" target="_blank" rel="noreferrer">
            Pega, 약 500만 시간 데스크톱 활동 분석 <ExternalLink size={13} />
          </a>
        </div>
      </section>

      <section className="focus-section" id="solution">
        <div className="focus-heading">
          <h2>42개의 복잡한 메뉴가<br />필요한 3단계로 정리됩니다.</h2>
          <p>AI가 목적에 맞는 메뉴만 골라 원본 버튼까지 안내합니다.</p>
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
          <div><ScanSearch size={22} /><p><b>AI가 필요한 메뉴와 원본 위치를 찾습니다.</b></p></div>
          <ArrowRight className="policy-arrow" size={24} />
          <div><UserRound size={22} /><p><b>사용자는 판단과 업무 처리에 집중합니다.</b></p></div>
        </div>
        <p className="control-note">사람이 판단하기 좋은 화면에서 AI의 탐색 능력은 살리고 오작동 위험은 줄입니다.</p>
      </section>

      <section className="learning-section" id="learning">
        <div className="learning-heading">
          <h2>사용 기록이 쌓일수록<br />복잡한 업무용 시스템이 쉬워집니다.</h2>
          <p>여러 사람의 사용 기록을 모아 필요한 기능을 더 빨리 찾습니다.</p>
        </div>

        <div className="learning-flow" aria-label="복잡한 업무용 시스템을 쉽게 만드는 과정">
          <article><span>1</span><Monitor size={21} /><h3>버튼과 메뉴의 위치를 파악합니다.</h3></article>
          <article><span>2</span><Database size={21} /><h3>자주 사용하는 처리 순서를 모읍니다.</h3></article>
          <article><span>3</span><GitMerge size={21} /><h3>AI가 같은 업무끼리 정리합니다.</h3></article>
          <article><span>4</span><ShieldCheck size={21} /><h3>운영자 검토 후 직원에게 제공합니다.</h3></article>
        </div>

        <div className="learning-insight">
          <Route size={25} />
          <p><b>사용 기록은 교육과 시스템 개선에도 활용할 수 있습니다.</b><span>자주 쓰는 기능과 반복해서 헤매는 구간을 찾아 개선 우선순위를 정합니다.</span></p>
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-heading">
          <h2>웹에서 시작해<br />사내 실행 프로그램까지 확장할 수 있습니다.</h2>
          <p>웹과 실행 프로그램의 버튼과 메뉴를 같은 방식으로 정리합니다.</p>
        </div>
        <div className="platform-list">
          <article>
            <Globe2 size={22} />
            <div><h3>웹 사이트 · 구현 완료</h3><p>Chrome 확장 프로그램이 화면의 버튼과 메뉴를 읽어 필요한 기능을 찾습니다.</p></div>
          </article>
          <article>
            <AppWindow size={22} />
            <div><h3>사내 실행 프로그램 · 확장 예정</h3><p>운영체제의 접근성 기능으로 사내 프로그램의 버튼과 메뉴도 파악할 수 있습니다.</p></div>
          </article>
        </div>
      </section>

      <section className="final-cta-section">
        <div>
          <h2>42개의 복잡한 메뉴가<br /><span>3단계로 바뀌는 마법을 경험해보세요.</span></h2>
        </div>
        <button className="final-cta" onClick={onDemo}>
          <AppWindow size={21} /> 데모 체험하기 <ArrowRight size={19} />
        </button>
      </section>

      <footer>
        <span className="wordmark"><i className="wordmark-dot" /> 여기만</span>
        <small>2026 SK AI Hackathon · AI Idea League</small>
      </footer>
    </main>
  )
}
