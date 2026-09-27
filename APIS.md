# 외부 API

## 사용 중

| 서비스 | 용도 | 상태 |
| --- | --- | --- |
| Google Maps JavaScript API | 지도 · 마커 · 클러스터 | 키 필요 |
| 한국관광공사 TourAPI (국문) | 장소 정보 · 운영시간 · 요금 | 연동 |
| 한국관광공사 TourAPI (영 · 중 · 일 · 서) | 다국어 공식 표기 | 연동 |
| 한국관광공사 사진 서비스 | 장소 사진 | 연동 |
| 한국관광공사 오디오 가이드 | 음성 해설 | 연동 |
| 한국관광공사 스토리텔링 | 장소 서사 | 연동 (장소 상세에서 좌표 기준 조회) |
| 한국관광공사 축제·행사 (searchFestival2) | 여행 기간에 열리는 행사 (플래너 코스 탭) | 연동 · 같은 서비스키 |
| 한국관광공사 연관 관광지 (TarRlteTarService1) | 장소 상세 "함께 많이 가는 관광지" (시군구 코드 필수 · Kakao 좌표→행정구역으로 산출) | 연동 · 같은 서비스키 |
| 한국관광공사 관광지 집중률 (TatsCnctrRateService) | 방문자 추이 예측 (플래너) | 연동 · 같은 서비스키 |
| 국토교통부 TAGO (1613000 · TrainInfo · SubwayInfo · ExpBusInfo) | 열차 · 지하철 · 고속버스 시각표 (광역 이동 체인) | 연동 · 같은 서비스키 |
| 한국공항공사 공항 소요시간 (B551178) | 김포 · 제주 · 김해 · 청주 · 대구 수속 소요시간 → 공항 도착 여유 계산 | 연동 · 같은 서비스키 |
| 부산광역시 부산테마여행정보 (6260000) | 도보여행 · 이색여행 241곳, 한 · 영 · 중 · 일 (플래너 · 부산 화면) | 연동 · 같은 서비스키 |
| 부산교통공사 열차시각표 (B551542) | 부산도시철도 시각표 | 연동 · 같은 서비스키 |
| 카카오모빌리티 길찾기 (apis-navi) | 자동차 실제 소요시간 · 거리 · 택시 요금 · 통행료 | 연동 · Kakao REST 키 |
| 서울열린데이터광장 지하철 실시간 도착 | 수도권 역 실시간 도착 (샘플 키 URL, 하루 호출 제한) | 연동 · 키 없음 |
| 기상청 단기예보 | 오늘·내일 최고기온 · 강수 · 하늘 (Open-Meteo 값을 덮어씀) | 연동 · 공공데이터포털 활용신청 필요 |
| 한국환경공단 에어코리아 (`ArpltnInforInqireSvc`) | 시도별 미세먼지 PM10 · PM2.5 · 등급 | 연동 · 공공데이터포털 활용신청 필요 |
| TMDB | 테마 화면 작품 정보 (포스터 · 줄거리 · 평점) | 연동 · 키 필요 |
| 관광안내소 · 시티투어 (정적 JSON) | 플래너 여행 정보 탭의 관광안내소 725곳 · 시티투어 280코스 | 호출 없음 · 한국관광공사 공개 자료를 `data/` 에 담아 둠 (좌표는 Kakao 로 보정) |
| 제주 브랜드 콘텐츠 이미지 (`api.brandcontents.or.kr`) | 플래너 · 제주 화면의 장소 사진 (620곳) | 연동 · 키 없음 · **HTTP 주소** — HTTPS 로 배포하면 브라우저가 차단 |
| 한국도로공사 | 휴게소 목록 (`exRoad` 키) | 연동 |
| 한국공항공사 국내선 운항 | 국내선 편성 | `KAC_ENDPOINT` 미설정 — 제주 · 부산 편성 요약을 하드코딩. 공공데이터포털 GW 요청주소를 넣으면 실시간 |

## 키 설정

키는 `config.js` 한 파일에서만 읽습니다. `config.example.js` 를 복사해 만들고, `.gitignore` 에 올라 있어 커밋되지 않습니다.

| `config.js` 항목 | 쓰는 곳 |
| --- | --- |
| `googleMaps` | Google Maps JavaScript API 로더 |
| `youtube` | YouTube Data API v3 (영상 조회수 · 게시일) |
| `kakao` | Kakao REST (로컬 검색 · 좌표→행정구역 · 카카오모빌리티 길찾기) |
| `dataGoKr` | 공공데이터포털 서비스키 — 한국관광공사 TourAPI(장소 · 축제 · 연관 관광지 · 집중률) · 기상청 단기예보 · 에어코리아 · 국토부 TAGO · 한국공항공사 · 부산시 · 부산교통공사 공용. 마이페이지에서 각 서비스를 활용신청해야 같은 키로 호출된다 |
| `exRoad` | 한국도로공사 공공데이터 (휴게소 목록) |
| `tmdb` | TMDB API v3 — 테마 화면 작품 정보 카드 |

### 키 발급

| 항목 | 발급처 | 할 일 |
| --- | --- | --- |
| `googleMaps` · `youtube` | [Google Cloud 콘솔](https://console.cloud.google.com/apis/credentials) | Maps JavaScript API · YouTube Data API v3 사용 설정 → API 키 생성 → HTTP 리퍼러를 배포 도메인으로 제한 |
| `kakao` | [Kakao Developers](https://developers.kakao.com/console/app) | 앱 생성 → REST API 키 복사 → 플랫폼에 사이트 도메인 등록. 카카오모빌리티 길찾기도 같은 키 |
| `dataGoKr` | [공공데이터포털](https://www.data.go.kr) | 마이페이지 → 일반 인증키(Decoding). 아래 서비스를 각각 활용신청 |
| `exRoad` | [한국도로공사 공공데이터](https://data.ex.co.kr) | 회원가입 → 인증키 신청 |
| `tmdb` | [TMDB 설정](https://www.themoviedb.org/settings/api) | API 키(v3) 신청 |

공공데이터포털에서 활용신청할 서비스는 다음과 같습니다. 신청하지 않은 서비스는 같은 키로도 오류가 나고 해당 기능만 비어 보입니다.

- 한국관광공사: 국문 · 영문 · 중문 · 일문 · 서문 관광정보(`KorService2` 등), 관광사진 정보, 오디오 가이드(Odii), 관광지별 연관 관광지(`TarRlteTarService1`), 관광지 집중률 방문자 추이 예측(`TatsCnctrRateService`)
- 기상청 단기예보(`VilageFcstInfoService_2.0`), 한국환경공단 에어코리아 대기오염정보(`ArpltnInforInqireSvc`)
- 국토교통부 TAGO 열차 · 지하철 · 고속버스 정보, 한국공항공사 공항 소요시간, 한국공항공사 국내선 운항(선택)
- 부산광역시 부산테마여행정보, 부산교통공사 열차시각표

키는 `config.js` 에만 적습니다. 화면 파일 · 문서 · 커밋 메시지 · 채팅에 적지 않습니다. 2026-09-24 이전 커밋에는 키가 화면에 하드코딩되어 있었으므로, 그때 쓰던 키는 재발급합니다.

`shared.js` 가 이 값을 `GMAPS_KEY` · `YT_KEY` · `KAKAO_KEY` · `DATA_GO_KR_KEY` · `EXROAD_KEY` · `TMDB_KEY` 로 읽어 각 화면에 넘깁니다. 키가 비어 있으면 해당 기능만 조용히 비활성화되고 나머지는 정상 동작합니다.

## CORS 제약

브라우저에서 직접 호출할 수 없는 것들입니다.

1. **한국공항공사 구 주소(openapi.airport.co.kr)** — CORS 헤더가 없습니다. 공공데이터포털 GW 요청주소(`apis.data.go.kr/B551177/…`)는 호출되므로, 그 주소를 플래너의 `KAC_ENDPOINT` 에 넣으면 제주 · 부산 편성 요약(하드코딩)이 실시간으로 바뀝니다.
2. **국가유산청 국가유산 정보 · KOBIS 영화 상세** — 프록시 배치 후 연결 (ROADMAP).

자동차 소요 시간은 카카오모빌리티 길찾기로 실측하며, 키가 없을 때만 거리 기반 추정치 + 휴게 시간 가산을 씁니다.

해결하려면 Cloudflare Workers 또는 Vercel Function 한 개를 프록시로 두면 됩니다.

```js
// worker.js
export default {
  async fetch(req) {
    const target = new URL(req.url).searchParams.get("u");
    const res = await fetch(target);
    return new Response(res.body, {
      headers: { ...Object.fromEntries(res.headers), "Access-Control-Allow-Origin": "*" }
    });
  }
};
```

프록시 주소를 읽는 코드는 아직 없습니다 (ROADMAP 참고). 배치 후 `config.js` 에 항목을 추가하고 해당 호출을 프록시 경유로 바꾸면 됩니다.

## 호출량 관리

- 공사 DB는 화면 진입 시 최대 120건까지 선인출(prefetch)하고, 나머지는 장소 상세를 열 때 요청합니다.
- 영상 채널은 지연 로드하며, 플래너에서는 조회수 등 통계를 부르지 않습니다.
- 기상청 예보는 격자별 1시간, 에어코리아는 30분, 카카오모빌리티는 구간별, TMDB 는 7일 캐시. 연관 관광지는 시군구 · 검색어별로 캐시합니다.
- 서울 지하철 실시간 도착은 샘플 키 URL 이라 하루 호출 제한이 있습니다.
- 공공데이터포털 개발계정은 서비스마다 하루 호출 한도(보통 1,000~10,000건)가 있습니다. 운영 배포 전에 운영계정으로 전환합니다.

## 오류가 날 때

| 증상 | 원인 | 확인 |
| --- | --- | --- |
| 지도에 "Google 지도를 제대로 로드할 수 없습니다" | `googleMaps` 키가 없거나 리퍼러 제한에 현재 도메인이 없음 | 콘솔의 `InvalidKey` · `RefererNotAllowedMapError` |
| 날씨 · 미세먼지 · 행사 · 연관 관광지가 비어 있음 | `dataGoKr` 없음, 또는 해당 서비스 미신청 | 네트워크 탭의 `apis.data.go.kr` 응답 `resultCode` |
| 택시 요금 · 자동차 시간이 추정값(≈) | `kakao` 키 없음 또는 도메인 미등록 | `apis-navi.kakaomobility.com` 401 |
| 작품 카드가 안 보임 | `tmdb` 없음 | `api.themoviedb.org` 401 |
| 파일을 더블클릭해 열었더니 API 가 전부 실패 | `file://` 에서는 CORS 가 막힘 | `python3 -m http.server` 로 열기 |
