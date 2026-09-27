# 구조 (Architecture)

## 파일 단위

빌드 과정이 없습니다. 각 화면은 Design Component 한 파일(`.dc.html`)이고, 같은 폴더의 `support.js` 가 런타임입니다.

```
Tour Navigator Home.dc.html     홈 · 배너 · 테마 진입 · 테마 추천 · ME
Tour Planner.dc.html            전국 통합 플래너 (9,496줄 · 2.0MB, 장소 데이터 포함)
RESCENE Route.dc.html           테마 5종
Kings Warden Route.dc.html
KPop Demon Hunters Route.dc.html
Jeju K-Drama Route.dc.html
Busan Cinema Route.dc.html
support.js                      런타임 (템플릿 + 로직 클래스 실행)
config.js                       API 키 (config.example.js 를 복사해 만듦 · git 제외)
shared.js                       플래너 + 테마 5종 공용 상수 · 순수 함수 · 키 읽기
shared.css                      7개 화면 공통 스타일 (리셋 · 스크롤바 · Leaflet · 공용 애니메이션)
image-slot.js                   이미지 슬롯 웹 컴포넌트
assets/                         원본 데이터 · 이미지
테마 추천 알고리즘/              선호 문항 → 군집 → 추천 테마 계산 코드 · 근거 데이터 · 설계 문서 (Python)
체류시간 산정/                  체류 · 일정 시간 산정 로직 모듈, 장소별 체류 CSV, 설명서
시스템 구성도/                  시스템 구성도 PNG · 구성 명세서 docx · 생성 스크립트
```

## 한 화면의 내부

```
<helmet>        폰트 · shared.css 링크 · 화면 고유 @keyframes · 외부 스크립트(Google Maps)
템플릿           인라인 스타일 마크업, {{ }} 값 홀, <sc-for> / <sc-if>
class Component extends DCLogic
  state         선택 도시 · 날짜 · 언어 · 필터 · 경로 결과
  renderVals()  템플릿에 넘길 평면 값 · 핸들러
```

## 로드 순서와 런타임

각 화면의 `<head>` 는 다음 순서로 스크립트를 읽습니다. 순서가 바뀌면 `shared.js` 가 키를 못 읽거나 화면 로직이 공용 함수를 못 찾습니다.

```
support.js   →  config.js (window.APP_CONFIG)  →  shared.js (키 상수 · 공용 함수)
```

`support.js` 가 하는 일은 네 가지입니다.

1. unpkg CDN 에서 React 18.3.1 · ReactDOM 18.3.1 · Babel standalone 7.29.0 을 받습니다.
2. `<x-dc>` 안의 템플릿을 React 컴포넌트로 컴파일합니다. `{{ }}` 는 값 홀, `<sc-for>` · `<sc-if>` 는 반복 · 조건입니다.
3. `<helmet>` 안의 `<link>` · `<style>` · `<meta>` 를 문서 `<head>` 로 옮깁니다. `shared.css` 가 이 경로로 적용됩니다.
4. `data-dc-script` 블록의 `class Component extends DCLogic` 을 `new Function` 으로 실행합니다. 이 함수의 스코프는 전역이라 `shared.js` 의 상수 · 함수를 그대로 부를 수 있습니다.

unpkg 가 막히면 화면이 뜨지 않습니다. 오프라인 배포가 필요하면 세 파일을 저장소에 두고 `support.js` 의 주소를 바꿉니다.

## shared.js

플래너와 테마 5종이 함께 쓰는 것만 둡니다. 홈은 키만 읽습니다.

| 구분 | 이름 | 내용 |
| --- | --- | --- |
| 키 | `GMAPS_KEY` · `YT_KEY` · `KAKAO_KEY` · `DATA_GO_KR_KEY` · `EXROAD_KEY` · `TMDB_KEY` | `config.js` 의 6개 항목. 비어 있으면 `''` |
| 표시 | `PALETTE` · `ACCENTS` · `MAP_SKINS` · `CAT_COLORS` · `CAT_SHORT` · `CATS_ES` · `CAL_MONTH` · `CAL_WD` · `OFFL` | 색 · 지도 스킨 · 분류 라벨 · 달력 문자열 |
| 유틸 | `cityName` · `vNum` · `vDate` · `stayPrice` · `stayQuery` · `hav` | 도시명 · 숫자 · 날짜 파싱, 숙소 가격대 · 검색어, 대권거리(km) |
| 날씨 | `getWeather` → `_openMeteo` + `getKmaForecast` (`kmaGrid` · `kmaBase`) | Open-Meteo 로 어제 · 오늘 · 내일을 받고, 기상청 단기예보가 있으면 오늘 · 내일을 덮어씀. 격자별 1시간 캐시 |
| 미세먼지 | `getAirQuality` (`nearestSido` · `AIR_LABEL` · `AIR_COLOR`) | 좌표 → 가장 가까운 시도 → 에어코리아 시도별 값. 4단계 등급 |
| 행사 | `getFestivals` | 기간 · 반경(기본 30km) 안의 한국관광공사 행사, 거리순 최대 12건 |
| 작품 | `getTitleMeta` | TMDB 검색 → 포스터 · 연도 · 평점 · 줄거리. 7일 캐시 |
| 연관 관광지 | `getRelatedSpots` (`getSignguCd` · `SIGNGU_FALLBACK` · `SIDO_AREA_CD`) | Kakao 좌표 → 시군구 코드, 없으면 예비 표. 2~4개월 전 기준월 순으로 조회해 상위 8곳 |

## 브라우저 저장소

서버가 없으므로 사용자 상태는 `localStorage` 에 둡니다. 기기와 브라우저를 바꾸면 따라가지 않습니다.

| 키 | 내용 |
| --- | --- |
| `dc_plans:<화면>` | 내 플랜 (이름 붙여 저장한 코스) |
| `tn_theme_rec_v3` | 홈 테마 추천 응답과 결과 |
| `tp_trip_leg` · `rs_trip_leg` | 광역 이동 선택 (플래너 · 테마 화면) |
| `tp_rentcar` · `rs_rentcar` | 현지 이동 수단 선택 |
| `tp_custom_origins` | 사용자가 추가한 출발지 |
| `tp_metro_user_v1` | 이름 검색으로 추가한 지하철역 |
| `tago_bus_v1` · `tago_sttn_v1` · `tago_sub_v1` | TAGO 시각표 · 역 코드 캐시 |
| `tp_ytstats` · `rs_ytstats` | YouTube 조회수 · 게시일 캐시 (하루 1회 갱신) |

저장 · 스탬프 · 선택 도시 같은 화면 상태도 같은 방식으로 남습니다. 초기화하려면 브라우저 개발자 도구에서 해당 사이트의 저장소를 지웁니다.

## 플래너 데이터 모델

| 상수 | 내용 |
| --- | --- |
| `DATA` | 지역 → 도시 → 장소 배열. 장소마다 좌표, 카테고리, 운영시간, 요금, 사진, 근거(`srcKo`/`srcEn`), 배지 플래그 |
| `REGION_HUB` | 지역별 광역 관문 (KTX역 · 공항 · 터미널 · 항구) |
| `ORIGINS` | 출발지 후보 |
| `TRANSIT` | 관문 간 이동 수단 · 소요 시간 · 예매 링크 |
| `METRO` | 도시철도 노선·역(수도권 165개 역 + 사용자가 검색으로 추가한 역은 기기에 저장), 수도권 전철권 17개 도시 간 경로 |
| `STAYS` | 동선 25km 내 숙소 후보 |
| `I18N` | 한국어 · 영어 원본 위에 얹는 언어별 레이블 레이어. 카테고리 · 버튼 · 안내문 |
| `GATEWAY` · `ORIGIN_ALT` | 광역 관문 좌표와 대체 출발지 |
| `JEJU_SCHED` · `BUSAN_SCHED` · `FERRY_ROUTES` | 항공 · 여객선 편성 요약 (하드코딩) |
| `VMETA` · `STORY_DB` | 영상 메타데이터, 스토리텔링 요약 |

필드와 수치는 [DATA.md](DATA.md) 에 있습니다.

## 코스 계산 흐름

1. 날짜 범위 → 일수 산출 (하루 9~12시간 예산)
2. 선택 장소를 도시 단위로 묶고, 도시 간은 `REGION_HUB` / `TRANSIT` 로 연결
3. 도시 내부는 좌표 기준 최근접 순회로 정렬, 체류 시간 가산. 자동차 구간은 카카오모빌리티 실측 시간, 없으면 직선거리 × 1.35 추정
4. 수도권 전철권이면 `METRO` 기반 경로와 호선 → 역 선택으로 대체. 광역 이동 체인은 TAGO 열차 · 고속버스 시각표와 공항 수속 소요시간을 반영
5. 일자별로 잘라 카드로 렌더, 각 구간에 이동 수단·시간·예매 버튼 부착

체류 시간 · 이동 추정식 · 일자 창 · 자동 코스의 실제 규칙과 식은 [체류시간 산정/README.md](체류시간%20산정/README.md) 와 그 안의 설명서에 있습니다.

## 언어 처리

표기는 다음 순서로 떨어집니다.

```
선택 언어의 한국관광공사 DB 표기
  → 영어 DB 표기
    → 프로젝트 내장 한국어 표기
```

좌표 기준으로 공사 DB를 조회하므로, 장소명이 달라도 같은 지점이면 공식 표기를 씁니다. 공사 DB에 프랑스어 서비스가 없어 플래너의 프랑스어는 UI 라벨만 번역되고 장소 정보는 영어로 나옵니다. 아직 영어로 남은 라벨은 [I18N-TODO.md](I18N-TODO.md) 에 있습니다.
