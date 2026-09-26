# 구조 (Architecture)

## 파일 단위

빌드 과정이 없습니다. 각 화면은 Design Component 한 파일(`.dc.html`)이고, 같은 폴더의 `support.js` 가 런타임입니다.

```
Tour Navigator Home.dc.html     홈 · 배너 · 테마 진입 · 테마 추천 · ME
Tour Planner.dc.html            전국 통합 플래너 (가장 큼)
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
```

## 한 화면의 내부

```
<helmet>        폰트 · shared.css 링크 · 화면 고유 @keyframes · 외부 스크립트(Google Maps)
템플릿           인라인 스타일 마크업, {{ }} 값 홀, <sc-for> / <sc-if>
class Component extends DCLogic
  state         선택 도시 · 날짜 · 언어 · 필터 · 경로 결과
  renderVals()  템플릿에 넘길 평면 값 · 핸들러
```

## 플래너 데이터 모델

| 상수 | 내용 |
| --- | --- |
| `DATA` | 지역 → 도시 → 장소 배열. 장소마다 좌표, 카테고리, 운영시간, 요금, 사진, 근거(`srcKo`/`srcEn`), 배지 플래그 |
| `REGION_HUB` | 지역별 광역 관문 (KTX역 · 공항 · 터미널 · 항구) |
| `ORIGINS` | 출발지 후보 |
| `TRANSIT` | 관문 간 이동 수단 · 소요 시간 · 예매 링크 |
| `METRO` | 도시철도 노선·역, 수도권 전철권 17개 도시 간 경로 |
| `STAYS` | 동선 25km 내 숙소 후보 |
| `I18N` | 언어별 레이블 레이어 |

## 코스 계산 흐름

1. 날짜 범위 → 일수 산출 (하루 9~12시간 예산)
2. 선택 장소를 도시 단위로 묶고, 도시 간은 `REGION_HUB` / `TRANSIT` 로 연결
3. 도시 내부는 좌표 기준 최근접 순회로 정렬, 체류 시간 가산
4. 수도권 전철권이면 `METRO` 기반 경로와 출발역 선택으로 대체
5. 일자별로 잘라 카드로 렌더, 각 구간에 이동 수단·시간·예매 버튼 부착

## 언어 처리

표기는 다음 순서로 떨어집니다.

```
선택 언어의 한국관광공사 DB 표기
  → 영어 DB 표기
    → 프로젝트 내장 한국어 표기
```

좌표 기준으로 공사 DB를 조회하므로, 장소명이 달라도 같은 지점이면 공식 표기를 씁니다.
