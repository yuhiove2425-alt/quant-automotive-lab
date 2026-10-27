/**
 * =========================================================================
 * QUANT AUTOMOTIVE MOBILITY PORTAL - ENTERPRISE CONTROL TOWER ARCHITECTURE
 * VERSION: 2026.9.7_PROD_SIDEBAR_COMPLETE
 * FILE: `frontend/src/Sidebar.jsx` (좌측 제어 관리용 작업 메뉴바 컴포넌트)
 * CORE CONFIGURATION: DENSE METRICS TRACKING TOWER WITH 5-DOMAIN CATEGORIZATION
 * DESIGN SYSTEM: 2026 FINTECH LIGHT STANDARD / NO EMOTICONS / HIGH VISUAL DENSITY
 * SPECTRUM SPECTRUM: #4facfe (START) -> #00f2fe (MIDDLE) -> #00c6ff (END)
 * =========================================================================
 */
import React, { useState, useEffect, useMemo } from 'react';
import { CRITERIA_COMPREHENSIVE_30 } from './data';

// --- 대기업 디자인 가이드라인 통과 내부 전용 스타일 맵 원장 ---
const SIDE_STYLES = {
  container: "w-[85vw] max-w-[360px] md:w-[360px] fixed md:static inset-y-0 left-0 z-40 border-r border-slate-200 bg-white min-h-screen md:min-h-[calc(100vh-73px)] p-6 space-y-6 overflow-y-auto max-h-screen md:max-h-[calc(100vh-73px)] shrink-0 shadow-2xl md:shadow-sm select-none transition-transform duration-300 ease-out",
  closeBtn: "md:hidden w-full flex justify-end mb-1",
  sectionAnchor: "space-y-1.5 border-b border-slate-100 pb-4",
  metaLabel: "text-[10px] font-mono font-black text-slate-400 tracking-widest block uppercase",
  sectionTitle: "text-xs font-sans font-black text-slate-900 uppercase tracking-tight mt-0.5",
  formWrapper: "bg-slate-50 border border-slate-200/60 p-4.5 rounded-3xl space-y-3.5 shadow-inner",
  formLabel: "block text-[10px] font-black text-slate-400 ml-1 uppercase font-mono tracking-wider",
  inputField: "w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-extrabold text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all duration-200",
  modeGrid: "grid grid-cols-2 gap-1.5 pt-1.5",
  modeBtnActive: "py-2 text-center rounded-xl text-[10px] font-black transition-all duration-200 bg-slate-900 text-white shadow-md scale-102 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
  modeBtnInactive: "py-2 text-center rounded-xl text-[10px] font-black transition-all duration-200 bg-white border border-slate-200/60 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
  actionBtn: "w-full text-center py-4 rounded-2xl text-white font-sans font-black text-xs uppercase tracking-widest shadow-lg transform active:scale-95 transition-all mt-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed",
  tabBtnActive: "w-full text-left px-4 py-3.5 rounded-xl text-xs font-black bg-slate-900 text-white shadow-md flex justify-between items-center transition-all duration-200 translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
  tabBtnInactive: "w-full text-left px-4 py-3.5 rounded-xl text-xs font-black text-slate-500 hover:bg-slate-50 hover:text-slate-900 flex justify-between items-center transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
  categoryHeader: "w-full flex justify-between items-center px-3 py-2 bg-slate-100 rounded-xl text-[10px] font-sans font-black text-slate-500 uppercase tracking-wider mt-3 mb-1.5 cursor-pointer hover:bg-slate-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
  criteriaRowBtn: "w-full text-left px-3 py-2.5 text-[11px] font-bold rounded-lg transition-all flex justify-between items-center pl-6 border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
  criteriaRowActive: "bg-blue-50/70 text-blue-600 font-black border-blue-100/50 shadow-xs",
  criteriaRowInactive: "text-slate-500 hover:bg-slate-50/80 hover:text-slate-800"
};

const GRADIENT_ACTION_BG = { backgroundImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #00c6ff 100%)" };

/**
 * Sub-Component 01: TelemetryFormContainer
 * 자본 지출 한계선(예산) 및 크롤링 대상 원격 주소 URL을 다이렉트 바인딩 제어하는 인풋 양식 파츠
 */
function TelemetryFormContainer({
  budget,
  setBudget,
  url,
  setUrl,
  userStyle,
  setUserStyle,
  loading,
  onAnalyze
}) {
  return (
    <div className={SIDE_STYLES.formWrapper}>
      <div className="space-y-1">
        <label className={SIDE_STYLES.formLabel}>
          ALLOCATED CAPITAL / 가용 예산 한도 (만원)
        </label>
        <input 
          type="number" 
          placeholder="예시: 4500 (단위: 만원 고정)" 
          value={budget} 
          onChange={(e) => setBudget(e.target.value)}
          className={SIDE_STYLES.inputField} 
        />
        <span className="text-[10px] text-slate-400 font-mono font-bold pl-1 block">
          * 취등록세 수식 보정 마진을 위한 자본 가용 총액 기준선
        </span>
      </div>

      <div className="space-y-1">
        <label className={SIDE_STYLES.formLabel}>
          PLATFORM DATA LINK ADDRESS / 대상 원격 매물 URL
        </label>
        <input 
          type="text" 
          placeholder="엔카 / K카 상세 페이지 전체 주소 복사 붙여넣기" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          className={SIDE_STYLES.inputField} 
        />
        <span className="text-[10px] text-slate-400 font-mono font-bold pl-1 block">
          * 엔카 원시 소스 보안 크롤링 필터링 파이프라인 우회 모듈 작동
        </span>
      </div>

      <div className="space-y-1 pt-1">
        <label className={SIDE_STYLES.formLabel}>
          ALGORITHM WEIGHT PROFILE / 분석 가중치 모드 선택
        </label>
        <div className={SIDE_STYLES.modeGrid}>
          <button 
            type="button"
            onClick={() => setUserStyle('PERFORMANCE')}
            className={userStyle === 'PERFORMANCE' ? SIDE_STYLES.modeBtnActive : SIDE_STYLES.modeBtnInactive}
          >
            PERFORMANCE (출력 지향)
          </button>
          <button 
            type="button"
            onClick={() => setUserStyle('COMFORT')}
            className={userStyle === 'COMFORT' ? SIDE_STYLES.modeBtnActive : SIDE_STYLES.modeBtnInactive}
          >
            COMFORT (정숙성 지향)
          </button>
          <button 
            type="button"
            onClick={() => setUserStyle('PRESTIGE')}
            className={userStyle === 'PRESTIGE' ? SIDE_STYLES.modeBtnActive : SIDE_STYLES.modeBtnInactive}
          >
            PRESTIGE (브랜드 가치)
          </button>
          <button 
            type="button"
            onClick={() => setUserStyle('BALANCE')}
            className={userStyle === 'BALANCE' ? SIDE_STYLES.modeBtnActive : SIDE_STYLES.modeBtnInactive}
          >
            BALANCE (균형 통계 팩)
          </button>
        </div>
      </div>

      <button 
        type="button"
        disabled={loading || !url || !budget}
        onClick={onAnalyze}
        className={SIDE_STYLES.actionBtn}
        style={GRADIENT_ACTION_BG}
      >
        {loading ? 'CALCULATING QUANT PIPELINE...' : '조회 및 정량 가치 평가 기동'}
      </button>
    </div>
  );
}

/**
 * Sub-Component 02: CoreMethodologyGuideBook
 * 100만 사용자 규모의 신뢰도를 달성하기 위해, 본 솔루션의 4대 핵심 가치 평가 수식 원장 개념을 구조화 인입한 안내서 파츠
 */
function CoreMethodologyGuideBook() {
  return (
    <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl space-y-3 font-sans text-[11px] leading-relaxed text-slate-500 font-medium">
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1.5 mb-1">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
        <span className="font-mono text-[10px] font-black tracking-widest text-slate-900 uppercase">Quant Valuation Methodology</span>
      </div>
      <div className="space-y-2">
        <p>
          <strong className="text-slate-800 font-bold block">1. 재무 리스크 벡터(Finance Risk Vector)</strong>
          MSRP 출고 가격 대비 중고 매입가 낙하 편차 수식 및 차령 누적 감산 자동차세 공식, 당일 공채 즉시 매도 이율의 종합 overhead 마진 계측.
        </p>
        <p>
          <strong className="text-slate-800 font-bold block">2. 파워트레인 하드웨어 지표(Powertrain Indicator)</strong>
          실린더 기밀성 압축 압력 편차 행렬(기통간 2% 미만 제어), 터보차저 스풀 업 RPM 토크 밴드 시점, 솔레노이드 전기 저항 제어 레이턴시 연산.
        </p>
        <p>
          <strong className="text-slate-800 font-bold block">3. 바디 강성 및 구조 건전성(Structural Soundness)</strong>
          주요 사이드멤버 및 휠하우스 하우징 용접 절단 흔적 유무, 고속 횡 가속 기동 시 서스펜션 타워 마운트 복원 계수 추록 알고리즘.
        </p>
        <p>
          <strong className="text-slate-800 font-bold block">4. 캐빈 NVH 및 공조 공학 지표(Cabin Insulation & NVH)</strong>
          프레임리스 도어 유리 이중접합 차음 글라스 장치 밀폐력 센싱, 대시패널 인슐레이션 흡음재 충진 밀도 및 에어컨 가스가변 밸브 데이터 동기화.
        </p>
      </div>
    </div>
  );
}

/**
 * =========================================================================
 * MAIN EXPORT HARNESS COMPONENT: Sidebar
 * =========================================================================
 */
export default function Sidebar({
  userStyle,
  setUserStyle,
  budget,
  setBudget,
  url,
  setUrl,
  loading,
  onAnalyze,
  result,
  criteria = CRITERIA_COMPREHENSIVE_30,
  reportSubView,
  setReportSubView,
  selectedCriteriaId,
  setSelectedCriteriaId,
  isOpen = true,
  onClose = () => {}
}) {
  // 30대 평가지표 분류 처리를 위한 5대 고정 도메인 카테고리 맵 상태 토큰
  const [toggleCategory, setToggleCategory] = useState({
    "재무 리스크 제어": true,
    "파워트레인 인프라": true,
    "바디 프레임 강성": true,
    "캐빈 NVH 인슐레이션": true,
    "섀시 하체 제어": true
  });

  const handleCategoryToggle = (domain) => {
    setToggleCategory((prev) => {
      return { ...prev, [domain]: !prev[domain] };
    });
  };

  // 30대 평가지표 배열을 5대 대메뉴 그룹별로 정밀 분기 매핑하는 메모이제이션 팩
  const categorizedCriteriaMap = useMemo(() => {
    const map = {
      "재무 리스크 제어": [],
      "파워트레인 인프라": [],
      "바디 프레임 강성": [],
      "캐빈 NVH 인슐레이션": [],
      "섀시 하체 제어": []
    };
    criteria.forEach((item) => {
      if (map[item.component]) {
        map[item.component].push(item);
      } else {
        map["섀시 하체 제어"].push(item); // 폴백 처리 방어 루틴
      }
    });
    return map;
  }, [criteria]);

  return (
    <aside className={`${SIDE_STYLES.container} ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className={SIDE_STYLES.closeBtn}>
        <button type="button" onClick={onClose} aria-label="제어 패널 닫기" className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
          ✕
        </button>
      </div>

      {/* SECTION 01: 원격 중고차 자산 스캔 입력 제어 장치 */}
      <div className={SIDE_STYLES.sectionAnchor}>
        <span className={SIDE_STYLES.metaLabel}>System Control Framework</span>
        <h3 className={SIDE_STYLES.sectionTitle}>원격 매물 실사 주입 및 프로필 구성</h3>
        <div className="pt-3">
          <TelemetryFormContainer 
            budget={budget}
            setBudget={setBudget}
            url={url}
            setUrl={setUrl}
            userStyle={userStyle}
            setUserStyle={setUserStyle}
            loading={loading}
            onAnalyze={onAnalyze}
          />
        </div>
      </div>

      {/* SECTION 02: 분석 성공 시 작동하는 메인 결과 리포트 서브 네비게이션 메뉴바 */}
      {result && (
        <div className={SIDE_STYLES.sectionAnchor}>
          <span className={SIDE_STYLES.metaLabel}>Analysis Report Subview Module</span>
          <h3 className={SIDE_STYLES.sectionTitle}>분석 결과 확인 및 도메인 분기</h3>
          <div className="space-y-1.5 pt-3">
            <button
              type="button"
              onClick={() => {
                setReportSubView('SUB_OVERVIEW');
                setSelectedCriteriaId(null); // 지표 상세 선택 리셋
              }}
              className={reportSubView === 'SUB_OVERVIEW' && !selectedCriteriaId ? SIDE_STYLES.tabBtnActive : SIDE_STYLES.tabBtnInactive}
            >
              <span className="font-sans">불러온 차량 데이터 개요</span>
              <span className="font-mono text-[10px] opacity-50">COMP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportSubView('SUB_COMPARE');
                setSelectedCriteriaId(null);
              }}
              className={reportSubView === 'SUB_COMPARE' && !selectedCriteriaId ? SIDE_STYLES.tabBtnActive : SIDE_STYLES.tabBtnInactive}
            >
              <span className="font-sans">가용 예산 최적 대안 모델</span>
              <span className="font-mono text-[10px] opacity-50">COMP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportSubView('SUB_30_MATRIX');
                if (!selectedCriteriaId) setSelectedCriteriaId(1); // 기본 1번 지표 자동 활성화 수식 매칭
              }}
              className={reportSubView === 'SUB_30_MATRIX' ? SIDE_STYLES.tabBtnActive : SIDE_STYLES.tabBtnInactive}
            >
              <span className="font-sans">30대 정량 평가지표 종합 수식</span>
              <span className="font-mono text-[10px] opacity-50">COMP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setReportSubView('SUB_LOGS');
                setSelectedCriteriaId(null);
              }}
              className={reportSubView === 'SUB_LOGS' && !selectedCriteriaId ? SIDE_STYLES.tabBtnActive : SIDE_STYLES.tabBtnInactive}
            >
              <span className="font-sans">시스템 신경망 연산 커널로그</span>
              <span className="font-mono text-[10px] opacity-50">LOG</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 03: [유저 지시 최우선 반영 수립] 30대 평가지표의 대메뉴-소메뉴 하이어라키 제어 시스템 */}
      <div className={SIDE_STYLES.sectionAnchor}>
        <span className={SIDE_STYLES.metaLabel}>30-Criteria Hierarchy Index Control Tower</span>
        <h3 className={SIDE_STYLES.sectionTitle}>30대 정량 검증 지표 분류 트리</h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1 leading-normal font-sans">
          아래의 5대 대메뉴 도메인을 클릭하여 펼치신 후, 세부 소메뉴 지표 항목을 선택하시면 **화면 중앙 메인 컨버스**에 프로그레스 그래프와 상세 피드백 분석 표 원장이 다이렉트 매핑 표출됩니다.
        </p>

        <div className="pt-2 space-y-1 font-sans">
          {Object.keys(categorizedCriteriaMap).map((domainName, dIdx) => {
            const isCategoryExpanded = toggleCategory[domainName];
            return (
              <div key={dIdx} className="border-b border-slate-50 last:border-0 pb-1">
                {/* 대메뉴 카테고리 헤더 앵커 안커 */}
                <button
                  type="button"
                  onClick={() => handleCategoryToggle(domainName)}
                  aria-expanded={isCategoryExpanded}
                  className={SIDE_STYLES.categoryHeader}
                >
                  <span className="font-sans font-black tracking-tight text-slate-700">{domainName}</span>
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {isCategoryExpanded ? "▲ CLOSE" : "▼ EXPAND"}
                  </span>
                </button>

                {/* 대메뉴 하부 소메뉴 평가지표 팩 리스트 루프 전개 */}
                {isCategoryExpanded && (
                  <div className="space-y-0.5 animate-fade-in pl-1">
                    {categorizedCriteriaMap[domainName].map((metric) => {
                      const isRowSelected = selectedCriteriaId === metric.id && reportSubView === 'SUB_30_MATRIX';
                      return (
                        <button
                          key={metric.id}
                          type="button"
                          onClick={() => {
                            setReportSubView('SUB_30_MATRIX'); // 평가지표 메인 뷰포트로 강제 고정 유도
                            setSelectedCriteriaId(metric.id);  // 중앙 메인페이지로 해당 단면 매핑 시그널 인입
                          }}
                          className={`${SIDE_STYLES.criteriaRowBtn} ${
                            isRowSelected ? SIDE_STYLES.criteriaRowActive : SIDE_STYLES.criteriaRowInactive
                          }`}
                        >
                          <span className="truncate pr-2 tracking-tight">
                            {metric.id}. {metric.name}
                          </span>
                          <span className={`font-mono text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                            isRowSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400 font-bold'
                          }`}>
                            {metric.score}점
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 04: 내장형 알고리즘 정량 척도 방법론 안내 가이드 */}
      <div className="pt-2">
        <span className={SIDE_STYLES.metaLabel}>Theoretical Ground Library</span>
        <h3 className={SIDE_STYLES.sectionTitle}>퀀트 가치 평정 공식 방법론 설명</h3>
        <div className="pt-3">
          <CoreMethodologyGuideBook />
        </div>
      </div>

    </aside>
  );
}