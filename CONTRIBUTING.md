# 기여 · 코드 규칙

## 실행

```bash
cp config.example.js config.js   # 키 입력
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000/` 을 열고 `Tour Navigator Home.dc.html` 을 선택합니다. 파일을 직접 더블클릭해도 열리지만, 공사 API 호출은 HTTP 서버에서만 동작합니다.

## 파일 규칙

- 화면은 `*.dc.html` 한 파일. 템플릿과 로직 클래스가 같이 들어 있습니다.
- 6개 화면(플래너 + 테마 5종)이 함께 쓰는 상수·순수 함수는 `shared.js` 에 둡니다. 각 화면 `<head>` 가 `support.js` → `config.js` → `shared.js` 순으로 읽으므로 화면 안에 같은 이름을 다시 정의하지 마세요. 화면별로 값이 다른 것(`DATA` · `I18N` · `ORIGINS` · `STAYS` · `TRANSIT`)은 각 화면에 남깁니다.
- 두 화면 이상에서 쓰는 CSS 규칙은 `shared.css` 에 둡니다. 한 화면에서만 쓰는 `@keyframes` 는 그 화면 `<helmet>` 의 `<style>` 에 남깁니다. 자세한 내용은 [STYLES.md](STYLES.md).
- 키는 `config.js` 에서만 읽습니다(`shared.js` 의 `GMAPS_KEY` · `YT_KEY` · `KAKAO_KEY` · `DATA_GO_KR_KEY` · `EXROAD_KEY` · `TMDB_KEY`). 화면 파일에 키 문자열이나 `window.APP_CONFIG` 직접 참조를 적지 마세요.
- Claude Design 내보내기본은 GitHub 웹에 올리지 말고 작업 세션에 첨부합니다 (규칙은 [CLEANUP.md](CLEANUP.md)). 화면을 다시 내보냈다면, 커밋 전에 `<head>` 의 `config.js` · `shared.js` 태그와 `<helmet>` 의 `shared.css` 링크를 다시 넣고, 내보내기본에 딸려 온 공통 상수 · 키 문자열을 지웁니다. 내보내기본의 공용 함수 본문이 `shared.js` 와 달라졌으면 그 변경만 `shared.js` 로 옮깁니다. 통합 뒤 `체류시간 산정/export_stay_csv.js` 로 CSV 를 다시 만들고, `시스템 구성도/` 의 구성도 · 명세서도 바뀐 구성에 맞춰 갱신합니다.
- 새 전역 상수는 대문자 스네이크(`REGION_HUB`), 함수는 카멜(`stayPrice`).

## 포매팅

기존 코드는 한 줄에 몰아 쓴 곳이 많습니다. 손대는 파일만 Prettier로 정리하고, 포매팅 커밋과 로직 커밋을 나눠 주세요.

```bash
npx prettier --write "Tour Planner.dc.html"
```

스페이스 2칸, UTF-8, LF.

## 자주 하는 작업

**장소 추가 · 수정** — 해당 화면의 `DATA` 에서 도시 배열을 찾아 레코드를 넣습니다. 필드는 [DATA.md](DATA.md) 의 장소 레코드 절을 따르고, `id` 는 도시 접두사 + 번호로 겹치지 않게 합니다. 플래너와 테마 화면에 같은 장소가 있으면 두 곳 모두 고칩니다. 끝나면 `체류시간 산정/export_stay_csv.js` 로 CSV 를 다시 만듭니다.

**문구 추가** — 화면의 `T` 또는 `I18N` 에 `{ko, en, zh, ja, es}` 다섯 개를 모두 채웁니다. 임시로 영어를 넣었다면 [I18N-TODO.md](I18N-TODO.md) 에 줄 번호와 함께 적습니다.

**공용 함수 수정** — `shared.js` 한 곳만 고칩니다. 6개 화면이 모두 영향을 받으므로 플래너 하나와 테마 화면 하나를 열어 확인합니다.

**새 외부 API** — 키가 필요하면 `config.example.js` 에 항목을 추가하고 `shared.js` 에서 상수로 읽습니다. 화면은 그 상수만 씁니다. [APIS.md](APIS.md) 의 표와 [시스템 구성도/](시스템%20구성도/README.md) 를 함께 갱신합니다.

**Claude Design 내보내기본 반영** — zip 을 작업 세션에 첨부합니다. 통합 순서는 다음과 같습니다.

1. 화면 7개를 루트에 덮어쓴 뒤 `<head>` 에 `config.js` · `shared.js`, `<helmet>` 에 `shared.css` 링크를 다시 넣습니다.
2. 화면 안에 다시 생긴 `shared.js` 상수 · 함수와 키 문자열 · `window.APP_CONFIG` 직접 참조를 지웁니다.
3. 내보내기본의 공용 함수 본문이 달라졌으면 바뀐 부분만 `shared.js` 로 옮깁니다.
4. 헤드리스 브라우저로 7개 화면을 열어 스크립트 오류가 없는지 봅니다.
5. 체류 CSV, I18N-TODO 줄 번호, 구성도 · 명세서, CHANGELOG 를 갱신합니다.

**서버 데이터 맞추기** — 플래너나 테마 화면의 장소를 추가 · 삭제하거나 `id` · 좌표 · 분류를 바꿨다면, 앱 PR 이 머지된 뒤 data-server 에서 다시 만들어 PR 을 올립니다. 이 레포와 data-server 를 같은 상위 폴더에 받아 두었다고 가정합니다.

```bash
cd ../data-server
git checkout -b chore/sync-app-<요약> origin/develop
python -m pipeline.places     # 장소 수 · 지역 수가 앱과 같은지 확인
python -m pipeline.courses    # 코스 5개 · 마스터 연결 100%
# 추천 재분류에 쓰는 assets/tour-places.csv 나 테마 화면을 바꿨다면
(cd recommend && APP_REPO=../../Tour-Navigator-App python run_all.py)
```

data-server 규칙(커밋 메시지 `<타입>: <한국어 요약>`, 베이스 `develop`, 푸시 전 확인)은 그 레포의 `CLAUDE.md` 를 따릅니다. `develop` 머지가 곧 운영 배포입니다. 레코드 형식 자체(따옴표 · 들여쓰기 · 중첩 객체)를 바꾸면 파싱이 깨지므로, 그 경우 [ARCHITECTURE.md](ARCHITECTURE.md) 의 "data-server 가 읽는 부분"을 먼저 확인합니다.

## 커밋 전 확인

```bash
# 키 문자열이 화면 · 공용 파일에 없는지 (출력이 없어야 함)
grep -nE "AIza[0-9A-Za-z_-]{30,}|key=[0-9]{8,}|\$2a\$10\$" *.dc.html shared.js config.example.js

# 화면이 window.APP_CONFIG 를 직접 읽지 않는지 (출력이 없어야 함)
grep -n "APP_CONFIG" *.dc.html

# shared.js 문법
node -e "new Function(require('fs').readFileSync('shared.js','utf8'))"

# config.js 가 스테이징되지 않았는지 (출력이 없어야 함)
git diff --cached --name-only | grep -x config.js
```

- 브라우저 콘솔에 오류 없음. 키를 넣지 않아 나오는 Google Maps 경고는 제외
- 데이터 추가 시 좌표 근거를 `srcKo`/`srcEn` 에 기록
- 저장소 정리 규칙은 [CLEANUP.md](CLEANUP.md) 의 규칙 절을 따름

## 브랜치

작업은 기능 브랜치에서 하고 PR 로 `main` 에 합칩니다. 다른 사람의 브랜치에는 force-push · rebase 를 하지 않고 merge 커밋으로 맞춥니다. GitHub 웹의 "Add files via upload" 로 zip 이나 폴더를 올리지 않습니다.
