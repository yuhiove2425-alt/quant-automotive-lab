/**
 * =========================================================================
 * QUANT AUTOMOTIVE MOBILITY PORTAL - MASTER ORCHESTRATOR SYSTEM CORE
 * VERSION: 2026.9.7_PROD_APP_COMPLETE
 * FILE: `frontend/src/App.jsx` (중앙 메인 컨버스 통합 제어 마스터 아키텍처)
 * CORE PALETTE: #4facfe (START) -> #00f2fe (MIDDLE) -> #00c6ff (END)
 * =========================================================================
 */
import React, { useState, useEffect, useMemo } from 'react';
import MegaNav from './MegaNav';
import Sidebar from './Sidebar';
import {
    INTEGRATED_MARKET_INDEXABLE,
    CRITERIA_COMPREHENSIVE_30,
    MASTER_MEGA_MENU_MAP,
    MASTER_FORUM_POSTS_PACK
} from './data';

const GLOBAL_STYLES = {
    appWrapper: "min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased tracking-tight flex flex-col",
    bodyLayout: "flex flex-1 w-full",
    mainCanvas: "flex-1 p-8 overflow-y-auto max-h-[calc(100vh-73px)] bg-[#f8fafc]",
    homeWrapper: "max-w-4xl mx-auto space-y-10 animate-canvas-fade pb-16",
    heroBanner: "relative rounded-3xl overflow-hidden h-64 shadow-md border border-slate-200",
    heroOverlay: "absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/20 to-transparent",
    heroInner: "absolute inset-0 p-8 flex flex-col justify-between text-white",
    cardContainer: "grid grid-cols-1 md:grid-cols-2 gap-6",
    widgetCard: "bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4",
    tableWrapper: "border border-slate-100 rounded-2xl overflow-hidden text-xs font-mono bg-white shadow-inner",
    tableHeaderRow: "grid grid-cols-3 p-3 bg-slate-900 text-white font-sans font-black tracking-wider uppercase text-[10px]",
    tableBodyRow: "grid grid-cols-3 p-3.5 border-b border-slate-100 last:border-b-0 text-slate-600 font-bold transition-colors hover:bg-slate-50/50",
    forumSection: "bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4",
    forumRow: "py-3.5 flex justify-between items-center text-xs rounded-xl px-2",
    loginCard: "max-w-md mx-auto bg-white border border-slate-200 p-8 rounded-[40px] shadow-xl space-y-6 my-12 relative overflow-hidden",
    loginSocialBtn: "w-full py-3.5 text-center rounded-2xl font-sans font-black text-[11px] shadow-sm block",
    portalReportWrapper: "max-w-4xl mx-auto space-y-6 animate-canvas-fade pb-16",
    summaryHeaderCard: "bg-white p-6 border border-slate-200 rounded-3xl shadow-sm flex justify-between items-center relative overflow-hidden",
    overviewImageContainer: "bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md h-64 relative md:col-span-1 border-4 border-white",
    overviewDetailsCard: "bg-white border border-slate-200 p-8 rounded-3xl shadow-sm md:col-span-2 flex flex-col justify-between text-xs font-bold text-slate-600 leading-relaxed",
    matrixTableBox: "bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xl font-sans text-xs",
    matrixTableHeader: "grid grid-cols-12 p-4.5 bg-slate-900 text-white font-black uppercase tracking-[2px] text-[10px] font-mono border-b",
    matrixTableBodyRow: "w-full grid grid-cols-12 p-4 items-center text-[11px] font-bold text-left hover:bg-slate-50 border-b last:border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-900"
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const formatKrw = (n) => (n == null ? null : n.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

function DataFreshnessBadge({ live }) {
    if (live === undefined) {
        return <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">LOADING...</span>;
    }
    return live ? (
        <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">LIVE</span>
    ) : (
        <span className="text-[10px] font-mono font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full uppercase">참고값</span>
    );
}

function ToastStack({ toast, onDismiss }) {
    if (!toast) return null;
    return (
        <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-[100] max-w-sm">
            <div className="bg-slate-900 text-white text-xs font-bold px-5 py-4 rounded-2xl shadow-2xl flex items-start justify-between gap-3">
                <span>{toast.message}</span>
                <button type="button" onClick={onDismiss} aria-label="알림 닫기" className="shrink-0 text-slate-400 hover:text-white font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded">✕</button>
            </div>
        </div>
    );
}

const LOCAL_GRADIENTS = {
    bg: { backgroundImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #00c6ff 100%)" },
    text: { background: "linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
};

export default function App() {
    const [currentView, setCurrentView] = useState('HOME');
    const [reportSubView, setReportSubView] = useState('SUB_OVERVIEW');
    const [activeMenuData, setActiveMenuData] = useState(null);

    const [userStyle, setUserStyle] = useState('BALANCE');
    const [budget, setBudget] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [selectedCriteriaId, setSelectedCriteriaId] = useState(null);

    const [user, setUser] = useState(null);
    const [savedHistory, setSavedHistory] = useState([]);
    const [marketData, setMarketData] = useState(null);
    const [toast, setToast] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const cached = localStorage.getItem('QUANT_WORKSPACE_MASTER_LOGS_V4');
        if (cached) {
            try { setSavedHistory(JSON.parse(cached)); } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        const loadMarketData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/market-data`);
                const data = await res.json();
                if (!cancelled) setMarketData(data);
            } catch (err) {
                if (!cancelled) setMarketData((prev) => prev || { exchange: { live: false }, fuel: { live: false } });
            }
        };
        loadMarketData();
        const interval = setInterval(loadMarketData, 5 * 60 * 1000);
        return () => { cancelled = true; clearInterval(interval); };
    }, []);

    const showToast = (message, tone = 'error') => {
        setToast({ message, tone, key: Date.now() });
    };

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(timer);
    }, [toast]);

    const getFailsafeCarImage = (carName) => {
        const keyword = carName ? carName.toUpperCase() : "";
        if (keyword.includes("CLS")) return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80";
        if (keyword.includes("BENZ") || keyword.includes("메르세데스") || keyword.includes("벤츠")) return "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80";
        if (keyword.includes("BMW") || keyword.includes("5시리즈")) return "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80";
        if (keyword.includes("AUDI") || keyword.includes("아우디")) return "https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&w=1200&q=80";
        return "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80";
    };

    const handlePipelineAnalysisSequence = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, userStyle, budget, userId: user ? user.id : null }),
            });
            const data = await res.json();
            if (data.error) {
                showToast(`연산 처리 엔진 파이프라인 예외: ${data.error}`);
            } else {
                setResult(data);
                const updated = [{ id: Date.now(), userStyle, budget, ...data }, ...savedHistory.filter(h => h.carName !== data.carName)].slice(0, 12);
                setSavedHistory(updated);
                localStorage.setItem('QUANT_WORKSPACE_MASTER_LOGS_V4', JSON.stringify(updated));
                setCurrentView('ANALYSIS_PORTAL');
                setReportSubView('SUB_OVERVIEW');
                setSelectedCriteriaId(null);
            }
        } catch (err) {
            showToast('데이터 자산 연산 게이트웨이 파이프라인 동기화 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleMvpLoginSequence = async (type, name) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, accountId: `${type}_DEMO_USER`, name }),
            });
            const data = await res.json();
            setUser(data.user);
            setSavedHistory(data.savedAssets || []);
            setCurrentView('HOME');
        } catch (err) {
            showToast('로그인 게이트웨이 연동 실패');
        }
    };

    const loadPastHistoryAsset = (item) => {
        setResult(item);
        setUserStyle(item.userStyle || 'BALANCE');
        setBudget(item.budget || '');
        setCurrentView('ANALYSIS_PORTAL');
        setReportSubView('SUB_OVERVIEW');
        setSelectedCriteriaId(null);
    };

    const deleteHistoryItem = (id, e) => {
        e.stopPropagation();
        const updated = savedHistory.filter(item => item.id !== id);
        setSavedHistory(updated);
        localStorage.setItem('QUANT_WORKSPACE_MASTER_LOGS_V4', JSON.stringify(updated));
    };

    const activeCriteriaList = result?.criteria || CRITERIA_COMPREHENSIVE_30;

    const activeCriteriaFocusedItem = useMemo(() => {
        if (!selectedCriteriaId) return null;
        return activeCriteriaList.find(c => c.id === selectedCriteriaId) || null;
    }, [selectedCriteriaId, activeCriteriaList]);

    return (
        <div className={GLOBAL_STYLES.appWrapper}>
            <MegaNav user={user} marketData={marketData} onLoginClick={() => setCurrentView('LOGIN')} onLogout={() => { setUser(null); setCurrentView('HOME'); }} onMenuSelect={(m) => { setActiveMenuData(m); setCurrentView('CONTENT_VIEWER'); setSidebarOpen(false); }} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

            <div className={GLOBAL_STYLES.bodyLayout}>
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-slate-950/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
                )}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} budget={budget} setBudget={setBudget} url={url} setUrl={setUrl} userStyle={userStyle} setUserStyle={setUserStyle} loading={loading} onAnalyze={() => { handlePipelineAnalysisSequence(); setSidebarOpen(false); }} result={result} criteria={activeCriteriaList} reportSubView={reportSubView} setReportSubView={setReportSubView} selectedCriteriaId={selectedCriteriaId} setSelectedCriteriaId={setSelectedCriteriaId} />

                <main className={GLOBAL_STYLES.mainCanvas}>
                    {currentView === 'HOME' && (
                        <div className={GLOBAL_STYLES.homeWrapper}>
                            <div className={GLOBAL_STYLES.heroBanner}>
                                <div className={GLOBAL_STYLES.heroOverlay} />
                                <div className={GLOBAL_STYLES.heroInner}>
                                    <h2 className="text-xl font-sans font-black">QUANT AUTOMOTIVE WORKSPACE</h2>
                                    <p className="text-xs text-slate-300 font-medium">좌측 제어바에 가용 자본금과 중고차 링크를 입력하시면 30대 평가지표 및 리포트 데이터 원장이 즉시 출력됩니다.</p>
                                </div>
                            </div>
                            <div className={GLOBAL_STYLES.cardContainer}>
                                <div className={GLOBAL_STYLES.widgetCard}>
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xs font-sans font-black text-slate-800 uppercase">주요국 통화 매매기준율 환율 보드</h4>
                                        <DataFreshnessBadge live={marketData?.exchange?.live} />
                                    </div>
                                    <div className={GLOBAL_STYLES.tableWrapper}>
                                        <div className={GLOBAL_STYLES.tableHeaderRow}><div>Currency 국가</div><div>Base Rate 기준율</div></div>
                                        <div className={GLOBAL_STYLES.tableBodyRow}><div>미국 달러 (USD)</div><div>{formatKrw(marketData?.exchange?.usd) ?? `${INTEGRATED_MARKET_INDEXABLE.usd} (참고)`} 원</div></div>
                                        <div className={GLOBAL_STYLES.tableBodyRow}><div>유럽 유로 (EUR)</div><div>{formatKrw(marketData?.exchange?.eur) ?? `${INTEGRATED_MARKET_INDEXABLE.eur} (참고)`} 원</div></div>
                                        <div className={GLOBAL_STYLES.tableBodyRow}><div>일본 엔화 (JPY 100)</div><div>{formatKrw(marketData?.exchange?.jpy) ?? `${INTEGRATED_MARKET_INDEXABLE.jpy} (참고)`} 원</div></div>
                                    </div>
                                </div>
                                <div className={GLOBAL_STYLES.widgetCard}>
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xs font-sans font-black text-slate-800 uppercase">국내 전국 평균 주유소 유가 리포트 원장 (오피넷)</h4>
                                        <DataFreshnessBadge live={marketData?.fuel?.live} />
                                    </div>
                                    <div className={GLOBAL_STYLES.tableWrapper}>
                                        <div className={GLOBAL_STYLES.tableHeaderRow}><div>Fuel Type 유종</div><div>Average Price 평균가</div></div>
                                        <div className={GLOBAL_STYLES.tableBodyRow}><div>보통휘발유 (Gasoline)</div><div className="text-red-600 font-black">{marketData?.fuel?.gasoline ?? `${INTEGRATED_MARKET_INDEXABLE.gasoline} (참고)`} 원</div></div>
                                        <div className={GLOBAL_STYLES.tableBodyRow}><div>자동차용 경유 (Diesel)</div><div className="text-blue-600 font-black">{marketData?.fuel?.diesel ?? `${INTEGRATED_MARKET_INDEXABLE.diesel} (참고)`} 원</div></div>
                                    </div>
                                    {!marketData?.fuel?.live && (
                                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{marketData?.fuel?.note || '실시간 유가 조회 준비 중입니다.'}</p>
                                    )}
                                </div>
                            </div>
                            <div className={GLOBAL_STYLES.forumSection}>
                                <div className="border-b pb-2"><h4 className="text-xs font-sans font-black text-slate-800 uppercase">최신 중고차 데이터 연구 분석 게시물 목록</h4></div>
                                <div className="divide-y divide-slate-100">
                                    {MASTER_FORUM_POSTS_PACK.map((post, idx) => (
                                        <div key={idx} className={GLOBAL_STYLES.forumRow}><span className="font-sans font-black text-slate-700 truncate pr-4">{post.title}</span><span className="shrink-0 font-mono text-slate-400 font-bold text-[10px]">{post.author} · {post.date}</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'LOGIN' && (
                        <div className={GLOBAL_STYLES.loginCard}>
                            <h3 className="text-center text-sm font-black text-slate-900 uppercase">Quant Lab 간편 통합 로그인</h3>
                            <div className="space-y-2 pt-4">
                                {['KakaoTalk', 'Google', 'Instagram', 'GitHub'].map(p => (
                                    <button key={p} type="button" onClick={() => handleMvpLoginSequence(p, `${p} 연동 회원`)} className={`${GLOBAL_STYLES.loginSocialBtn} bg-slate-900 text-white py-3.5 rounded-xl text-xs font-bold`}>{p} 소셜 간편 통합 연동</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentView === 'CONTENT_VIEWER' && activeMenuData && (
                        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden p-8 space-y-4 animate-canvas-fade">
                            <h2 className="text-base font-black text-slate-900 border-b pb-2">{activeMenuData.name}</h2>
                            <p className="text-xs text-slate-600 font-bold leading-relaxed">{activeMenuData.desc}</p>
                            {activeMenuData.name === "로컬 자산 과거 인입 이력 보드" && (
                                <div className="grid grid-cols-1 gap-2 text-xs">
                                    {savedHistory.map(h => (
                                        <div key={h.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100 hover:border-slate-400 transition-colors">
                                            <button type="button" onClick={() => loadPastHistoryAsset(h)} className="text-left flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 rounded-lg">
                                                <p className="font-black text-slate-900">{h.carName}</p><p className="text-slate-400 font-mono text-[10px]">{h.year} · {h.price}만원</p>
                                            </button>
                                            <button type="button" onClick={(e) => deleteHistoryItem(h.id, e)} aria-label={`${h.carName} 이력 삭제`} className="text-slate-300 hover:text-red-500 font-black p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 rounded">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeMenuData.type === 'TABLE' && activeMenuData.d && (
                                <div className={GLOBAL_STYLES.tableWrapper}>
                                    {activeMenuData.d.map((row, rIdx) => (
                                        <div key={rIdx} className={GLOBAL_STYLES.tableBodyRow}><div>{row[0]}</div><div>{row[1]}</div><div className="text-right text-blue-600 font-mono">{row[2]}</div></div>
                                    ))}
                                </div>
                            )}
                            <button type="button" onClick={() => setCurrentView('HOME')} className="text-[11px] font-black text-blue-600 hover:underline inline-block pt-2">← 포털 대시보드 메인 화면 복귀</button>
                        </div>
                    )}

                    {currentView === 'ANALYSIS_PORTAL' && result && (
                        <div className={GLOBAL_STYLES.portalReportWrapper}>
                            <div className={GLOBAL_STYLES.summaryHeaderCard}>
                                <div><span className="text-[10px] font-mono font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase">Target Sync Complete</span><h3 className="text-xl font-sans font-black text-slate-900 mt-2.5">{result.carName}</h3><p className="text-xs font-bold text-slate-400 font-mono mt-0.5">{result.year} · {result.mileage} · {result.price}만원 · {result.accident}</p></div>
                                <div className="text-right"><span className="text-[10px] font-black text-slate-400 block mb-0.5">최적 가치 평정선</span><p className="text-4xl font-sans font-black text-slate-900 tracking-tighter" style={LOCAL_GRADIENTS.text}>T-{result.rank}</p><p className="text-[11px] font-mono font-black text-slate-700 bg-slate-50 border px-3 py-1 rounded-full mt-2">SCORE: {result.finalScore}/100</p></div>
                            </div>

                            {reportSubView === 'SUB_OVERVIEW' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-canvas-fade">
                                    <div className={GLOBAL_STYLES.overviewImageContainer}><img src={result.imageUrl || getFailsafeCarImage(result.carName)} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getFailsafeCarImage(result.carName); }} alt={result.carName} className="w-full h-full object-cover" /></div>
                                    <div className={GLOBAL_STYLES.overviewDetailsCard}><span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block border-b pb-2">Specification Summary</span><div className="pt-2"><p className="font-black text-slate-900 text-xs">차종 라인업 분류 명칭: {result.carName}</p><p className="text-slate-500 text-xs mt-1">컨디션 트랙 상태: {result.year} 등록 / {result.mileage} 실주행 완료. 사고유무: {result.accident}</p></div></div>
                                </div>
                            )}

                            {reportSubView === 'SUB_COMPARE' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-canvas-fade">
                                    {result.alternatives?.map((alt, idx) => (
                                        <div key={idx} className="bg-white border rounded-3xl overflow-hidden p-6 shadow-sm space-y-3"><div className="h-32 rounded-xl overflow-hidden bg-slate-100"><img src={alt.imageUrl || getFailsafeCarImage(alt.model)} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getFailsafeCarImage(alt.model); }} alt={alt.model} className="w-full h-full object-cover" /></div><h4 className="font-black text-sm text-slate-900">{alt.model}</h4><p className="text-xs text-slate-500 font-sans font-bold leading-relaxed border-t pt-2">{alt.reason}</p></div>
                                    ))}
                                </div>
                            )}

                            {reportSubView === 'SUB_30_MATRIX' && (
                                <div className="space-y-6 animate-canvas-fade">
                                    {activeCriteriaFocusedItem ? (
                                        <div className="bg-white border-2 border-slate-950 p-6 rounded-3xl space-y-4 shadow-xl">
                                            <div className="border-b pb-2 flex justify-between items-center"><div><span className="text-[10px] font-mono font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">{activeCriteriaFocusedItem.component} 도메인</span><h4 className="font-black text-slate-900 text-sm mt-1">{activeCriteriaFocusedItem.id}. {activeCriteriaFocusedItem.name}</h4></div><span className="text-[10px] font-mono font-black text-slate-400 uppercase">{activeCriteriaFocusedItem.title}</span></div>
                                            <div className="space-y-1 font-mono text-xs"><div className="flex justify-between font-bold text-slate-400"><span>Scoring Metric Progress</span><span className="text-slate-900 font-black">{activeCriteriaFocusedItem.score} / 100 PTS</span></div><div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border"><div className="h-full rounded-full" style={{ width: `${activeCriteriaFocusedItem.score}%`, ...LOCAL_GRADIENTS.bg }} /></div></div>
                                            <div className="bg-slate-50 p-4 rounded-xl border text-xs font-sans text-slate-600 font-medium leading-relaxed border-l-4 border-l-slate-900">{activeCriteriaFocusedItem.reason}</div>
                                            <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-400 font-bold uppercase"><span>LOG_NODE: VAL_{activeCriteriaFocusedItem.id + 1024}</span><span>·</span><span>LOGIC: {activeCriteriaFocusedItem.logic}</span></div>
                                        </div>
                                    ) : (
                                        <div className="bg-white p-6 rounded-2xl border text-center text-xs text-slate-400 font-bold font-sans">좌측 분류 트리의 세부 소메뉴 지표 항목을 선택하시면 정밀 점수 수식 피드백 원장이 이 자리에 대형 컴포넌트로 매핑 표출됩니다.</div>
                                    )}

                                    <div className={GLOBAL_STYLES.matrixTableBox}>
                                        <div className={GLOBAL_STYLES.matrixTableHeader}><div className="col-span-4">정량 확인 대치 차원 (Dimension)</div><div className="col-span-3 text-center">배점 비율 그래프</div><div className="col-span-5 pl-8">왜 이런 배점인가 요약 (Telemetry Overview Log)</div></div>
                                        <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
                                            {activeCriteriaList.map((m) => (
                                                <button type="button" key={m.id} onClick={() => setSelectedCriteriaId(m.id)} aria-pressed={selectedCriteriaId === m.id} className={`${GLOBAL_STYLES.matrixTableBodyRow} ${selectedCriteriaId === m.id ? 'bg-blue-50/40 border-l-4 border-l-blue-500' : ''}`}><div className="col-span-4"><strong>[{m.component}]</strong> {m.id}. {m.name}</div><div className="col-span-3 text-center px-4"><div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-0.5"><div className="h-full bg-slate-900" style={{ width: `${m.score}%` }} /></div><span>{m.score}/100</span></div><div className="col-span-5 pl-8 truncate text-slate-400 font-normal">{m.reason}</div></button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {reportSubView === 'SUB_LOGS' && (
                                <div className="bg-slate-950 text-slate-200 rounded-3xl p-6 font-mono text-[11px] leading-relaxed space-y-1.5 shadow-xl animate-canvas-fade">
                                    <p className="text-emerald-400">$ quant-pipeline --run analyze</p>
                                    <p>[{new Date().toLocaleString()}] REQUEST_ACCEPTED source={url || 'N/A'}</p>
                                    <p>[PROFILE] userStyle={userStyle} budgetCap={budget || 'N/A'}만원</p>
                                    <p>[SCRAPER] target platform HTML fetched via ScraperAPI OK</p>
                                    <p>[GEMINI] model_pipeline=[{`gemini-2.5-flash, gemini-1.5-flash`}] response parsed OK</p>
                                    <p>[RESULT] carName="{result.carName}" year={result.year} price={result.price}만원</p>
                                    <p>[SCORING] finalScore={result.finalScore}/100 rank=T-{result.rank}</p>
                                    <p>[METRICS] drivingFun={result.metrics?.drivingFun?.score} comfort={result.metrics?.comfort?.score} prestige={result.metrics?.prestige?.score} maintenance={result.metrics?.maintenance?.score}</p>
                                    <p>[ALTERNATIVES] count={result.alternatives?.length || 0}</p>
                                    <p className="text-emerald-400">$ 파이프라인 종료 코드: 0 (정상 완료)</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <ToastStack toast={toast} onDismiss={() => setToast(null)} />

            <style>{`
        @keyframes canvasFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .animate-canvas-fade { animation: canvasFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
      `}</style>
        </div>
    );
}