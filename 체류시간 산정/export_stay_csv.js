/**
 * export_stay_csv.js — 플래너 데이터에서 장소별 체류 시간 CSV 를 만든다.
 *
 *   node export_stay_csv.js            # 이 폴더에 CSV 3개 생성
 *
 * 1. 체류시간_장소별.csv      전 장소의 권장 체류 분 · 운영시간 · 배지
 * 2. 체류시간_분류별_요약.csv  분류별 건수 · 최소 · 중앙값 · 평균 · 최대 · 분포
 * 3. 예시_일정_경주_2박3일.csv 자동 코스 + 시계 로직을 돌린 결과 (서울역 08:00 KTX 출발, 마지막날 19:00 귀가)
 *
 * 화면 파일의 데이터 블록(const CATS ~ DATA.nation 조립)을 그대로 실행해 읽으므로
 * 화면과 항상 같은 값을 냅니다. Google Maps 실측 없이 추정식만 씁니다.
 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const S = require('./stay_schedule');

const ROOT = path.resolve(__dirname, '..');
const OUT = __dirname;
const html = fs.readFileSync(path.join(ROOT, 'Tour Planner.dc.html'), 'utf8').split('\n');

// ── 데이터 블록 실행 ─────────────────────────────────────────────────
const from = html.findIndex(l => /^const CATS\s*=/.test(l));
const to = html.findIndex((l, i) => i > from && /^Object\.assign\(I18N\.locs/.test(l));
if (from < 0 || to < 0) throw new Error('데이터 블록을 찾지 못했습니다');
const ctx = { window: { APP_CONFIG: {} }, document: {}, console, Object, Array, Math, String, Number, JSON };
vm.runInNewContext(html.slice(from, to + 1).join('\n') + '\n;this.__out={DATA,CATS,REGION_HUB,ORIGINS,METRO_CITY:typeof METRO_CITY!=="undefined"?METRO_CITY:{}};', ctx);
const { DATA, CATS, REGION_HUB, ORIGINS, METRO_CITY } = ctx.__out;

// 장소는 id 당 한 번만 낸다. 도시 화면(서울 · 부산 · 제주 · 영월)에 있는 장소는 그 화면으로, 나머지는 nation 으로 적는다.
// (nation 목록은 도시 화면 장소를 전부 포함하고, 조립 단계에서 경주 · 거제가 한 번 더 붙어 id 62개가 겹친다.
//  앱의 courseList 도 id 로 첫 레코드를 찾으므로 첫 레코드만 남긴다.)
const CITY_ORDER = ['seoul', 'busan', 'jeju', 'yeongwol', 'nation'];
const seen = new Set();
const dedupe = arr => arr.filter(p => seen.has(p.id) ? false : (seen.add(p.id), true));
let dupCount = 0;
for (const ck of CITY_ORDER) { const b = DATA[ck].places.length; DATA[ck].places = dedupe(DATA[ck].places); dupCount += b - DATA[ck].places.length; }
console.log('중복 id 제거:', dupCount, '건 (화면 간 중복 포함)');
const csvEsc = v => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const writeCsv = (file, header, rows) => {
  const body = [header, ...rows].map(r => r.map(csvEsc).join(',')).join('\n');
  fs.writeFileSync(path.join(OUT, file), '﻿' + body + '\n', 'utf8');   // BOM: 엑셀에서 한글 깨짐 방지
  console.log(file, rows.length, '행');
};
const hm = t => t == null ? '' : String(Math.floor(t / 60) % 24).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');

// ── 1. 장소별 ───────────────────────────────────────────────────────
const rows = [];
for (const ck of CITY_ORDER) {
  const city = DATA[ck];
  for (const p of city.places) {
    const oh = S.openHours(p);
    rows.push([
      ck, city.ko, p.locKo || city.ko, p.n, p.id, p.ko, p.en,
      p.cat, (CATS[p.cat] || {}).ko || p.cat,
      p.lat, p.lng,
      S.stayMin(p), S.fmtStay(S.stayMin(p)),
      p.hrs || '', oh ? hm(oh.open) : '', oh ? hm(oh.close % (24 * 60)) : '', oh ? 'Y' : 'N',
      p.yt ? 'Y' : 'N', p.off ? 'Y' : 'N', p.k100 ? 'Y' : 'N', p.un ? 'Y' : 'N', p.bf ? 'Y' : 'N',
      S.stayMin(p) > 0 && p.cat !== 'stay' ? 'Y' : 'N',
      p.srcKo || '',
    ]);
  }
}
writeCsv('체류시간_장소별.csv', [
  '화면', '도시', '시군', '순번', 'id', '장소명', '장소명(영문)', '분류코드', '분류',
  '위도', '경도', '권장체류(분)', '체류표기', '운영시간(원문)', '개장(파싱)', '폐장(파싱)', '운영시간적용',
  '영상장소', '확장장소', '한국관광100선', '유네스코', '무장애', '자동코스후보', '좌표근거',
], rows);

// ── 2. 분류별 요약 ──────────────────────────────────────────────────
const by = {};
for (const r of rows) { const cat = r[7]; (by[cat] = by[cat] || []).push(+r[11]); }
const BUCKETS = [[1, 30], [31, 60], [61, 90], [91, 120], [121, 180], [181, 99999]];
const sum = [];
for (const cat of Object.keys(by)) {
  const a = by[cat].filter(x => x > 0).sort((x, y) => x - y);
  const med = a.length ? a[Math.floor(a.length / 2)] : 0;
  const mean = a.length ? Math.round(a.reduce((s, x) => s + x, 0) / a.length) : 0;
  sum.push([cat, (CATS[cat] || {}).ko || cat, by[cat].length, a.length, a[0] || 0, med, mean, a[a.length - 1] || 0,
    ...BUCKETS.map(([lo, hi]) => a.filter(x => x >= lo && x <= hi).length)]);
}
sum.sort((x, y) => y[2] - x[2]);
writeCsv('체류시간_분류별_요약.csv', ['분류코드', '분류', '장소수', '체류값있음', '최소(분)', '중앙값(분)', '평균(분)', '최대(분)',
  '~30분', '31~60분', '61~90분', '91~120분', '121~180분', '181분~'], sum);

// ── 3. 예시 일정: 경주 2박 3일, 서울역 KTX 08:00 출발, 마지막날 19:00 귀가 ──
const legFn = (p, q) => S.legInfo(p, q, 'transit', REGION_HUB, METRO_CITY);
const origin = ORIGINS.seoul, hub = REGION_HUB['경주'];
const accIn = S.accessMin(origin, hub, 'ktx');
const days = 3, depTime = '08:00', retTime = '19:00';
const windows = S.dayWindows({ days, depTime, retTime, accIn });
const course = S.autoCourse(DATA.nation.places, { days, windows, regions: ['경주'], legFn, depTime, accIn, cityKo: '전국' });
const { buckets } = S.assignDays(course, windows, legFn);
const tl = S.timeline(course, buckets, legFn, { depTime, accIn });
console.log(`경주 예시: 접근 ${accIn}분 (서울역→경주 관문 KTX 추정), 일자 창 ${windows.join('/')}분, 경유지 ${course.length}곳`);
writeCsv('예시_일정_경주_2박3일.csv', ['일차', '순번', 'id', '장소명', '분류', '이동(분)', '개장대기(분)', '체류(분)', '도착', '출발', '운영시간'],
  tl.map(t => { const p = course.find(x => x.id === t.id); return [t.day, t.order, t.id, t.name, (CATS[t.cat] || {}).ko || t.cat, t.move, t.wait, t.stay, t.arrive, t.leave, p.hrs || '']; }));
