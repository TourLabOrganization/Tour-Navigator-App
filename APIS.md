# 외부 API

## 사용 중

| 서비스 | 용도 | 상태 |
| --- | --- | --- |
| Google Maps JavaScript API | 지도 · 마커 · 클러스터 | 키 필요 |
| 한국관광공사 TourAPI (국문) | 장소 정보 · 운영시간 · 요금 | 연동 |
| 한국관광공사 TourAPI (영 · 중 · 일 · 서) | 다국어 공식 표기 | 연동 |
| 한국관광공사 사진 서비스 | 장소 사진 | 연동 |
| 한국관광공사 오디오 가이드 | 음성 해설 | 연동 |
| 한국관광공사 스토리텔링 | 장소 서사 | 연동 (`assets/story-matched.json` 로 사전 매칭) |
| 한국관광공사 축제·행사 (searchFestival2) | 여행 기간에 열리는 행사 (플래너 코스 탭) | 연동 · 같은 서비스키 |
| 한국관광공사 연관 관광지 (TarRlteTarService1) | 장소 상세 "함께 많이 가는 관광지" (시군구 코드 필수 · Kakao 좌표→행정구역으로 산출) | 연동 · 같은 서비스키 |
| 기상청 단기예보 | 오늘·내일 최고기온 · 강수 · 하늘 (Open-Meteo 값을 덮어씀) | 연동 · 공공데이터포털 활용신청 필요 |
| 한국환경공단 에어코리아 (`ArpltnInforInqireSvc`) | 시도별 미세먼지 PM10 · PM2.5 · 등급 | 연동 · 공공데이터포털 활용신청 필요 |
| TMDB | 테마 화면 작품 정보 (포스터 · 줄거리 · 평점) | 연동 · 키 필요 |
| 한국도로공사 | 공사 구간 정보 | 연동 |
| 한국공항공사 | 국내선 노선 · 시간표 | **CORS 차단** — 요약 정보를 하드코딩 |

## 키 설정

키는 `config.js` 한 파일에서만 읽습니다. `config.example.js` 를 복사해 만들고, `.gitignore` 에 올라 있어 커밋되지 않습니다.

| `config.js` 항목 | 쓰는 곳 |
| --- | --- |
| `googleMaps` | Google Maps JavaScript API 로더 |
| `youtube` | YouTube Data API v3 (영상 조회수 · 게시일) |
| `kakao` | Kakao REST (로컬 검색) |
| `dataGoKr` | 공공데이터포털 서비스키 — 한국관광공사 TourAPI(장소 · 축제) · 기상청 단기예보 · 에어코리아 · 한국공항공사 공용. 마이페이지에서 각 서비스를 활용신청해야 같은 키로 호출된다 |
| `exRoad` | 한국도로공사 공공데이터 (휴게소 목록) |
| `tmdb` | TMDB API v3 — 테마 화면 작품 정보 카드 |

`shared.js` 가 이 값을 `GMAPS_KEY` · `YT_KEY` · `KAKAO_KEY` · `DATA_GO_KR_KEY` · `EXROAD_KEY` · `TMDB_KEY` 로 읽어 각 화면에 넘깁니다. 키가 비어 있으면 해당 기능만 조용히 비활성화되고 나머지는 정상 동작합니다.

## CORS 제약

브라우저에서 직접 호출할 수 없는 두 가지가 있습니다.

1. **한국공항공사 노선·시간표** — 현재 제주·부산 항공 요약은 하드코딩. API 슬롯은 열어 두어, 프록시가 붙으면 그대로 실시간 전환됩니다.
2. **실시간 도로 소요 시간(ETA)** — 현재는 거리 기반 추정치 + 휴게 시간 가산.

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

프록시 주소를 읽는 코드는 아직 없습니다 (ROADMAP 참고). 배치 후 `config.js` 에 항목을 추가하고 두 호출을 프록시 경유로 바꾸면 됩니다.

## 호출량 관리

- 공사 DB는 화면 진입 시 최대 120건까지 선인출(prefetch)하고, 나머지는 장소 상세를 열 때 요청합니다.
- 영상 채널은 지연 로드하며, 플래너에서는 조회수 등 통계를 부르지 않습니다.
