# 시스템 구성도

앱 전체의 구성 요소와 호출 관계를 그린 구성도와, 그 설명서입니다. 둘 다 스크립트로 다시 만듭니다.

| 파일 | 내용 |
| --- | --- |
| `시스템_구성도.png` | 구성도 (3200×2450). 정적 웹 앱 · 외부 서비스 · 테마 추천 파이프라인 · 설계/저장소/배포 4개 그룹 |
| `구성도.html` | 구성도 원본. 상자와 화살표를 JS 배열(`B`, `A`)로 적어 두었고 브라우저에서 바로 열립니다 |
| `render_png.mjs` | `구성도.html` → PNG. Playwright 로 헤드리스 Chromium 캡처, 글자 넘침 검사 포함 |
| `시스템_구성_명세서.docx` | 구성 명세서 (개요 · 구성도 · 구성 요소 · 처리 흐름 · 외부 인터페이스 · 배포 · 제약 · 향후 계획) |
| `build_spec.js` | 명세서 생성 스크립트 (docx 라이브러리). 구성도 PNG 를 본문에 넣습니다 |

## 다시 만들기

```bash
cd "시스템 구성도"
npm i playwright docx           # 최초 1회 (node_modules 는 git 제외)
node render_png.mjs             # 구성도.html → 시스템_구성도.png
node build_spec.js              # → 시스템_구성_명세서.docx
```

- Chromium 이 다른 위치에 있으면 `CHROME=/경로/chromium` 을 앞에 붙입니다.
- 오프라인이면 `LOCAL_FONT_DIR=<Noto Sans KR woff2 폴더>` 를 주어 Google Fonts 대신 로컬 폰트를 씁니다.
- 구성을 바꿀 때는 `구성도.html` 의 상자(`B`)와 화살표(`A`) 배열, 그리고 `build_spec.js` 의 표를 함께 고칩니다. 화살표는 `via` 좌표로 경로를 지정해 서비스마다 다른 세로선을 씁니다.

## 기준

2026-09-26 통합본 (브랜치 `claude/brave-dirac-zmdr4p`, 커밋 `fc511ca`). 화면 7개 · `shared.js` 조회 함수 4종 · `config.js` 키 6개 · 테마 추천 알고리즘 · 체류시간 산정 폴더를 반영했습니다.
