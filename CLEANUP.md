# 저장소 정리 기록과 규칙

2026-09-24 ~ 09-26 사이에 저장소에서 걷어낸 것과, 같은 일이 되풀이되지 않게 하는 규칙입니다. 지운 파일은 전부 git 이력에 남아 있으므로 커밋 해시로 되찾을 수 있습니다.

## 1. 지운 것

| 구분 | 파일 · 폴더 | 이유 | 이력 위치 |
| --- | --- | --- | --- |
| 내보내기본 사본 | `Mobile app design.zip` (17.6MB) | 안의 파일이 전부 저장소에 이미 있음 | `a02da69` 이전 |
| 내보내기본 사본 | `Mobile app design request.zip`, `Mobile app design request/` (49개), `Mobile app design request/github-upload/` (11개) | GitHub 웹 업로드로 폴더째 들어간 것. 내용은 루트 화면에 통합됨 | `0f2e384`(main) 이전 |
| 동기화 메모 | `github/md` | 옛 소유자 저장소와 삭제된 standalone 을 가리키던 Claude Design 메모 | `a02da69` 이전 |
| 원자료 | `assets/story-db.csv` (2.1MB), `assets/story-matched.json`, `assets/open-tour.csv` | 코드가 읽지 않음. 배지 · 스토리 매칭은 오프라인에서 끝내 화면 DATA 에 들어 있음 | `0298fe1` |
| 화면 안 복제 코드 | 화면 7개에 복제돼 있던 `shared.js` 상수·함수 (처음 16개 → 09-26 에는 40개) | 공용 코드는 `shared.js` 한 곳에서만 | 각 화면 이력 |
| 키 문자열 | Google · Kakao · 공공데이터포털 · 한국도로공사 · KRIC 키 | 전부 `config.js` 로 이동. 이력에 남은 키는 재발급 필요 | `0572f24`~`a02da69` |
| 낡은 문서 | README 의 데이터 · 구조 · 디자인 절, STYLES 이력 절, APIS 옛 키 설명, standalone 참조, `테마 추천 알고리즘/CLAUDE.md` 의 GitHub 절 | 다른 문서와 중복이거나 사실과 다름 | — |
| 중복 행 | `체류시간 산정/체류시간_장소별.csv` 262행 | 도시 화면과 전국 목록에 같은 장소가 두 번 실림 → id 당 한 행 | `ccdd88d` 이전 |

## 2. 남긴 것과 이유

- `assets/open-tour-unmatched.csv` — 열린관광지 배지 매칭이 남은 12곳. ROADMAP 의 작업 목록이라 둠.
- `테마 추천 알고리즘/data/derived/*.json`, `체류시간 산정/*.csv` — 스크립트로 다시 만들 수 있지만 각 폴더 README 가 "결과를 함께 커밋" 하도록 정함.
- `assets/screenshots/home.png` — README 용 캡처. 화면이 바뀌면 다시 찍는다.

## 3. 규칙

1. **Claude Design 내보내기본은 GitHub 웹에 올리지 않는다.** zip 을 이 저장소 작업 세션에 첨부하면 통합 스크립트가 루트 화면에 반영한다. 내보내기본은 공통 코드와 키를 화면 안에 다시 넣기 때문에 그대로 덮어쓰면 안 된다 (절차는 CONTRIBUTING.md).
2. **zip · 폴더째 업로드 금지.** 저장소에는 화면 7개와 `support.js` · `shared.js` · `shared.css` · `image-slot.js` · `config.example.js` · `assets/` · `uploads/` · 문서 · 하위 폴더 3개만 둔다.
3. **공용 코드는 `shared.js` 하나.** 화면에 같은 이름의 상수·함수를 다시 정의하지 않는다.
4. **키는 `config.js` 에서만 읽는다.** 화면 · 문서 · 커밋 메시지에 키 문자열을 적지 않는다.
5. **코드가 읽지 않는 데이터는 저장소에 두지 않는다.** 근거 자료가 필요하면 출처 링크와 이력 커밋을 DATA.md 에 적는다.
6. **브랜치.** 작업은 `claude/brave-dirac-zmdr4p` 에서 하고 PR 로 main 에 합친다. `Claude-Design` 브랜치는 웹 업로드 실수로 생긴 것이라 main 에 합친 뒤 삭제한다.

## 4. 점검 명령

```bash
git ls-files -z | xargs -0 md5sum | sort | uniq -w32 -D      # 바이트 동일 파일
git ls-files | grep -iE "\.zip$|^Mobile|\.tmp|node_modules"   # 잔여물
grep -rnoE "AIzaSy[0-9A-Za-z_-]{33}|[0-9a-f]{32}" *.dc.html shared.js   # 키 문자열
```
