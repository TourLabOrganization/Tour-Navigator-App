// Tour Navigator App 시스템 구성 명세서 (초안) — docx 생성
// 시스템 구성 명세서 docx 생성 —  npm i docx && node build_spec.js
const path = require('path'); const fs = require('fs'); const HERE = __dirname;
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType,
  ShadingType, AlignmentType, ImageRun, LevelFormat, BorderStyle, PageBreak, TableOfContents,
  Header, Footer, PageNumber, VerticalAlign,
} = require('docx');

const FONT = 'Malgun Gothic';
const INK = '153B3D', ORANGE = 'B8431C', CREAM = 'F2ECE0', GREY = 'E6E4E1';
const CONTENT_W = 9638; // A4 (11906) − 2 × 1134

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 20, bold: o.bold, color: o.color, italics: o.italics });
const p = (text, o = {}) => new Paragraph({
  children: Array.isArray(text) ? text : [run(text, o)],
  spacing: { after: o.after ?? 120, line: 300 },
  alignment: o.align,
});
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(t, { size: 30, bold: true, color: INK })], spacing: { before: 360, after: 160 } });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(t, { size: 24, bold: true, color: INK })], spacing: { before: 240, after: 120 } });
const bullet = (text, level = 0) => new Paragraph({ numbering: { reference: 'bullets', level }, children: Array.isArray(text) ? text : [run(text)], spacing: { after: 60, line: 290 } });
const numbered = (text, ref) => new Paragraph({ numbering: { reference: ref, level: 0 }, children: Array.isArray(text) ? text : [run(text)], spacing: { after: 60, line: 290 } });
const code = t => run(t, { size: 18 });

function table(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const cell = (t, i, head) => new TableCell({
    width: { size: widths[i], type: WidthType.DXA },
    shading: head ? { type: ShadingType.CLEAR, fill: CREAM, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [run(String(t), { bold: head, size: 18 })], spacing: { after: 0, line: 260 } })],
  });
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, i, true)) }),
      ...rows.map(r => new TableRow({ children: r.map((c, i) => cell(c, i, false)) })),
    ],
  });
}
const gap = () => new Paragraph({ spacing: { after: 120 }, children: [] });

const img = fs.readFileSync(path.join(HERE, '시스템_구성도.png'));
const diagram = new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new ImageRun({ type: 'png', data: img, transformation: { width: 642, height: 492 }, altText: { title: '시스템 구성도', description: 'Tour Navigator App 시스템 구성도', name: 'diagram' } })],
  spacing: { after: 80 },
});

const children = [
  // 표지
  new Paragraph({ spacing: { before: 2400, after: 200 }, children: [run('Tour Navigator App', { size: 52, bold: true, color: INK })] }),
  new Paragraph({ spacing: { after: 120 }, children: [run('시스템 구성 명세서', { size: 40, bold: true, color: ORANGE })] }),
  new Paragraph({ spacing: { after: 800 }, children: [run('v1.0 · 2026-09-26', { size: 22, color: '3C5658' })] }),
  table(['항목', '내용'], [
    ['문서 목적', '앱을 이루는 구성 요소, 요소 간 호출 관계, 외부 인터페이스, 배포 구조를 한 장의 구성도와 표로 정리한다.'],
    ['대상 시스템', 'Tour Navigator App — 영상 속 장소를 따라 걷는 여행 계획 웹 앱 (테마 화면 5종 + 통합 플래너 + 홈)'],
    ['기준 저장소', 'GitHub TourLabOrganization/Tour-Navigator-App · 브랜치 claude/brave-dirac-zmdr4p · 커밋 fc511ca (2026-09-26 Claude Design 내보내기본 통합 이후)'],
    ['문서 상태', '저장소 `시스템 구성도/` 폴더에서 관리. 구성도(구성도.html → render_png.mjs)와 이 문서(build_spec.js)는 스크립트로 다시 만든다.'],
    ['관련 문서', 'README.md · ARCHITECTURE.md · DATA.md · APIS.md · DESIGN.md · STYLES.md · CONTRIBUTING.md · ROADMAP.md · 테마 추천 알고리즘/README.md · 체류시간 산정/README.md'],
  ], [1800, 7838]),
  new Paragraph({ children: [new PageBreak()] }),

  // 목차
  h1('목차'),
  new TableOfContents('목차', { hyperlink: true, headingStyleRange: '1-2' }),
  p('목차는 Word 에서 문서를 열고 필드 업데이트(F9)하면 채워집니다.', { size: 18, color: '3C5658' }),
  new Paragraph({ children: [new PageBreak()] }),

  // 1 개요
  h1('1. 개요'),
  h2('1.1 시스템 요약'),
  p('Tour Navigator App 은 빌드 과정이 없는 정적 웹 앱이다. 화면 7개가 각각 하나의 Design Component 파일(.dc.html)이고, 같은 폴더의 support.js 가 브라우저에서 템플릿을 컴파일하고 로직 클래스를 실행한다. 지도·장소 정보·영상 통계는 브라우저가 외부 API 를 직접 호출해 얻으며, 서버 측 코드는 없다. 여기에 오프라인에서 돌리는 Python 파이프라인(테마 추천 알고리즘)이 조사 통계와 앱 장소 데이터를 읽어 여행자 군집별 추천 테마 점수를 계산하고, 그 결과 JSON 을 저장소에 함께 둔다.'),
  h2('1.2 설계 원칙'),
  bullet([run('빌드 없음. ', { bold: true }), run('저장소를 그대로 정적 호스팅하면 동작한다. 로컬에서는 python -m http.server 로 연다.')]),
  bullet([run('키는 한 곳. ', { bold: true }), run('모든 API 키는 config.js(window.APP_CONFIG) 에서만 읽고, 이 파일은 git 에서 제외한다. 키가 비어 있으면 해당 기능만 조용히 꺼진다.')]),
  bullet([run('브라우저 계산. ', { bold: true }), run('코스 계산·숙소 추천·이동 시간 추정은 전부 화면 안 JavaScript 에서 수행한다.')]),
  bullet([run('공용 코드 분리. ', { bold: true }), run('플래너와 테마 화면 5종이 함께 쓰는 상수·순수 함수는 shared.js, 공통 스타일은 shared.css 에 두고 화면에는 화면별 데이터만 남긴다.')]),
  bullet([run('오프라인 파이프라인. ', { bold: true }), run('통계 조사 원자료를 쓰는 계산은 앱 밖(Python)에서 하고, 재현 가능한 결과 JSON 만 저장소에 커밋한다.')]),
  h2('1.3 범위'),
  p('이 문서는 현재 저장소에 있는 코드와 데이터, 그리고 ROADMAP 에 적힌 계획 항목(CORS 프록시, 테마 추천 화면)을 다룬다. 서버·DB·인증은 현재 시스템에 없으므로 다루지 않는다.'),

  // 2 구성도
  h1('2. 시스템 구성도'),
  diagram,
  p('그림 1. 시스템 구성도. 원본은 같은 폴더의 시스템_구성도.png (3200×2450).', { size: 18, color: '3C5658', align: AlignmentType.CENTER }),
  h2('2.1 범례'),
  table(['표기', '뜻'], [
    ['진한 잉크색 상자', '런타임 · 핵심 요소 (사용자 단말, support.js, GitHub 저장소)'],
    ['흰 상자', '구성 요소 (화면, 공용 모듈, 계산 스크립트)'],
    ['회색 상자', '데이터 · 파일 (assets/, 조사 자료, 계산 결과)'],
    ['주황 상자', '키가 필요한 외부 서비스'],
    ['점선 상자', '계획 항목 (CORS 프록시, 테마 추천 화면)'],
    ['실선 화살표', '호출 · 로드. 주황 실선은 API 키를 쓰는 호출'],
    ['점선 화살표', '계획된 흐름 또는 사람이 수행하는 수동 단계'],
  ], [2600, 7038]),
  h2('2.2 구성 요소 그룹'),
  table(['그룹', '구성', '실행 위치'], [
    ['정적 웹 앱', '화면 7개 · support.js · config.js · shared.js · shared.css · image-slot.js · assets/ · uploads/', '사용자 브라우저'],
    ['외부 서비스', 'Google Maps · YouTube Data · 공공데이터포털(한국관광공사 · 기상청 · 에어코리아 · 한국공항공사) · Kakao · 한국도로공사 · TMDB · 키 없는 서비스 · 예매 링크', '각 서비스 제공자'],
    ['테마 추천 알고리즘', 'run_all.py 와 src/ 스크립트 6개, 입력 조사 자료, 출력 data/derived/*.json', '개발자 PC (Python 3)'],
    ['체류시간 산정', '플래너의 체류 · 이동 · 일자 창 · 배정 로직을 분리한 stay_schedule.js, 장소별 CSV 생성기, 설명서', '개발자 PC (Node)'],
    ['설계 · 저장소 · 배포', 'Claude Design → GitHub 저장소 → 정적 호스팅', '설계 도구 · GitHub · 호스팅'],
  ], [2000, 5438, 2200]),

  // 3 구성 요소 명세
  h1('3. 구성 요소 명세'),
  h2('3.1 화면 (.dc.html)'),
  p('각 화면 파일은 <helmet>(폰트 · shared.css 링크 · 화면 고유 @keyframes), 인라인 스타일 템플릿, 그리고 class Component extends DCLogic 로직 클래스로 이루어진다. 화면별 데이터(DATA · REGION_HUB · ORIGINS · TRANSIT · STAYS · I18N)는 화면 안에 남아 있다.'),
  table(['화면', '파일', '내용', '줄 수'], [
    ['홈', 'Tour Navigator Home.dc.html', '자동 회전 배너 5장, 나의 테마 타일, 테마 추천(14문항 → 여행자 유형 → 추천 테마 3개), ME 화면(나의 테마 · 저장 플랜), 인앱 화면 전환', '734'],
    ['투어 플래너', 'Tour Planner.dc.html', '전 테마 장소 통합, 도시 클러스터, 날짜 범위 코스 계산, 광역교통 2단계 선택과 이동 체인 · 시각표, 도시철도 호선 → 역, 카페리, 일자별 장소 추가, 내 플랜 저장, 여행 기간 행사', '7,048'],
    ['RESCENE Route', 'RESCENE Route.dc.html', '경주 · 거제 · 전국 (36곳)', '2,956'],
    ['왕과 사는 남자', 'Kings Warden Route.dc.html', '영월 (5곳)', '2,843'],
    ['케이팝 데몬 헌터스', 'KPop Demon Hunters Route.dc.html', '서울 (11곳)', '3,135'],
    ['제주 K-Drama', 'Jeju K-Drama Route.dc.html', '제주 (11곳)', '3,004'],
    ['부산 영화 기행', 'Busan Cinema Route.dc.html', '부산 (12곳)', '3,222'],
  ], [1900, 3000, 3738, 1000]),
  gap(),
  p('테마 화면 5종은 구조와 로직이 거의 같다(내보내기본 기준 파일 간 공통 줄 60% 이상). 런타임 공용화는 8장 향후 계획에서 다룬다.', { size: 18, color: '3C5658' }),
  h2('3.2 런타임 · 공용 모듈'),
  table(['파일', '역할', '비고'], [
    ['support.js', 'DC 런타임. <x-dc> 안의 템플릿 컴파일, <helmet> 의 링크·스타일을 <head> 로 이동, data-dc-script 의 로직 클래스를 new Function 으로 실행', 'React 18.3 · ReactDOM · Babel standalone 을 unpkg CDN 에서 로드'],
    ['config.js', 'window.APP_CONFIG 로 API 키 보관. config.example.js 를 복사해 만들며 git 제외', '없으면 404 한 줄만 찍히고 키 기능이 꺼짐'],
    ['shared.js', '플래너 + 테마 5종 공용: 키 상수(GMAPS_KEY · YT_KEY · KAKAO_KEY · DATA_GO_KR_KEY · EXROAD_KEY · TMDB_KEY), 팔레트 · 지도 스킨 · 카테고리 표 · 달력 문자열 · cityName · vNum · vDate · stayPrice · stayQuery · hav, 조회 함수 getWeather(Open-Meteo + 기상청 단기예보) · getAirQuality(에어코리아) · getFestivals(TourAPI 축제) · getRelatedSpots(연관 관광지) · getTitleMeta(TMDB)', '<head> 에서 support.js → config.js → shared.js 순으로 로드'],
    ['shared.css', '7개 화면 공통 스타일: 리셋 · 폰트 · 링크 색 · 포커스 · Leaflet · 스크롤바 · 공용 애니메이션', '화면 고유 @keyframes 만 각 화면 <style> 에 남김'],
    ['image-slot.js', '이미지 슬롯 웹 컴포넌트', ''],
  ], [1700, 5038, 2900]),
  h2('3.3 데이터 파일 (assets/)'),
  table(['파일', '내용', '쓰는 곳'], [
    ['tour-places.csv', '장소 마스터 1,197곳 — 좌표(WGS84) · 카테고리 · 운영시간 · 요금 · 사진 · 근거(srcKo/srcEn) · 배지', '테마 추천 알고리즘 classify.py (화면은 내장 DATA 사용)'],
    ['open-tour-unmatched.csv', '열린관광지 배지 매칭이 남은 12곳 (ROADMAP 작업 목록)', '배지 잔여 작업'],
    ['unesco.png · busan-tile.jpg · screenshots/', '유네스코 배지, 홈 타일, README 캡처', '화면 · README'],
    ['uploads/images (17~24).jpg', '홈 배너 · 테마 타일 이미지', 'Tour Navigator Home'],
  ], [3000, 4238, 2400]),
  h2('3.4 테마 추천 알고리즘 (Python)'),
  p('선호 문항 14개 → 여행자 군집 10개 판정 → 군집별 추천 테마 점수를 계산하는 오프라인 파이프라인이다. run_all.py 가 src/ 스크립트를 순서대로 실행하고 결과를 data/derived/ 에 쓴다. classify.py 는 이 폴더의 상위 폴더를 앱 저장소로 보고 assets/tour-places.csv 와 테마 화면 .dc.html 을 읽는다(다른 위치면 APP_REPO 환경변수).'),
  table(['단계', '스크립트', '입력', '출력'], [
    ['1', 'survey.py', '2025 국민여행조사 공표표', 'survey.json — 연령 lift, Q1 점수, 지역 보정'],
    ['2 (선택)', 'load_raw.py', '외래관광객조사 원자료 SAV (data/raw/, git 제외)', 'df.pkl'],
    ['3 (선택)', 'foreign_cluster.py', 'df.pkl', 'fb.json — 가중 k-평균(k=6) 군집'],
    ['4 (선택)', 'foreign_lift.py', 'df.pkl · 군집 라벨', 'fa.json — C7~C10 보기별 lift · 점수, 지역 · 국적 비중'],
    ['5', 'classify.py', '../assets/tour-places.csv · ../*.dc.html · 장소_재분류_초안.xlsx', 'classified.json — 장소 주·보조 카테고리 · 태그, 테마 구성비'],
    ['6', 'calc2.py', 'survey.json · fa.json · classified.json · 가중치 W', 'calc2.json — 군집×테마 적합 점수, 대표 사용자 최종 점수'],
  ], [1100, 1900, 3438, 3200]),
  gap(),
  p('원자료가 없으면 2~4단계는 건너뛰고 기존 fa.json · fb.json 을 쓴다. 현재 커밋된 결과는 같은 명령으로 재현된다.', { size: 18, color: '3C5658' }),

  // 4 처리 흐름
  h1('4. 처리 흐름'),
  h2('4.1 화면 로드'),
  numbered('브라우저가 .dc.html 을 연다. <head> 에서 support.js → config.js → shared.js 를 순서대로 읽는다.', 'flowLoad'),
  numbered('support.js 가 unpkg 에서 React · ReactDOM · Babel 을 받고, <helmet> 의 폰트 링크 · shared.css · 화면 고유 <style> 을 <head> 로 옮긴다.', 'flowLoad'),
  numbered('템플릿({{ }} 값 홀, <sc-for> · <sc-if>)을 컴파일하고 로직 클래스를 실행해 renderVals() 로 화면을 그린다.', 'flowLoad'),
  numbered('GMAPS_KEY 가 있으면 언어에 맞는 Google Maps 로더를 주입한다. 없으면 지도 없이 목록만 동작한다.', 'flowLoad'),
  h2('4.2 장소 상세 조회'),
  p('장소를 열면 좌표 기준으로 한국관광공사 DB(locationBasedList2 → detailCommon2)를 조회해 공식 표기 · 운영시간 · 요금 · 사진 · 오디오 가이드 · 스토리텔링을 채운다. 표기는 선택 언어 DB → 영어 DB → 내장 한국어 순으로 떨어진다. 화면 진입 시 최대 120건을 선인출하고 나머지는 상세를 열 때 요청한다.'),
  h2('4.3 코스 계산 (플래너)'),
  numbered('날짜 범위 → 일수 산출 (하루 9~12시간 예산)', 'flowCourse'),
  numbered('선택 장소를 도시 단위로 묶고, 도시 간은 REGION_HUB / TRANSIT 로 연결', 'flowCourse'),
  numbered('도시 안은 좌표 기준 최근접 순회로 정렬하고 체류 시간 가산 (거리는 hav 대권거리)', 'flowCourse'),
  numbered('수도권 전철권이면 METRO 기반 경로와 출발역 선택으로 대체', 'flowCourse'),
  numbered('일자별로 잘라 카드로 렌더, 구간마다 이동 수단 · 시간 · 예매 버튼 부착, 동선 25km 내 STAYS 로 숙소 추천', 'flowCourse'),
  h2('4.4 테마 추천 계산 (오프라인)'),
  p('개발자가 python run_all.py 를 실행한다. 결과 JSON 을 커밋하면 저장소가 최신 계산을 담는다. 앱 화면에서 이 결과를 읽는 [테마 추천] 기능은 아직 없다(계획).'),
  table(['항목', '식'], [
    ['lift', '군집(또는 연령) 안의 비율 ÷ 전체 비율'],
    ['문항 점수', 'round(2 × log₂ lift), 0~3'],
    ['군집 확률', '2^(점수 합 ÷ 2) 의 비율'],
    ['테마 구성비', '장소별 주 카테고리 0.6 + 보조 0.4 (보조 없으면 1.0)'],
    ['테마 적합 점수', 'Σ(테마 구성비 × 군집 카테고리 가중치)'],
    ['최종 점수', '적합 + 0.5 × (관심사 구성비 합 + 야경 태그 비중) + 지역 보정'],
  ], [2400, 7238]),
  h2('4.5 화면 재내보내기 (Claude Design → 저장소)'),
  p('화면은 Claude Design 에서 설계하고 .dc.html 로 내보낸다. 내보내기본은 공통 코드와 키를 화면 안에 다시 포함하므로, 저장소에 반영할 때 다음을 수행한다.'),
  bullet('<helmet> 에 <link rel="stylesheet" href="shared.css"> 를 넣고 공통 <style> 블록을 제거한다.'),
  bullet('<head> 에 config.js · shared.js <script> 태그를 support.js 다음에 넣는다.'),
  bullet('내보내기본에 딸려 온 공용 상수 · 함수 정의와 키 문자열을 지운다. 지도 로더 URL 은 GMAPS_KEY 를 쓰도록 바꾼다.'),
  bullet('헤드리스 브라우저로 7개 화면을 열어 스크립트 오류가 없는지 확인한 뒤 커밋한다.'),

  // 5 외부 인터페이스
  h1('5. 외부 인터페이스 명세'),
  table(['서비스', '용도', '엔드포인트 · 호출 방식', 'config.js 항목', '호출 위치', '제약'], [
    ['Google Maps JavaScript API', '지도 · 마커 · 클러스터', 'maps.googleapis.com/maps/api/js?key=…&libraries=marker&language=…&region=KR (스크립트 주입)', 'googleMaps', '플래너 · 테마 5종', '자동차 경로는 국내 미제공 → 거리 기반 추정'],
    ['YouTube Data API v3', '영상 조회수 · 게시일', 'www.googleapis.com/youtube/v3/videos?part=snippet,statistics', 'youtube', '플래너 · 테마 5종', '하루 1회 갱신, localStorage 캐시'],
    ['한국관광공사 TourAPI (공공데이터포털)', '장소 정보 · 다국어 표기 · 사진 · 오디오 · 스토리텔링 · 축제·행사(searchFestival2)', 'apis.data.go.kr/B551011/KorService2 등 · serviceKey', 'dataGoKr', '플래너 · 테마 5종', '프랑스어 서비스 없음 → 영어 표시'],
    ['한국관광공사 연관 관광지 (공공데이터포털)', '장소 상세 "함께 많이 가는 관광지"', 'apis.data.go.kr/B551011/TarRlteTarService1 · signguCd 필수 (Kakao coord2regioncode 로 산출)', 'dataGoKr', 'shared.js getRelatedSpots · 6개 화면', '2→3→4개월 전 기준월 순으로 시도'],
    ['기상청 단기예보 (공공데이터포털)', '오늘 · 내일 최고기온 · 강수 · 하늘', 'apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst · 격자 nx,ny', 'dataGoKr', 'shared.js getKmaForecast', '활용신청 필요 · 실패 시 Open-Meteo 값'],
    ['한국환경공단 에어코리아 (공공데이터포털)', '시도별 PM10 · PM2.5 · 등급', 'apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty', 'dataGoKr', '장소 상세 (6개 화면)', '활용신청 필요 · 30분 캐시'],
    ['TMDB', '영화 · 드라마 포스터 · 줄거리 · 평점', 'api.themoviedb.org/3/search/{movie|tv}', 'tmdb', '테마 화면 4종 채널 탭', '7일 localStorage 캐시'],
    ['한국공항공사 (공공데이터포털)', '국내선 운항 현황', 'KAC_ENDPOINT (미설정)', 'dataGoKr', '플래너', 'CORS 차단 → 항공 요약 하드코딩, 프록시 후 전환'],
    ['Kakao REST', '로컬 검색', 'Authorization: KakaoAK …', 'kakao', '플래너 · 테마 5종', ''],
    ['한국도로공사', '휴게소 목록', 'data.ex.co.kr/openapi/restinfo/restBestfoodList?key=…', 'exRoad', '플래너 · 테마 5종', '키 없으면 호출 생략'],
    ['Open-Meteo', '날씨 (어제, 그리고 기상청 실패 시 오늘 · 내일)', 'api.open-meteo.com/v1/forecast', '없음', 'shared.js getWeather', '실패 시 물음표 값'],
    ['Wikimedia Commons', '장소 사진', 'upload.wikimedia.org (이미지 URL)', '없음', '내장 DATA', '자유 이용 이미지'],
    ['unpkg CDN', 'React 18.3.1 · ReactDOM · Babel standalone 7.29', 'unpkg.com (스크립트 로드)', '없음', 'support.js', 'CDN 불통 시 화면이 뜨지 않음'],
    ['Google Fonts', 'Archivo · Gowun Dodum', 'fonts.googleapis.com', '없음', '각 화면 <helmet>', ''],
    ['예매 · 지도 링크', '코레일 · SRT · 티머니 버스 · 숙박 OTA · 렌터카 · 카카오T · 네이버/카카오 지도', '새 창 링크 (API 호출 없음)', '없음', '플래너 · 테마 5종', '날짜 · 검색어를 URL 에 채워 전달'],
  ], [1650, 1500, 2288, 1000, 1400, 1800]),
  gap(),
  p('인천교통공사 · 부산관광공사 · 부산 도시철도(Humetro) 호출 코드는 있으나 키가 비어 있어 현재 비활성이다.', { size: 18, color: '3C5658' }),

  // 6 배포 운영
  h1('6. 배포 · 운영'),
  h2('6.1 배포 구조'),
  bullet('저장소 루트를 그대로 정적 호스팅한다(GitHub Pages 등). 서버 프로세스 · 빌드 · 번들러가 없다.'),
  bullet('config.js 는 배포 환경에만 둔다. 저장소에는 config.example.js 만 있다.'),
  bullet('로컬 실행: cp config.example.js config.js 후 python3 -m http.server 8000.'),
  h2('6.2 키 관리'),
  bullet('키는 config.js 의 googleMaps · youtube · kakao · dataGoKr · exRoad · tmdb 여섯 항목이다. dataGoKr 하나로 한국관광공사 · 기상청 · 에어코리아 · 한국공항공사 서비스를 부르며, 각 서비스는 공공데이터포털에서 활용신청이 필요하다.'),
  bullet('Google 키는 HTTP 리퍼러 제한과 API 제한(Maps JavaScript · YouTube Data v3)을 건다.'),
  bullet('2026-09-24 이전 커밋에는 키가 화면 파일에 하드코딩되어 있었으므로, 이력에 남은 키는 재발급(회전)한다.'),
  h2('6.3 데이터 갱신'),
  bullet('장소 추가 · 수정은 각 화면의 DATA 와 assets/tour-places.csv 에 반영하고 좌표 근거(srcKo/srcEn)를 적는다.'),
  bullet('테마 추천 계산을 바꾸면 python run_all.py 로 data/derived/ 를 다시 만들고 결과 JSON 을 함께 커밋한다.'),
  bullet('외래관광객조사 원자료(SAV)는 재배포 제한이 있어 data/raw/ 에만 두고 커밋하지 않는다.'),

  // 7 제약 위험
  h1('7. 제약 및 위험'),
  table(['구분', '내용', '대응'], [
    ['CORS', '한국공항공사 노선 · 시간표, 실시간 도로 소요 시간은 브라우저에서 직접 호출할 수 없다.', 'Cloudflare Workers 또는 Vercel Function 프록시 1개 배치 (ROADMAP)'],
    ['키 노출', '브라우저 앱이므로 config.js 의 키는 사용자에게 보인다.', '리퍼러 · API 제한으로 남용 범위를 줄이고, 이력에 남은 옛 키는 회전'],
    ['CDN 의존', 'React · Babel 을 unpkg 에서 받는다. 차단되면 화면이 뜨지 않는다.', '필요 시 저장소에 복사본을 두고 support.js 로더 주소를 바꾼다'],
    ['화면 간 중복', '테마 화면 5종이 구조와 로직 대부분을 공유한다. 수정 시 5곳을 같이 고쳐야 한다.', '화면 런타임 공용 파일로 추출 (향후)'],
    ['재내보내기', 'Claude Design 내보내기본은 공통 코드와 키를 화면 안에 다시 넣는다. GitHub 웹으로 zip 을 올리면 main 에 중복본이 남는다.', '내보내기본을 세션에 첨부해 통합 스크립트로 반영 (4.5 절)'],
    ['다국어 공백', '프랑스어는 플래너에서 68개 라벨이 영어로 대체되어 있고 테마 화면은 미지원.', 'I18N-TODO 목록 순차 처리'],
  ], [1500, 4338, 3800]),

  // 8 향후 계획
  h1('8. 향후 계획'),
  table(['항목', '내용', '구성도 위치'], [
    ['CORS 프록시', 'Workers/Function 배치 후 항공 요약과 도로 ETA 를 실시간으로 전환', '외부 서비스 · 점선 상자'],
    ['테마 추천 통일', '홈 [테마 추천] 화면은 자체 점수표로 여행자 유형을 판정한다. 테마 추천 알고리즘의 derived JSON(군집 10개 · 테마 적합 점수)과 문항 · 군집 · 점수표를 하나로 맞춘다', '파이프라인 → 홈 (점선)'],
    ['화면 런타임 공용화', '테마 화면 5종의 공통 템플릿 · 로직을 별도 파일로 추출', '정적 웹 앱'],
    ['데이터', '한국관광 100선 잔여 12곳 좌표 매칭, 공사 DB 미등록 장소 다국어 표기, 사진 출처 검수', 'assets/'],
    ['교통', '대구 · 광주 · 대전 도시철도 추가', '화면 안 처리 흐름'],
    ['화면', '코스 결과 인쇄 / PDF 저장, 저장 코스 공유 링크', '화면 7개'],
    ['군집 정의', 'C7·C8(활동 규칙)과 C9·C10(k-평균)을 LCA 하나로 통일, C10 세분화 검토', '파이프라인'],
  ], [2000, 5438, 2200]),
];

const doc = new Document({
  creator: 'Tour Navigator',
  title: 'Tour Navigator App 시스템 구성 명세서 (초안)',
  styles: {
    default: { document: { run: { font: FONT, size: 20 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 30, bold: true, color: INK }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, color: INK }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 240 } } } }] },
      ...['flowLoad', 'flowCourse'].map(ref => ({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 300 } } } }] })),
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run('Tour Navigator App · 시스템 구성 명세서 (v1.0)', { size: 16, color: '3C5658' })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: '3C5658' })] })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(HERE, '시스템_구성_명세서.docx');
  fs.writeFileSync(out, buf);
  console.log('wrote', out, buf.length, 'bytes');
});
