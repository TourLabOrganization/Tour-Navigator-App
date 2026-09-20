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
| 한국도로공사 | 공사 구간 정보 | 연동 |
| 한국공항공사 | 국내선 노선 · 시간표 | **CORS 차단** — 요약 정보를 하드코딩 |

## 키 설정

키는 각 `.dc.html` 상단 상수에 들어갑니다. 저장소에 올릴 때는 본인 키로 교체하세요.

```js
const GOOGLE_MAPS_KEY = "...";
const KTO_KEY         = "...";   // 한국관광공사 (5개 언어 서비스 공통)
const ROAD_KEY        = "...";   // 한국도로공사
```

키가 비어 있으면 해당 기능만 조용히 비활성화되고 나머지는 정상 동작합니다.

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

앱에서는 `PROXY` 상수에 워커 주소를 넣으면 됩니다.

## 호출량 관리

- 공사 DB는 화면 진입 시 최대 120건까지 선인출(prefetch)하고, 나머지는 장소 상세를 열 때 요청합니다.
- 영상 채널은 지연 로드하며, 플래너에서는 조회수 등 통계를 부르지 않습니다.
