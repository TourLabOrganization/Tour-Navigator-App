# 기여 · 코드 규칙

## 실행

```bash
cp config.example.js config.js   # 키 입력
python3 -m http.server 8000
```

## 파일 규칙

- 화면은 `*.dc.html` 한 파일. 템플릿과 로직 클래스가 같이 들어 있습니다.
- 6개 화면이 함께 쓰는 상수·순수 함수는 `shared.js` 에 둡니다. 화면별로 값이 다른 것(`DATA` · `I18N` · `ORIGINS` · `STAYS` · `TRANSIT`)은 각 화면에 남깁니다.
- 두 화면 이상에서 쓰는 CSS 규칙은 `shared.css` 에 둡니다. 한 화면에서만 쓰는 `@keyframes` 는 그 화면 `<helmet>` 의 `<style>` 에 남깁니다. 자세한 내용은 [STYLES.md](STYLES.md).
- 키는 `config.js` 에서만 읽습니다. 화면 파일에 키 문자열을 적지 마세요.
- 새 전역 상수는 대문자 스네이크(`REGION_HUB`), 함수는 카멜(`stayPrice`).

## 포매팅

기존 코드는 한 줄에 몰아 쓴 곳이 많습니다. 손대는 파일만 Prettier로 정리하고 커밋을 나눠 주세요 (포매팅 커밋과 로직 커밋 분리).

```bash
npx prettier --write "tour-planner.dc.html"
```

설정은 `.editorconfig` 를 따릅니다 (스페이스 2칸, UTF-8, LF).

## 커밋 전 확인

- 브라우저 콘솔에 오류 없음 (키 미설정으로 인한 Google Maps 경고는 제외)
- `config.js` 가 커밋에 포함되지 않았는지 확인
- 데이터 추가 시 좌표 근거를 `srcKo`/`srcEn` 에 기록

## 다국어

문구를 추가할 때는 `{ko, en, zh, ja, es, fr}` 여섯 개를 모두 채우세요. 임시로 영어를 넣었다면 [docs/I18N-TODO.md](I18N-TODO.md) 에 줄 번호와 함께 남깁니다.
