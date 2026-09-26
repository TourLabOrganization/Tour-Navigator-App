/** build_doc.js — 체류시간_산정_로직_설명.docx 생성 (CSV 결과를 표로 읽어 넣는다) */
'use strict';
const fs = require('fs'), path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType,
        LevelFormat, ShadingType, BorderStyle, PageBreak } = require('docx');

const parseCsv = f => {
  const t = fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/^﻿/, '');
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.length > 1);
};
const places = parseCsv('체류시간_장소별.csv'); const PH = places[0], P = places.slice(1);
const summary = parseCsv('체류시간_분류별_요약.csv').slice(1);
const example = parseCsv('예시_일정_경주_2박3일.csv').slice(1);
const col = (r, name) => r[PH.indexOf(name)];
const nPlaces = P.length, nHours = P.filter(r => col(r, '운영시간적용') === 'Y').length,
      nZero = P.filter(r => col(r, '권장체류(분)') === '0').length, nYt = P.filter(r => col(r, '영상장소') === 'Y').length,
      nCand = P.filter(r => col(r, '자동코스후보') === 'Y').length;

const FONT = 'Malgun Gothic';
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 20, bold: o.bold, color: o.color, italics: o.italics });
const p = (text, o = {}) => new Paragraph({ children: Array.isArray(text) ? text : [run(text, o)], spacing: { after: o.after ?? 120, line: 300 }, alignment: o.align });
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(t, { size: 30, bold: true, color: '153B3D' })], spacing: { before: 360, after: 160 } });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(t, { size: 24, bold: true, color: '153B3D' })], spacing: { before: 240, after: 120 } });
const bullet = (t, level = 0) => new Paragraph({ numbering: { reference: 'bul', level }, children: Array.isArray(t) ? t : [run(t)], spacing: { after: 60, line: 300 } });
const numb = t => new Paragraph({ numbering: { reference: 'num', level: 0 }, children: Array.isArray(t) ? t : [run(t)], spacing: { after: 60, line: 300 } });
const code = t => new Paragraph({ children: [new TextRun({ text: t, font: 'Consolas', size: 17 })], shading: { type: ShadingType.CLEAR, fill: 'F2ECE0', color: 'auto' }, spacing: { after: 0, line: 260 }, indent: { left: 200 } });
const codeBlock = lines => lines.map(code).concat([p('', { after: 120 })]);
const b = t => run(t, { bold: true });

const TOTAL_W = 9360;
const table = (headers, rows, widths) => {
  const ws = widths || headers.map(() => Math.floor(TOTAL_W / headers.length));
  const cell = (t, i, head) => new TableCell({
    width: { size: ws[i], type: WidthType.DXA },
    shading: head ? { type: ShadingType.CLEAR, fill: '153B3D', color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: String(t).split('\n').map(line => new Paragraph({ children: [run(line, { size: 17, bold: head, color: head ? 'F2ECE0' : undefined })], spacing: { after: 0, line: 240 } })),
  });
  return new Table({
    width: { size: TOTAL_W, type: WidthType.DXA }, columnWidths: ws,
    rows: [new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, i, true)) }),
           ...rows.map(r => new TableRow({ children: r.map((c, i) => cell(c, i, false)) }))],
  });
};
const gap = () => p('', { after: 160 });

const children = [
  new Paragraph({ children: [run('Tour Navigator', { size: 22, color: 'B8431C', bold: true })], spacing: { before: 1200, after: 120 } }),
  new Paragraph({ children: [run('관광지 체류 시간 · 일정 시간 산정 로직', { size: 40, bold: true, color: '153B3D' })], spacing: { after: 200 } }),
  p('투어 플래너(Tour Planner.dc.html)가 장소마다 머무는 시간을 정하고, 이동 시간과 운영시간을 더해 하루 일정을 만드는 방법을 설명합니다. 함께 제공하는 CSV 는 이 문서의 규칙을 전 장소에 적용한 결과이고, JS 코드는 화면에서 로직만 분리해 옮긴 것입니다.', { size: 20 }),
  p('작성일 2026-09-26 · 기준 브랜치 claude/brave-dirac-zmdr4p', { size: 18, color: '666666' }),
  gap(),
  table(['파일', '내용'], [
    ['체류시간_장소별.csv', `장소 ${nPlaces.toLocaleString()}곳의 권장 체류 분, 운영시간 파싱 결과, 배지, 자동 코스 후보 여부`],
    ['체류시간_분류별_요약.csv', '분류 6개별 건수 · 최소 · 중앙값 · 평균 · 최대 · 구간 분포'],
    ['예시_일정_경주_2박3일.csv', '자동 코스와 시계 로직을 실제로 돌린 결과 (서울역 08:00 KTX 출발, 마지막 날 19:00 귀가)'],
    ['stay_schedule.js', '체류 · 이동 · 일자 창 · 배정 · 시계 · 자동 코스 함수 (Node, 의존성 없음)'],
    ['export_stay_csv.js', '화면 데이터를 읽어 위 CSV 3개를 만드는 스크립트 (node export_stay_csv.js)'],
  ], [3000, 6360]),
  new Paragraph({ children: [new PageBreak()] }),

  h1('1. 전체 흐름'),
  p('일정 시간은 네 단계로 계산됩니다. 각 단계는 앞 단계의 값을 그대로 받아 씁니다.'),
  numb([b('체류 시간'), run(' — 장소 데이터의 min 필드(분). 화면 안에서 계산하지 않고 데이터로 둡니다.')]),
  numb([b('이동 시간'), run(' — Google 길찾기 실측이 있으면 그 값, 없으면 직선거리 기반 추정식.')]),
  numb([b('일자 창'), run(' — 날짜마다 쓸 수 있는 분. 기본 720분(09:00–21:00), 첫날과 마지막 날은 출발 · 귀가 시각으로 줄어듭니다.')]),
  numb([b('배정과 시계'), run(' — 경유지를 순서대로 (이동 + 대기 + 체류) 만큼 누적해 창에 담고, 도착 · 출발 시각을 찍습니다. 자동 코스는 이 규칙으로 후보를 고릅니다.')]),
  gap(),

  h1('2. 체류 시간 (min 필드)'),
  p('장소 레코드마다 권장 체류 시간이 분 단위 정수로 들어 있습니다. 답사와 영상 장면을 기준으로 사람이 정한 값이며, 분류별 기본값이나 자동 산식은 없습니다. 값이 0 이거나 없는 장소는 코스에 들어가지 않고, 숙박(stay) 분류는 체류 값이 있어도 자동 코스 후보에서 뺍니다.'),
  ...codeBlock(["{ id:'gj2', ko:'쪽샘 44호 신라공주묘', cat:'herit', min:40, hrs:'09:00–18:00', … }",
             "체류 표기: min>=60 ? floor(min/60)+'h' + (min%60 ? ' '+min%60+'m' : '') : min+'m'   → 40 → '40m', 90 → '1h 30m'"]),
  p(`전 장소 ${nPlaces.toLocaleString()}곳 중 체류 값이 0 인 곳은 ${nZero}곳, 자동 코스 후보(체류 > 0 이고 숙박이 아님)는 ${nCand.toLocaleString()}곳입니다. 분류별 분포는 다음과 같습니다.`),
  table(['분류', '장소 수', '최소', '중앙값', '평균', '최대', '~30', '31~60', '61~90', '91~120', '121~180', '181~'],
    summary.map(r => [r[1], r[2], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13]]),
    [1900, 800, 620, 700, 620, 620, 560, 680, 680, 720, 760, 700]),
  p('단위는 분. 구간 열은 해당 범위에 드는 장소 수입니다.', { size: 17, color: '666666' }),
  p('읽는 법: 역사 · 문화유산은 60분이 중심이고 180분을 넘지 않습니다. 힐링 · 생태와 해양 · 자연에는 둘레길 · 섬처럼 반나절(240~480분)짜리가 있고, 테마파크는 240~300분 항목이 놀이공원입니다. 먹거리는 30~120분 안에 모여 있습니다.'),

  h1('3. 운영시간'),
  p('hrs 문자열에서 "HH:MM–HH:MM" 꼴을 찾아 개장 · 폐장 시각으로 씁니다. 구분자는 –, ~, - 를 모두 받습니다. 그런 꼴이 없으면 상시 개방으로 봅니다. 폐장이 개장보다 이르면(예: 18:00–02:00) 자정을 넘긴 것으로 24시간을 더합니다.'),
  ...codeBlock(["/(\\d{1,2}):(\\d{2})\\s*[–~\\-]\\s*(\\d{1,2}):(\\d{2})/   → { open: 9*60, close: 18*60 }",
             "'상시 개방 · 무료' → null (제약 없음)      '15:00 IN / 11:00 OUT' → null (숙박 표기는 패턴에 안 맞음)"]),
  p(`전 장소 중 운영시간이 파싱되는 곳은 ${nHours.toLocaleString()}곳(${Math.round(nHours / nPlaces * 100)}%)입니다. 나머지는 상시 개방으로 취급되어 어느 시각에도 배정될 수 있습니다.`),

  h1('4. 이동 시간 추정'),
  p('두 장소 사이 직선거리를 위도 보정 근사로 구하고 도로 우회 계수 1.35(자가용 1.30)를 곱합니다. 여기에 이동 수단별 식을 적용하며, 결과는 최소 8분으로 올림합니다. Google 길찾기 실측이 들어오면 시군 안 구간은 실측을 우선 씁니다. 시군이 다른 광역 구간은 Google 대중교통이 시내버스 우회 경로를 돌려주는 문제가 있어 항상 추정식을 씁니다.'),
  table(['구간 · 수단', '식 (d = 보정 거리 km)', '근거'], [
    ['시군 안 · 대중교통', 'd ≤ 3 : max(10, 11·d)\nd > 3 : 15 + 3.6·d', '도보권은 km당 11분, 그 밖은 대기 15분 + km당 3.6분'],
    ['시군 안 · 렌터카', 'd ≤ 30 : 8 + 2.2·d\nd > 30 : 20 + 1.05·d', '시내 약 27km/h, 장거리 약 57km/h'],
    ['시군 간 · 철도(KTX/SRT 양쪽 관문)', '18 + 0.30·d + 35', '고속선 약 200km/h + 승하차 18분 + 발권 · 대기 35분'],
    ['시군 간 · 고속버스', '18 + 0.55·d + 35', '고속도로 약 110km/h + 승하차 + 발권 · 대기'],
    ['시군 간 · 전철권 내부', '12 + 0.95·d + 15', '광역전철 약 63km/h + 승강장 이동. 발권이 없어 여유 15분'],
    ['자가용(모든 구간)', 'd ≤ 20 : d/35·60\nd > 20 : 15 + 34 + (d−20)/92·60 + 휴게 15분×floor(주행/120)', '한국도로공사 표정속도 92km/h, 시내 35km/h, 진출입 15분, 2시간마다 휴게 15분'],
  ], [2600, 3200, 3560]),
  gap(),
  p('출발지(역 · 터미널 · 공항)에서 지역 관문까지의 광역 접근 시간은 별도 식을 씁니다. 첫날 일자 창을 줄이는 데 쓰입니다.'),
  table(['수단', '식', '의미'], [
    ['항공', '90 + 0.11·d', '수속 · 탑승 대기 90분 + 순항'],
    ['여객선', '60 + 0.85·d', '승선 수속 60분 + 약 40km/h'],
    ['광역전철', '12 + 0.95·d', '약 63km/h(정차 포함) + 승강장 이동'],
    ['KTX · SRT', '18 + 0.30·d', '약 200km/h + 승하차'],
    ['고속버스', '18 + 0.55·d', '약 110km/h + 승하차'],
    ['자가용', '자가용 주행식', '관문을 거치지 않고 직행'],
  ], [1800, 2400, 5160]),

  h1('5. 하루 예산과 일자 창'),
  p('하루 활동 시간은 09:00–21:00, 720분입니다. 여행 일수는 출발일과 귀가일 차이 + 1 이고, 전체 예산은 720 × 일수입니다. 날짜별 창은 다음과 같이 줄어듭니다.'),
  bullet([b('중간 날'), run(' — 720분')]),
  bullet([b('첫날'), run(' — 21:00 − (출발 시각 + 광역 접근 시간). 720분 상한, 0 하한')]),
  bullet([b('마지막 날'), run(' — 여행지 출발 시각 − 09:00. 720분 상한')]),
  bullet([b('당일치기'), run(' — 첫날 규칙과 마지막 날 규칙을 함께 적용')]),
  p('첫날 시계는 max(09:00, 출발 시각 + 접근 시간)에서, 나머지 날은 09:00 에서 시작합니다. 예시의 경주 2박 3일(서울역 08:00 KTX, 19:00 귀가)은 접근 128분, 창 652 / 720 / 600분이 됩니다.'),

  h1('6. 일자 배정과 도착 시각'),
  p('사용자가 고른 순서대로 경유지를 훑으며 (진입 이동 + 체류) 를 누적합니다. 누적이 그날 창을 넘기면 다음 날로 넘어가 0 부터 다시 셉니다. 마지막 날에도 들어가지 않는 경유지부터는 코스에서 잘라냅니다(trim). 실측 이동시간이 나중에 들어와 예산을 넘겨도 같은 규칙으로 뒤쪽을 덜어냅니다.'),
  p('도착 시각은 그날 시작 시계에서 출발해 앞 장소와의 이동 시간을 더하고, 개장 전이면 개장 시각까지 기다린 뒤 체류 시간만큼 머문 시각을 출발 시각으로 찍습니다. 표시용 시계는 폐장 시각을 검사하지 않습니다. 폐장 검사는 자동 코스에서만 합니다.'),
  ...codeBlock(['clock = dayStart', 'for each stop k:', '  if k>0: clock += leg(prev, stop).min', '  if open && clock < open: clock = open        // 개장 대기', '  arrive = clock;  clock += stop.min;  leave = clock']),

  h1('7. 자동 코스'),
  p('"자동 설계" 버튼은 시군(클러스터) 단위로 날짜를 나눈 뒤, 창 안에 들어가는 후보를 차례로 담습니다.'),
  numb([b('후보'), run(' — 체류 > 0 이고 숙박이 아닌 장소. 시군을 골랐으면 그 시군만.')]),
  numb([b('시군 가중치'), run(' — 영상 장소 수 × 2 + min(장소 수, 8). 날짜가 시군 수보다 적으면 가중치 상위 시군만 남깁니다.')]),
  numb([b('시군 체인'), run(' — 가중치 1위에서 출발해 가까운 시군 순으로 잇습니다. 일수는 시군마다 1일씩 준 뒤 남는 날을 가중치 순으로 더합니다.')]),
  numb([b('후보 순위'), run(' — 시군에 막 들어갔을 때는 영상 장소 → 순번 순. 그 뒤로는 (이동 분 + 확장 장소면 +26 − 영상 장소면 14) 가 작은 순.')]),
  numb([b('담기 검사'), run(' — 이동(시군을 넘으면 +45분 환승 여유) → 개장 전이면 대기 → 폐장 전에 체류를 못 마치면 건너뜀 → 그날 창을 넘기면 다음 후보. 맞는 후보가 없으면 다음 날, 마지막 날이면 다음 시군.')]),
  numb([b('상한'), run(' — 한 시군에서 max(2, 배분 일수 × 3) 곳을 담으면 다음 시군으로 넘어갑니다. 전체 18곳에서 멈춥니다.')]),
  gap(),
  h2('예시: 경주 2박 3일'),
  p('stay_schedule.js 의 자동 코스와 시계를 서울역 08:00 KTX 출발, 마지막 날 19:00 귀가 조건으로 돌린 결과입니다. Google 실측 없이 추정식만 썼습니다.'),
  table(['일차', '순', '장소', '분류', '이동', '대기', '체류', '도착', '출발'],
    example.map(r => [r[0], r[1], r[3], r[4], r[5], r[6], r[7], r[8], r[9]]),
    [560, 480, 2700, 1700, 640, 640, 640, 1000, 1000]),
  p('이동 · 대기 · 체류는 분. 2일차 첫 장소는 09:00 에 도착했지만 개장이 10:00 이라 60분 대기한 뒤 배정됐습니다.', { size: 17, color: '666666' }),

  h1('8. CSV 열 설명'),
  table(['열', '뜻'], [
    ['화면 · 도시 · 시군', '데이터가 속한 화면 키(nation · seoul · busan · jeju · yeongwol), 화면의 도시명, 장소의 시군(locKo)'],
    ['순번 · id', '화면 순번(확장 장소는 ·)과 장소 id'],
    ['분류코드 · 분류', 'herit 역사·문화유산 / heal 힐링·생태·체험 / activity 테마파크·액티비티 / food 로컬상권·먹거리 / sea 해양·자연경관 / stay 숙박·로컬체험'],
    ['권장체류(분) · 체류표기', 'min 값과 화면 표기(1h 30m)'],
    ['운영시간(원문) · 개장 · 폐장 · 운영시간적용', 'hrs 원문, 파싱된 개장 · 폐장 시각, 파싱 성공 여부(N 이면 상시 개방 취급)'],
    ['영상장소 · 확장장소', '영상 장면이 있는 장소(yt), 전국 확장으로 추가된 장소(off). 자동 코스 순위에 각각 −14 · +26 분 가중'],
    ['한국관광100선 · 유네스코 · 무장애', '배지 플래그(k100 · un · bf)'],
    ['자동코스후보', '체류 > 0 이고 숙박이 아니면 Y'],
    ['좌표근거', 'srcKo 원문'],
  ], [3000, 6360]),

  h1('9. 확인된 문제와 제안'),
  bullet([b('id 중복 62건'), run(' — 전국(nation) 목록이 경주 40곳 · 거제 22곳을 이미 담고 있는데, 조립 코드가 경주 · 거제 화면 목록을 한 번 더 붙입니다. 자동 코스에서 같은 장소가 두 번 나올 수 있습니다. CSV 와 예시는 첫 레코드만 남겨 계산했습니다. 조립 코드에서 재결합을 빼거나 id 로 중복을 걸러내면 됩니다.')]),
  bullet([b('표시 시계의 폐장 미검사'), run(' — 사용자가 직접 고른 코스는 폐장 뒤 도착해도 시각이 그대로 찍힙니다. timeline 결과의 closesBefore 플래그를 화면에서 경고로 쓰면 됩니다.')]),
  bullet([b('운영시간 표기 불일치'), run(' — "15:00 IN / 11:00 OUT", "전망대 09:00–18:00" 처럼 패턴 앞에 다른 시각이 오면 첫 시각 쌍을 잡습니다. 숙박은 후보에서 빠지므로 영향이 없지만, 부속 시설 시각이 본 시설로 잡히는 경우는 검토가 필요합니다.')]),
  bullet([b('식사 시간 미반영'), run(' — 하루 창에 점심 · 저녁이 따로 잡히지 않습니다. 먹거리 분류 장소가 코스에 있을 때만 식사가 반영되는 셈입니다. 12:00 · 18:00 부근에 60분 예약을 두는 방식을 검토할 만합니다.')]),
  bullet([b('체류 값 없는 장소'), run(` — ${nZero}곳이 0 으로 남아 코스에 들어가지 않습니다. 체류시간_장소별.csv 에서 권장체류(분) 이 0 인 행을 채우면 됩니다.`)]),
];

const doc = new Document({
  creator: 'Tour Navigator', title: '관광지 체류 시간 · 일정 시간 산정 로직',
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  numbering: { config: [
    { reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] },
    { reference: 'num', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 300 } } } }] },
  ] },
  sections: [{ properties: { page: { margin: { top: 1300, bottom: 1300, left: 1300, right: 1300 } } }, children }],
});
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(path.join(__dirname, '체류시간_산정_로직_설명.docx'), buf); console.log('docx ok', buf.length, 'bytes'); });
