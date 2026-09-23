# 스타일 (CSS)

저장소에는 별도의 CSS 빌드가 없습니다. 스타일은 세 층으로 나뉩니다.

| 층 | 위치 | 내용 |
| --- | --- | --- |
| 공통 | `shared.css` | 7개 화면이 함께 쓰는 리셋 · 폰트 · 링크 색 · 포커스 · Leaflet · 스크롤바 · 공용 애니메이션 |
| 화면 고유 | 각 `.dc.html` 의 `<helmet>` 안 `<style>` | 그 화면에서만 쓰는 `@keyframes` |
| 컴포넌트 | 각 `.dc.html` 템플릿의 `style=""` 속성 | 레이아웃 · 색 · 간격 등 실제 디자인 대부분 |

## shared.css

각 화면은 `<helmet>` 안에서 다음 한 줄로 불러옵니다. `support.js` 가 `<helmet>` 의 `<link>` 를 `<head>` 로 옮겨 적용합니다.

```html
<link rel="stylesheet" href="shared.css">
```

파일 안의 구역은 다음과 같습니다.

- **기본** — `html,body` 배경 `#cdc4b0` · 글꼴 Archivo + Gowun Dodum · 글자색 `#153b3d`, `box-sizing:border-box`, 링크 색 `#b8431c`, `button` 글꼴 상속, `:focus-visible` 외곽선, `::selection`, 이모지 렌더링
- **Leaflet 지도** — 지도 바탕색, 저작권 표기 크기, 확대/축소 버튼 숨김
- **수평 스크롤** `.rs-xbar` — 카테고리 칩 줄. 얇은 주황색 스크롤바
- **수직 스크롤** `.rs-scroll` — 목록 · 영상 패널. 얇은 주황색 스크롤바
- **애니메이션** — `rsUp` (아래에서 떠오르기), 책갈피 드롭다운 `.rs-bkw` / `.rs-bk` / `.rs-bk-open`

색 값은 [DESIGN.md](DESIGN.md) 의 팔레트를 따릅니다.

## 화면 고유 `<style>`

| 화면 | 남아 있는 규칙 |
| --- | --- |
| `Tour Navigator Home.dc.html` | `rsFloat` · `rsHour` · `rsMin` · `rsSplashOut` · `rsProgress` (스플래시 · 배너) |
| `Tour Planner.dc.html` | `tpHour` · `tpMin` · `tpOut` (로딩 시계) |
| Route 5종 | 없음 (`shared.css` 만 사용) |

## 규칙

- 두 화면 이상에서 쓰는 규칙은 `shared.css` 로 올립니다. 한 화면에서만 쓰는 `@keyframes` 는 그 화면의 `<style>` 에 둡니다.
- 공통 클래스는 `rs-` 접두사, Tour Planner 고유 애니메이션은 `tp` 접두사를 씁니다.
- 새 클래스를 만들 때는 [DESIGN.md](DESIGN.md) 의 색 · 라운드 0px · 2px 괘선 규칙을 지킵니다.
- 배포본을 한 파일로 묶을 때는 `shared.css` 내용을 `<style>` 로 인라인해야 합니다.

## 이력

- 2026-09-23 — 7개 화면에 중복돼 있던 `<style>` 블록을 `shared.css` 로 추출. 홈 화면의 짝이 맞지 않던 `}` 와 저장소에 없는 `_ds/…/styles.css` · `_ds_bundle.js` 참조(404)를 제거.
