# Tour Navigator App

영상 속 장소를 따라 걷는 여행 계획 앱. 홈 화면 하나에서 다섯 개 테마와 통합 플래너로 들어갑니다.

## 메인 화면

<img src="assets/screenshots/home.png" alt="Tour Navigator 홈 화면 — 배너, 나의 테마 타일, 지금 인기 코스" width="320">

`Tour Navigator Home.dc.html` 을 브라우저에서 연 모습입니다. 390×844 프레임 기준.

위에서부터 네 덩어리로 읽힙니다.

**1. 헤더** — `TOUR NAVIGATOR` 워드마크, 검색, 알림(읽지 않은 개수 배지). 바로 아래 **내 테마 / 투어 플래너** 두 탭이 붙어 있고, 선택된 탭은 주황 `#b8431c` 로 반전됩니다.

**2. 배너** — 5장이 자동 회전합니다. 각 장은 테마 라벨(`RESCENE ROUTE`), 두 줄 헤드라인, 한 줄 설명, `1 / 5` 카운터, 하단 진행 막대로 구성됩니다. 탭하면 해당 테마 화면으로 들어갑니다.

**3. 나의 테마** — 2열 타일. RESCENE Route · 왕과 사는 남자 · 케데헌 서울 · 제주 K-Drama · 부산 영화 기행, 그리고 마지막 칸은 **테마 추가**(`+`) 자리입니다. 섹션 헤더 오른쪽의 `+` 도 같은 동작입니다.

**4. 지금 인기 코스** — 가로 스크롤 카드. 카드마다 분류 라벨(`UNESCO`, `COAST`), 코스 이름과 일정(`경주 2박 3일`), 촬영지 수와 주 이동수단(`촬영지 9곳 · KTX`)이 적힙니다.

**하단 탭** — HOME / ALERT / ME. 선택된 탭만 주황으로 채워집니다.

색·타이포·괘선은 [DESIGN.md](DESIGN.md) 의 Modernist 시스템을 그대로 따릅니다. 화면 전환은 페이지 이동 없이 같은 문서 안에서 일어납니다.

## 화면

| 화면 | 파일 | 내용 |
| --- | --- | --- |
| 홈 | `Tour Navigator Home.dc.html` | 자동 회전 배너 5장, 테마 타일, 인앱 전환 |
| 투어 플래너 | `Tour Planner.dc.html` | 전 테마 장소 299곳 통합, 도시 클러스터, 코스 계산 |
| RESCENE Route | `RESCENE Route.dc.html` | 경주·거제·전국 |
| 왕과 사는 남자 | `Kings Warden Route.dc.html` | 영월 |
| 케이팝 데몬 헌터스 | `KPop Demon Hunters Route.dc.html` | 서울 |
| 제주 K-Drama | `Jeju K-Drama Route.dc.html` | 제주 |
| 부산 영화 기행 | `Busan Cinema Route.dc.html` | 부산 |

## 기능

- **지도** — Google Maps, 카테고리 필터, 도시 단위 클러스터, 장소 상세(좌표 근거·운영시간·요금·사진)
- **코스** — 날짜 범위 선택(n박 m일), 출발지·도착지 지정, 하루 9~12시간 예산으로 동선 자동 생성, 이동 시간·거리 계산
- **교통** — KTX·SRT·고속버스·렌터카·항공(제주). 지역별 광역 관문에 따라 예매 버튼이 바뀜
- **숙박** — 동선 기준 25km 내 숙소 추천, 날짜가 채워진 예약 링크
- **다국어** — 한국어·English·中文·日本語·Español
- **유네스코** — 세계유산 등재 장소에 아이콘 표시

## 문서

| 문서 | 내용 |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 파일 구성, 화면 내부 구조, 플래너 데이터 모델, 코스 계산 흐름 |
| [DATA.md](DATA.md) | 장소 데이터 규모 · 원본 파일 · 레코드 형식 · 배지 기준 |
| [APIS.md](APIS.md) | 외부 API 목록, 키 설정, CORS 제약 |
| [DESIGN.md](DESIGN.md) · [STYLES.md](STYLES.md) | Modernist 디자인 규칙과 CSS 구성 |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 실행 방법, 키 설정, 코드 규칙 |
| [ROADMAP.md](ROADMAP.md) · [CHANGELOG.md](CHANGELOG.md) | 남은 일과 변경 기록 |
| [테마 추천 알고리즘/README.md](테마%20추천%20알고리즘/README.md) | 선호 문항 → 군집 → 추천 테마 계산 (Python) |
