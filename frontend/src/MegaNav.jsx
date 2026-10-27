/**
 * =========================================================================
 * QUANT AUTOMOTIVE MOBILITY PORTAL - ENTERPRISE HEAD SYSTEM ARCHITECTURE
 * VERSION: 2026.9.7_PROD_NAV_FIXED
 * FILE: `frontend/src/MegaNav.jsx` (상단 메가 내비게이션 마스터)
 * CONFIGURATION: LINKING SYNC WITH MASTER_MEGA_MENU_MAP
 * =========================================================================
 */
import React, { useState, useEffect, useRef } from 'react';
import { MASTER_MEGA_MENU_MAP, INTEGRATED_MARKET_INDEXABLE } from './data';

const NAV_STYLES = {
    rootContainer: "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300",
    tickerWrapper: "w-full bg-[#0b0f19] text-white text-[11px] font-mono font-bold px-4 md:px-8 py-2.5 flex justify-between items-center overflow-hidden border-b border-slate-800/80 select-none",
    tickerScrollContainer: "flex-1 overflow-hidden relative mx-4 md:mx-12 h-4",
    tickerScrollTrack: "absolute flex space-x-16 whitespace-nowrap transition-transform duration-75",
    mainBar: "w-full px-4 md:px-8 py-4 md:py-5 flex justify-between items-center gap-3",
    logoWrapper: "flex items-center space-x-3.5 cursor-pointer select-none transition-transform duration-200 active:scale-95 shrink-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
    logoCube: "h-6 w-6 rounded-xl transform rotate-45 shadow-lg shadow-blue-500/20",
    logoText: "font-sans font-black tracking-widest text-xs text-[#0f172a] font-mono uppercase hidden sm:inline",
    hamburgerBtn: "md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
    navMenuRoot: "hidden md:flex items-center space-x-1 font-sans font-extrabold text-[12px] select-none",
    menuTabButton: "px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 uppercase tracking-tighter font-semibold relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
    menuTabButtonActive: "px-4 py-2.5 rounded-xl bg-slate-900 text-white transition-all duration-200 uppercase tracking-tighter font-semibold relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
    dropdownCard: "absolute left-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-3 space-y-1 z-50",
    dropdownHeader: "px-3 py-2 border-b border-slate-100 mb-1 flex justify-between items-center text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest",
    dropdownItemBtn: "w-full text-left px-4 py-3 text-[11px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl block transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
    rightControls: "flex items-center space-x-3.5 shrink-0",
    iconActionButton: "p-3 rounded-xl border border-slate-200/80 text-slate-400 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
    notificationBadge: "absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse",
    popoverBox: "absolute right-0 mt-4 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.08)] p-5 z-50 space-y-4 border-t-4 border-t-slate-900"
};

const THEME_GRADIENT = { backgroundImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #00c6ff 100%)" };

function MarketTickerBar({ marketData }) {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const animationInterval = setInterval(() => {
            setOffset((prev) => (prev <= -1200 ? 0 : prev - 1));
        }, 35);
        return () => clearInterval(animationInterval);
    }, []);

    const exchangeLive = marketData?.exchange?.live;
    const fuelLive = marketData?.fuel?.live;
    const gasoline = fuelLive ? marketData.fuel.gasoline : INTEGRATED_MARKET_INDEXABLE.gasoline;
    const diesel = fuelLive ? marketData.fuel.diesel : INTEGRATED_MARKET_INDEXABLE.diesel;
    const usd = exchangeLive ? marketData.exchange.usd?.toFixed(2) : INTEGRATED_MARKET_INDEXABLE.usd;
    const eur = exchangeLive ? marketData.exchange.eur?.toFixed(2) : INTEGRATED_MARKET_INDEXABLE.eur;
    const jpy = exchangeLive ? marketData.exchange.jpy?.toFixed(2) : INTEGRATED_MARKET_INDEXABLE.jpy;
    const suffix = (isLive) => (isLive ? '' : ' (참고)');

    return (
        <div className={NAV_STYLES.tickerWrapper}>
            <div className="flex items-center space-x-2.5 text-cyan-400 font-sans tracking-widest text-[10px] font-black uppercase shrink-0">
                <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${exchangeLive || fuelLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="hidden sm:inline">{exchangeLive || fuelLive ? 'QUANT_STREAM_FEED: LIVE' : 'QUANT_STREAM_FEED: REFERENCE'}</span>
            </div>

            <div className={NAV_STYLES.tickerScrollContainer}>
                <div className={NAV_STYLES.tickerScrollTrack} style={{ transform: `translateX(${offset}px)` }}>
                    <span className="text-white">● [전국 휘발유 평균 가격]: {gasoline}{suffix(fuelLive)} 원 / L</span>
                    <span className="text-blue-400">● [전국 경유 평균 시세]: {diesel}{suffix(fuelLive)} 원 / L</span>
                    <span className="text-amber-400">● [원·달러 매매기준율]: {usd}{suffix(exchangeLive)} 원</span>
                    <span className="text-purple-400">● [원·유로 환율]: {eur}{suffix(exchangeLive)} 원</span>
                    <span className="text-emerald-400">● [원·엔화(100엔) 환율]: {jpy}{suffix(exchangeLive)} 원</span>
                    {/* 무한 슬라이딩 루프용 데이터 더블 복사 */}
                    <span className="text-white">● [전국 휘발유 평균 가격]: {gasoline}{suffix(fuelLive)} 원 / L</span>
                    <span className="text-blue-400">● [전국 경유 평균 시세]: {diesel}{suffix(fuelLive)} 원 / L</span>
                </div>
            </div>

            <div className="hidden md:block text-slate-500 text-[10px] font-mono tracking-widest shrink-0 font-bold">
                {marketData?.fetchedAt ? new Date(marketData.fetchedAt).toLocaleString('ko-KR') : '동기화 중...'}
            </div>
        </div>
    );
}

export default function MegaNav({ onMenuSelect, user, onLogout, onLoginClick, marketData, onToggleSidebar }) {
    const [hasAlert, setHasAlert] = useState(true);
    const [openAlertCenter, setOpenAlertCenter] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const alertCenterRef = useRef(null);
    const navRef = useRef(null);

    const liveNotificationLogs = [
        { id: 101, label: "REGULATION", title: "가변 HECU 모듈 내부 전기적 단선 쇼트 위험 시정 명령 이행 데이터 업데이트 완료", time: "방금 전" },
        { id: 102, label: "MARKET_OPINET", title: "최신 유가/환율 지표 동기화 완료", time: "방금 전" }
    ];

    useEffect(() => {
        function handleOutsideClick(e) {
            if (alertCenterRef.current && !alertCenterRef.current.contains(e.target)) {
                setOpenAlertCenter(false);
            }
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenMenuIndex(null);
            }
        }
        function handleEscape(e) {
            if (e.key === 'Escape') {
                setOpenAlertCenter(false);
                setOpenMenuIndex(null);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <header className={NAV_STYLES.rootContainer}>
            <MarketTickerBar marketData={marketData} />

            <div className={NAV_STYLES.mainBar}>
                <button type="button" onClick={onToggleSidebar} className={NAV_STYLES.hamburgerBtn} aria-label="분석 제어 패널 열기/닫기">
                    ☰
                </button>

                <button type="button" className={NAV_STYLES.logoWrapper} onClick={() => window.location.reload()} aria-label="홈으로 새로고침">
                    <div className={NAV_STYLES.logoCube} style={THEME_GRADIENT} aria-hidden="true" />
                    <span className={NAV_STYLES.logoText}>QUANT AUTOMOTIVE LAB</span>
                </button>

                <nav ref={navRef} className={NAV_STYLES.navMenuRoot}>
                    {Object.keys(MASTER_MEGA_MENU_MAP).map((categoryName, cIndex) => {
                        const isOpen = openMenuIndex === cIndex;
                        return (
                            <div key={cIndex} className="relative py-2.5">
                                <button
                                    type="button"
                                    aria-haspopup="menu"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpenMenuIndex(isOpen ? null : cIndex)}
                                    className={isOpen ? NAV_STYLES.menuTabButtonActive : NAV_STYLES.menuTabButton}
                                >
                                    {categoryName}
                                </button>
                                {isOpen && (
                                    <div className={NAV_STYLES.dropdownCard} role="menu">
                                        <div className={NAV_STYLES.dropdownHeader}>
                                            <span>Category Domain</span>
                                            <span>NODE_SEC_0{cIndex + 1}</span>
                                        </div>
                                        <div className="space-y-0.5 max-h-80 overflow-y-auto">
                                            {MASTER_MEGA_MENU_MAP[categoryName].map((subItem, sIndex) => (
                                                <button
                                                    key={sIndex}
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={() => { onMenuSelect(subItem); setOpenMenuIndex(null); }}
                                                    className={NAV_STYLES.dropdownItemBtn}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="truncate pr-4 font-sans font-black tracking-tight text-slate-600">
                                                            {subItem.name}
                                                        </span>
                                                        <span className="text-[10px] font-mono text-slate-300">COMP</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className={NAV_STYLES.rightControls}>
                    <div className="relative" ref={alertCenterRef}>
                        <button
                            type="button"
                            aria-label="알림 센터 열기"
                            aria-haspopup="dialog"
                            aria-expanded={openAlertCenter}
                            onClick={() => { setOpenAlertCenter((v) => !v); setHasAlert(false); }}
                            className={NAV_STYLES.iconActionButton}
                        >
                            🔔
                            {hasAlert && <span className={NAV_STYLES.notificationBadge} aria-hidden="true" />}
                        </button>
                        {openAlertCenter && (
                            <div className={NAV_STYLES.popoverBox} role="dialog" aria-label="알림 목록">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Notification Center</span>
                                    <button type="button" onClick={() => setOpenAlertCenter(false)} aria-label="알림 센터 닫기" className="text-slate-300 hover:text-slate-900 font-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 rounded">✕</button>
                                </div>
                                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                                    {liveNotificationLogs.map((log) => (
                                        <div key={log.id} className="bg-slate-50 rounded-xl p-3 text-xs">
                                            <div className="flex justify-between text-[10px] font-mono font-black text-slate-400 uppercase mb-1">
                                                <span>{log.label}</span>
                                                <span>{log.time}</span>
                                            </div>
                                            <p className="text-slate-700 font-bold leading-relaxed">{log.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-l border-slate-200 pl-3.5 flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4 text-xs font-bold">
                                <span className="text-slate-800 font-sans font-black hidden sm:inline">{user.name}</span>
                                <button type="button" onClick={onLogout} className="text-[11px] font-mono font-black text-slate-400 hover:text-red-500 border px-3 py-2 rounded-xl bg-slate-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button type="button" onClick={onLoginClick} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
