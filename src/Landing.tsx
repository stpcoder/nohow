import {
  ArrowRight,
  AppWindow,
  Check,
  ChevronRight,
  Database,
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
            필요한 메뉴만 정리해주는
            <br /><span>당신의 업무를 위한<br className="mobile-break" /> 마법 같은 툴, 여기만</span>
          </h1>
          <p className="hero-description">
            <span>업무의 병목은 복잡한 사내 시스템에 있었습니다.</span>
            <span>시스템 위에서 쉽게 기능을 찾고, 업무 혁신을 경험해보세요.</span>
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
          <h2>80초 만에 마법같이 간편해지는 데모를 확인해보세요.</h2>
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
          <h2>신입사원과 숙련자 모두에게<br />복잡한 사내 시스템은<br />어려운 벽입니다.</h2>
          <p>매일 접속하는 시스템도 복잡하다면 여전히 업무를 가로막는 병목이 됩니다.</p>
        </div>
        <div className="friction-proof">
          <strong>1,100회+</strong>
          <p>전 세계 직장인들이 업무를 위해 복잡한 시스템 속에서 하루 동안 클릭한 횟수입니다.</p>
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
          <h2>여러 사람들의 사용 기록이 쌓일수록<br />복잡한 <span className="keep-together">시스템이 더 쉬워집니다.</span></h2>
          <p>사람들이 자주 사용하는 메뉴와 처리 방법을 학습해 더 쉽고 빠른 업무 환경을 만듭니다.</p>
        </div>

        <div className="learning-flow" aria-label="복잡한 업무용 시스템을 쉽게 만드는 과정">
          <article><span>1</span><Monitor size={21} /><h3>버튼과 메뉴의 위치를 파악합니다.</h3></article>
          <article><span>2</span><Database size={21} /><h3>자주 사용하는 처리 순서를 모읍니다.</h3></article>
          <article><span>3</span><GitMerge size={21} /><h3>주로 사용하는 메뉴 패턴을 학습합니다.</h3></article>
          <article><span>4</span><ShieldCheck size={21} /><h3>Agent 개발과 사내 시스템 개선에 활용합니다.</h3></article>
        </div>

        <div className="learning-insight">
          <Route size={25} />
          <p><b>사용 기록은 Agent 개발과 사내 시스템 개선에 사용 가능합니다.</b><span>직원들이 자주 쓰는 기능과 반복해서 막히는 구간을 바탕으로 더 나은 시스템을 설계합니다.</span></p>
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-heading">
          <h2>복잡한 시스템이라면<br />웹과 앱 어디로든 확장 가능합니다.</h2>
        </div>
        <div className="platform-list">
          <article>
            <Globe2 size={22} />
            <div><h3>웹 사이트용 여기만</h3><p>Chrome 확장 프로그램이 버튼과 메뉴를 읽어 필요한 기능을 찾고, 마법처럼 업무 시간을 단축합니다.</p></div>
          </article>
          <article>
            <AppWindow size={22} />
            <div><h3>사내 앱용 여기만</h3><p>복잡한 사내 프로그램도 필요한 기능만 정리해 더 빠른 업무와 새로운 혁신을 만듭니다.</p></div>
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
        <small>2026 SK AI Hackathon · AI Solution League</small>
      </footer>
    </main>
  )
}
