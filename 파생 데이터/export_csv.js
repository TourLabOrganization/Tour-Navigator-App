/**
 * export_csv.js — 화면 파일과 data/*.json 에서 파생 CSV 를 만든다.
 *
 *   node "파생 데이터/export_csv.js"      # 이 폴더에 CSV 6개 생성
 *
 * 1. 장소.csv        플래너 전 장소 (id 당 한 행). 이름 4개 언어 · 설명 · 배지 · 영상 · 사진 · 좌표 근거
 * 2. 테마코스.csv    테마 화면 5개의 코스 경유지 (순번이 숫자인 장소)
 * 3. 시티투어.csv    data/citytour.json 에 헤더를 붙인 것
 * 4. 관광안내소.csv  data/tic.json 에 헤더를 붙인 것
 * 5. 지역거점.csv    플래너 REGION_HUB (지역별 KTX · SRT · 버스 관문)과 전철권 여부
 * 6. 출발지.csv      플래너 ORIGINS (출발역 · 공항)
 *
 * 화면의 데이터 블록을 그대로 실행해 읽으므로 화면과 같은 값을 낸다. 칼럼 규칙은 README.md.
 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = __dirname;
const SHARED = fs.readFileSync(path.join(ROOT, 'shared.js'), 'utf8');

// 화면 파일의 from 줄부터 to 줄 앞까지를 shared.js 와 함께 실행하고 names 에 적은 전역을 돌려준다
function runBlock(file, fromRe, toRe, names, includeTo) {
  const L = fs.readFileSync(path.join(ROOT, file), 'utf8').split('\n');
  const a = L.findIndex(l => fromRe.test(l));
  const b = L.findIndex((l, i) => i > a && toRe.test(l));
  if (a < 0 || b < 0) throw new Error(file + ': 데이터 블록을 찾지 못했습니다');
  const ctx = { window: { APP_CONFIG: {} }, document: {}, console, localStorage: { getItem: () => null, setItem: () => {} } };
  const pick = names.map(n => `${n}:typeof ${n}!=='undefined'?${n}:null`).join(',');
  vm.runInNewContext(SHARED + '\n' + L.slice(a, includeTo ? b + 1 : b).join('\n') + `\n;this.__out={${pick}};`, ctx);
  return ctx.__out;
}

const csvEsc = v => { const s = v == null ? '' : String(v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
function writeCsv(file, header, rows) {
  for (const r of rows) if (r.length !== header.length) throw new Error(`${file}: 칼럼 수 불일치 ${r.length} ≠ ${header.length}`);
  const body = [header, ...rows].map(r => r.map(csvEsc).join(',')).join('\n');
  fs.writeFileSync(path.join(OUT, file), '﻿' + body + '\n', 'utf8');   // BOM: 엑셀에서 한글 깨짐 방지
  console.log(file.padEnd(14), String(rows.length).padStart(5), '행 ·', header.length, '칼럼');
}
const YN = v => v ? 'Y' : 'N';
const num = v => typeof v === 'number' ? v : '';
const hm = v => { const m = String(v || '').match(/^(\d{1,2}):?(\d{2})/); return m ? m[1].padStart(2, '0') + ':' + m[2] : ''; };
// 이름 번역에는 로마자 대체값이 섞여 있다. 한자 · 가나가 없으면 번역이 아니므로 비운다
const HAN = /[㐀-鿿]/, KANA = /[぀-ヿ]/;
const zhName = s => s && HAN.test(s) ? s : '';
const jaName = s => s && (HAN.test(s) || KANA.test(s)) ? s : '';

// ── 플래너 ──────────────────────────────────────────────────────────
const P = runBlock('Tour Planner.dc.html', /^const CATS\s*=/, /^Object\.assign\(I18N\.locs/,
  ['DATA', 'CATS', 'REGION_HUB', 'ORIGINS', 'METRO_CITY', 'I18N'], true);
const NAMES = P.I18N.names || {}, BLURBS = P.I18N.blurbs || {};
const catKo = c => (P.CATS[c] || {}).ko || c || '';

// 장소는 id 당 한 번. 도시 화면(서울 · 부산 · 제주 · 영월)에 있는 장소는 그 화면으로, 나머지는 nation 으로.
// nation 목록 조립에서 경주 · 거제가 한 번 더 붙어 id 가 겹치므로 첫 레코드만 남긴다 (체류시간 산정과 같은 규칙).
const SCREEN_ORDER = ['seoul', 'busan', 'jeju', 'yeongwol', 'nation'];
const seen = new Set(), places = [];
for (const key of SCREEN_ORDER) {
  const city = P.DATA[key];
  for (const p of city.places) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    places.push({ key, city, p });
  }
}

writeCsv('장소.csv', [
  'id', '화면', '도시', '시군', '시군(영문)', '순번',
  '장소명', '장소명(영문)', '장소명(중문)', '장소명(일문)',
  '분류코드', '분류', '위도', '경도', '권장체류(분)', '운영시간(원문)',
  '설명', '설명(영문)', '설명(중문)', '설명(일문)',
  '한국관광100선', '유네스코', '열린관광지', '지정구역', '시티투어경유', '연관관광지', '목록외',
  '영상ID', '작품', '장면', '사진URL', '사진출처', '카카오장소URL', '좌표근거', '좌표근거(영문)',
], places.map(({ key, city, p }) => {
  const nm = NAMES[p.id] || [], bl = BLURBS[p.id] || [];
  return [
    p.id, key, city.ko, p.locKo || city.ko, p.locEn || city.en, typeof p.n === 'number' ? p.n : '',
    p.ko, p.en || '', zhName(nm[0]), jaName(nm[1]),
    p.cat, catKo(p.cat), num(p.lat), num(p.lng), num(p.min), p.hrs || '',
    p.bKo || '', p.bEn || '', bl[0] || '', bl[1] || '',
    YN(p.k100), YN(p.un), YN(p.bf), p.vz || '', YN(p.ct), YN(p.rs), YN(p.off),
    p.yt || '', p.chan || '', p.vt || '', p.img || '', p.imgCredit || '', p.url || '', p.srcKo || '', p.srcEn || '',
  ];
}));

// ── 테마 코스 ───────────────────────────────────────────────────────
// 순번(n)이 숫자인 장소가 코스 경유지다. 번호 없는('·') 장소는 주변 추천이라 뺀다.
const THEMES = [
  ['RESCENE Route', 'RESCENE'],
  ['Kings Warden Route', '왕과 사는 남자'],
  ['KPop Demon Hunters Route', '케이팝 데몬 헌터스'],
  ['Jeju K-Drama Route', '제주 K-Drama'],
  ['Busan Cinema Route', '부산 영화 기행'],
];
const plannerIds = new Set(places.map(x => x.p.id));
const courseRows = [];
for (const [file, title] of THEMES) {
  const T = runBlock(file + '.dc.html', /^const CATS\s*=/, /^const TRANSIT\s*=/, ['DATA']);
  for (const [block, city] of Object.entries(T.DATA)) {
    for (const p of city.places || []) {
      if (typeof p.n !== 'number') continue;
      courseRows.push([
        title, file + '.dc.html', block, p.n, p.id, YN(plannerIds.has(p.id)),
        p.ko, p.en || '', p.cat, catKo(p.cat), num(p.lat), num(p.lng), num(p.min), p.hrs || '',
        p.chan || '', p.vt || '', p.yt || '',
      ]);
    }
  }
}
writeCsv('테마코스.csv', [
  '테마', '화면파일', '블록', '순번', 'id', '플래너에있음',
  '장소명', '장소명(영문)', '분류코드', '분류', '위도', '경도', '권장체류(분)', '운영시간(원문)',
  '작품', '장면', '영상ID',
], courseRows);

// ── 시티투어 · 관광안내소 ────────────────────────────────────────────
const ct = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/citytour.json'), 'utf8'));
const gap = v => { const n = +v; return n > 1 && n < 600 ? n : ''; };       // 화면과 같은 기준 (0 · 1 · 1440 등은 간격이 아님)
writeCsv('시티투어.csv', [
  '도시', '노선명', '유형', '탑승지', '경유지', '첫차', '막차', '배차간격(분)', '요금', '전화', '홈페이지', '비고', '기준일',
], ct.map(r => [r[0], r[1], r[2] === '고정형' ? '코스형' : r[2], r[3], r[4], hm(r[5]), hm(r[6]), gap(r[7]), r[8], r[9], r[10], r[11], r[12]]));

const tic = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/tic.json'), 'utf8'));
writeCsv('관광안내소.csv', [
  '안내소명', '시군', '위도', '경도', '전화', '운영시간', '휴무', '외국어', '주소',
], tic.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]]));

// ── 교통 거점 ───────────────────────────────────────────────────────
const METRO = P.METRO_CITY || {};
writeCsv('지역거점.csv', [
  '시군', '관문', '관문(영문)', '위도', '경도', '버스터미널', '버스터미널(영문)', '버스위도', '버스경도', '수단', '전철권',
], Object.entries(P.REGION_HUB).map(([k, h]) => [
  k, h.ko || '', h.en || '', num(h.lat), num(h.lng),
  h.busKo || '', h.busEn || '', num(h.busLat), num(h.busLng), (h.modes || []).join('|'), YN(METRO[k]),
]));

writeCsv('출발지.csv', ['키', '출발지', '출발지(영문)', '위도', '경도', '수단'],
  Object.entries(P.ORIGINS).map(([k, o]) => [k, o.ko || '', o.en || '', num(o.lat), num(o.lng), (o.modes || []).join('|')]));
