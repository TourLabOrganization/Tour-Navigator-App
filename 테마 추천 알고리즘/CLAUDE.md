# CLAUDE.md — 테마 추천 알고리즘

Claude Code가 이 폴더에서 작업할 때 따를 규칙입니다.

## 이 폴더는
Tour Navigator 앱의 테마 추천(선호 문항 → 군집 → 추천 테마 → 코스) 설계 문서, 근거 데이터, 계산 코드. 자세한 구조는 README.md.

## 작업 규칙
- 계산을 바꾸면 `python run_all.py`로 `data/derived/`를 다시 만들고, 결과 JSON도 함께 커밋.
- `data/raw/`의 원자료(.SAV, .xlsx)는 절대 커밋하지 않음 (.gitignore 처리됨). `git status`에 보이면 멈추고 사용자에게 알림.
- `docs/`의 .docx·`data/`의 .xlsx는 사람이 검토하는 산출물. 코드 결과와 숫자가 달라지면 README "남은 일"에 적어 둠.
- 가중치 `W`(src/calc2.py): C1~C6은 가설값, C7~C10은 외래관광객조사 원자료로 산출. 가설값을 바꿀 때는 근거를 커밋 메시지에 적음.

## GitHub에 올리기 (TourLabOrganization/Tour-Navigator-App)
이 폴더를 레포 루트에 `테마 추천 알고리즘/`으로 둔 상태에서:

```bash
git checkout -b feature/theme-recommender
git add "테마 추천 알고리즘"
git status            # data/raw/ 원자료가 없는지 확인
git commit -m "Add theme recommender: 선호 문항·군집 점수표·장소 재분류·국민여행조사/외래관광객조사 근거"
git push -u origin feature/theme-recommender
gh pr create --fill   # PR로 올릴 때
```
