# 데이터 (Data)

## 규모

| 항목 | 수 |
| --- | --- |
| 장소 | 1,197 |
| 도시 | 110여 |
| 테마 코스 | 5 |
| 한국관광 100선 배지 | 88 (매핑 완료분) |
| 열린관광지(무장애) 배지 | 99 |

## 원본 파일

| 파일 | 내용 |
| --- | --- |
| `assets/tour-places.csv` | 프로젝트 장소 마스터 (좌표 · 카테고리 · 근거) |
| `assets/open-tour.csv` | 열린관광지 목록 |
| `assets/open-tour-unmatched.csv` | 좌표 매칭이 안 된 열린관광지 잔여분 |
| `assets/story-db.csv` | 한국관광공사 스토리텔링 원본 |
| `assets/story-matched.json` | 스토리텔링 ↔ 장소 매칭 결과 |

## 장소 레코드

```js
{
  name:   "불국사",
  nameEn: "Bulguksa Temple",
  lat: 35.7901, lng: 129.3320,   // WGS84
  cat:  "heritage",
  hours: "09:00–18:00",
  fee:   "6,000원",
  photo: "https://upload.wikimedia.org/...",
  srcKo: "문화재청 국가유산포털",
  srcEn: "Wikipedia (Bulguksa)",
  unesco: true, top100: true, barrierFree: false
}
```

## 좌표 근거

주소 기반 지오코딩과 위키백과 등재 좌표를 사용했고, 장소마다 `srcKo` / `srcEn` 에 출처를 남겼습니다. 상세 패널에서 그대로 노출됩니다.

## 배지 기준

- **유네스코** — 세계유산 등재 목록
- **🏅 한국관광 100선** — 한국관광공사 선정 목록, 좌표 매칭으로 부여
- **♿ 열린관광지** — 무장애 관광지 목록, 좌표 매칭으로 부여

## 사진

위키미디어 커먼즈의 자유 이용 이미지, 그리고 한국관광공사 TourAPI 사진 서비스. 공사 사진은 API 키가 있을 때만 로드됩니다.

## 알려진 공백

- 한국관광 100선 12곳은 아직 좌표 매칭 전
- 공사 DB에 없는 장소는 다국어 표기가 영어 → 한국어로 대체됨
- 실시간 도로 소요 시간은 프록시 미설정 상태 (자세한 내용은 `APIS.md`)
