// =========================================================================
// QUANT AUTOMOTIVE BACKEND ENGINE - PRODUCTION READY (V2026.8.1)
// CONFIGURATION AREA (CORE COUPLING PARAMETERS AT THE ABSOLUTE TOP)
// =========================================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CRITERIA_COMPREHENSIVE_30 } from '../frontend/src/data.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'data', 'db.json');

const SERVER_CONFIG = {
    modelPipeline: ["gemini-2.5-flash", "gemini-1.5-flash"],
    scraperUrl: "https://api.scraperapi.com/",
    port: process.env.PORT || 5000,
    allowedHosts: ["encar.com", "www.encar.com", "kcar.com", "www.kcar.com"]
};

function isAllowedListingUrl(rawUrl) {
    try {
        const { protocol, hostname } = new URL(rawUrl);
        if (protocol !== 'https:') return false;
        return SERVER_CONFIG.allowedHosts.some(
            (host) => hostname === host || hostname.endsWith(`.${host}`)
        );
    } catch {
        return false;
    }
}

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPINET_API_KEY = process.env.OPINET_API_KEY || '';

if (!SCRAPER_API_KEY || !GEMINI_API_KEY) {
    console.error('필수 환경변수 누락: backend/.env 파일에 SCRAPER_API_KEY, GEMINI_API_KEY를 설정하세요.');
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// 로컬 파일 기반 유저별 보관함 스키마 (서버 재시작에도 데이터 보존)
function loadDatabase() {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch {
        return { users: {}, assets: {} };
    }
}

function persistDatabase() {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(mvpDatabase, null, 2));
}

const mvpDatabase = loadDatabase();

// 1. 중고차 링크 분석 및 엔카 원본 스킨 사진 URL 완전 동기화 엔드포인트
app.post('/api/analyze', async (req, res) => {
    try {
        const { url, userStyle, budget, userId } = req.body;

        if (!url || !userStyle || !budget) {
            return res.status(400).json({ error: '필수 매개변수 누락' });
        }

        if (!isAllowedListingUrl(url)) {
            return res.status(400).json({ error: '지원하지 않는 플랫폼 주소입니다. 엔카(encar.com) 또는 K카(kcar.com) 매물 링크만 입력해 주세요.' });
        }

        const targetUrl = encodeURIComponent(url);
        const scrapeRes = await fetch(`${SERVER_CONFIG.scraperUrl}?api_key=${SCRAPER_API_KEY}&url=${targetUrl}`);

        if (!scrapeRes.ok) {
            throw new Error('대상 주소 플랫폼의 데이터 스크래핑 인입이 거부되었습니다.');
        }

        const rawHtml = await scrapeRes.text();

        // og:image 메타 태그에서 실제 매물 원본 사진 URL을 태그 제거 이전에 선확보
        const ogImageMatch = rawHtml.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
            || rawHtml.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        const scrapedImageUrl = ogImageMatch ? ogImageMatch[1].replace(/&amp;/g, '&') : null;

        const cleanText = rawHtml
            .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
            .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, 35000);

        const criteriaChecklist = CRITERIA_COMPREHENSIVE_30
            .map((c) => `${c.id}. [${c.component}] ${c.name}`)
            .join('\n');

        const systemPrompt = `
    You are an elite automotive analyst asset. Analyze the provided used car dataset.

    Constraints:
    - User Profile: ${userStyle}
    - Budget Limit: KRW ${budget} Ten-Thousand

    Tasks:
    1. Extract core metrics in Korean: Model name(carName), Year(year), Price(price), Mileage(mileage), Accident History(accident).
    2. CRITICAL IMAGE SYNC: Search carefully inside the HTML data source text to find the exact primary image source string URL (.jpg or .png image tag asset) representing this specific car listing. Return it accurately inside "imageUrl". If no absolute image source link is parsing, provide a high quality car photography fallback URL string from Unsplash CDN.
    3. Evaluate 4 metrics out of 100 points: drivingFun, comfort, prestige, maintenance with professional Korean summaries.
    4. Provide Tier 1 to Tier 10 rank based on total score.
    5. Formulate 2 premium alternatives with high resolution unsplash design images matching those models in "imageUrl".
    6. Score THIS SPECIFIC LISTING (based on its actual year/mileage/price/accident data) against each of the 30 fixed evaluation dimensions below. For every id, return a 0-100 score, a short Korean status label (4-8 characters), and a 1-2 sentence Korean reason grounded in this listing's real data:
    ${criteriaChecklist}

    CRITICAL: Respond ONLY with a valid minified JSON object matching the schema below. Do not include any emoticons or markdown code blocks.
    {
      "carName": "차량이름",
      "price": 0,
      "year": "연식",
      "mileage": "주행거리",
      "accident": "사고이력 요약",
      "imageUrl": "실제 링크 데이터 원본의 매물 사진 주소 URL",
      "finalScore": 0,
      "rank": 0,
      "metrics": {
        "drivingFun": { "score": 0, "comment": "주행다이내믹 분석" },
        "comfort": { "score": 0, "comment": "정숙성 분석" },
        "prestige": { "score": 0, "comment": "브랜드인프라 분석" },
        "maintenance": { "score": 0, "comment": "지출경제 분석" }
      },
      "alternatives": [
        { "model": "대안모델 1", "reason": "격차 사유", "imageUrl": "고화질 매칭 이미지 URL" },
        { "model": "대안모델 2", "reason": "격차 사유", "imageUrl": "고화질 매칭 이미지 URL" }
      ],
      "criteriaScores": [
        { "id": 1, "score": 0, "status": "상태 라벨", "reason": "이 매물 기준 근거" }
      ]
    }
    `;

        let geminiData = null;
        let errorLog = "";

        for (const model of SERVER_CONFIG.modelPipeline) {
            try {
                const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt + "\n\n[Raw Dataset]:\n" + cleanText }] }]
                    })
                });

                const tempRaw = await geminiRes.json();
                if (tempRaw.error) {
                    errorLog = tempRaw.error.message;
                    continue;
                }
                if (tempRaw.candidates && tempRaw.candidates.length > 0) {
                    geminiData = tempRaw;
                    break;
                }
            } catch (err) {
                errorLog = err.message;
            }
        }

        if (!geminiData) {
            throw new Error(`AI 신경망 연산 노드 거부: ${errorLog}`);
        }

        let responseText = geminiData.candidates[0].content.parts[0].text;
        const jsonString = responseText.replace(/```json|```/g, '').trim();
        const resultJson = JSON.parse(jsonString);

        // AI가 100점/10티어 범위를 벗어난 값을 산출하는 경우 표시 오류 방지를 위한 클램핑
        resultJson.finalScore = Math.max(0, Math.min(100, Math.round(Number(resultJson.finalScore) || 0)));
        resultJson.rank = Math.max(1, Math.min(10, Math.round(Number(resultJson.rank) || 1)));

        // 이번 매물에 대해 AI가 산출한 점수를 30대 고정 평가지표 원장에 병합 (지표 정의는 고정, 점수/사유는 매물별로 가변)
        const scoreById = new Map((resultJson.criteriaScores || []).map((c) => [c.id, c]));
        resultJson.criteria = CRITERIA_COMPREHENSIVE_30.map((rubric) => {
            const scored = scoreById.get(rubric.id);
            return {
                ...rubric,
                score: scored?.score ?? rubric.score,
                status: scored?.status ?? rubric.status,
                reason: scored?.reason ?? rubric.reason
            };
        });
        delete resultJson.criteriaScores;

        // 원본 스킨 사진 URL이 확보된 경우 AI 추정치보다 우선 적용하여 실제 매물 사진과 완전 동기화
        if (scrapedImageUrl) {
            resultJson.imageUrl = scrapedImageUrl;
        }

        // 로그인된 회원 ID 세션 포착 시 로컬 보관함 테이블에 자동 정렬 매핑 및 디스크 반영
        if (userId && mvpDatabase.assets[userId]) {
            mvpDatabase.assets[userId].unshift({ id: Date.now(), ...resultJson });
            persistDatabase();
        }

        return res.json(resultJson);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

// 2. MVP 간편 로그인 게이트웨이 매핑 엔드포인트
app.post('/api/auth/login', (req, res) => {
    const { type, accountId, name } = req.body;
    const sessionUserKey = `${type}_${accountId}`;

    if (!mvpDatabase.users[sessionUserKey]) {
        mvpDatabase.users[sessionUserKey] = { id: sessionUserKey, type, name, createdAt: new Date() };
        mvpDatabase.assets[sessionUserKey] = [];
        persistDatabase();
    }

    return res.json({
        user: mvpDatabase.users[sessionUserKey],
        savedAssets: mvpDatabase.assets[sessionUserKey]
    });
});

// 3. 아이디별 저장 데이터 동기화 리로드 엔드포인트
app.get('/api/assets/:userId', (req, res) => {
    const { userId } = req.params;
    return res.json({ savedAssets: mvpDatabase.assets[userId] || [] });
});

// 4. 실시간 거시 지표(환율/유가) 조회 엔드포인트 - 서버측 캐시로 외부 API 과호출 방지
const MARKET_CACHE_TTL_MS = 10 * 60 * 1000;
let marketCache = { data: null, fetchedAt: 0 };

async function fetchExchangeRates() {
    const [usd, eur, jpy] = await Promise.all(
        ['USD', 'EUR', 'JPY'].map((code) =>
            fetch(`https://api.frankfurter.app/latest?from=${code}&to=KRW`).then((r) => r.json())
        )
    );
    return {
        usd: usd.rates?.KRW ?? null,
        eur: eur.rates?.KRW ?? null,
        jpy: jpy.rates?.KRW != null ? jpy.rates.KRW * 100 : null, // 100엔 기준 표기
        date: usd.date,
        live: true
    };
}

async function fetchFuelPrices() {
    if (!OPINET_API_KEY) {
        return { live: false, note: 'OPINET_API_KEY 미설정: backend/.env에 오피넷 Open API 키를 등록하면 실시간 유가로 전환됩니다.' };
    }
    const res = await fetch(`http://www.opinet.co.kr/api/avgAllPrice.do?code=${OPINET_API_KEY}&out=json`);
    const json = await res.json();
    const rows = json?.RESULT?.OIL || [];
    const byCode = Object.fromEntries(rows.map((r) => [r.PRODCD, r.PRICE]));
    return {
        gasoline: byCode.B027 ?? null,
        diesel: byCode.D047 ?? null,
        kerosene: byCode.K015 ?? null,
        live: true
    };
}

app.get('/api/market-data', async (req, res) => {
    const now = Date.now();
    if (marketCache.data && now - marketCache.fetchedAt < MARKET_CACHE_TTL_MS) {
        return res.json(marketCache.data);
    }

    try {
        const [exchange, fuel] = await Promise.all([
            fetchExchangeRates().catch(() => ({ live: false })),
            fetchFuelPrices().catch(() => ({ live: false }))
        ]);
        const data = { exchange, fuel, fetchedAt: new Date(now).toISOString() };
        marketCache = { data, fetchedAt: now };
        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(502).json({ error: '시장 지표 조회 실패' });
    }
});

app.listen(SERVER_CONFIG.port, () => {
    console.log(`Core Telemetry System Server Engine Online at Port ${SERVER_CONFIG.port}`);
});