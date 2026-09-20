# 다국어 미번역 잔여분

프랑스어(fr)가 영어 문구로 대체된 채 남아 있는 UI 라벨 목록입니다. 자동 추출이라 일부는 영·불 동형(예: UNESCO)이라 손댈 필요가 없습니다.

## 대상 범위

| 언어 | 상태 |
| --- | --- |
| 한국어 · English · 中文 · 日本語 · Español | 전 화면 완료 |
| Français | 플래너만 지원, 아래 68개 라벨이 영어로 대체됨 |
| 테마 5개 화면 | 언어 선택에 fr 없음 (`LANGS` 상수) — 추가하려면 각 화면의 `I18N` 에 fr 레이어 필요 |

## 플래너 (tour-planner.dc.html)

| 줄 | 한국어 | 현재 fr (= en) |
| --- | --- | --- |
| 1236 | ko | en |
| 3181 | Ko | En |
| 4603 | 유네스코 | UNESCO |
| 4605 | 100선 | TOP 100 |
| 4769 | 닫기 | Close |
| 4769 | 도시 ▾ | City ▾ |
| 4776 | 도시 검색 | Search a city |
| 4845 | 기타 지역 | Other regions |
| 4858 | 전체 보기 ✕ | Show all ✕ |
| 4927 | 출발지 | Departure |
| 4928 | 귀가지 | Return to |
| 4929 | 출발지와 동일 | Same as departure |
| 4932 | 출발 시각 (출발지) | Depart (origin) |
| 4940 | 귀가 출발 (여행지) | Depart (destination) |
| 4959 | 출발 전철역 (광역전철 구간) | Departure metro station |
| 4966 | 호선 | Line |
| 4967 | 역명 | Station |
| 4988 | 호선 선택 | Choose a line |
| 4989 | 역 선택 | Choose a station |
| 4992 | SRT 예매 | Book SRT |
| 5013 | 자가용 | Own car |
| 5015 | 항공편 | Flight |
| 5016 | 여객선 | Ferry |
| 5017 | 고속버스 | Express bus |
| 5018 | 광역전철 | Metro rail |
| 5072 | 도착 후 | On arrival |
| 5073 | 길찾기 | Route |
| 5076 | 지역 이동 | Transfer |
| 5081 | 귀가일을 한 번 더 선택하세요. | Now pick your return date. |
| 5082 | 출발일과 귀가일을 차례로 선택하면 n박 m일 일정으로 나뉩니다. | Pick a start date, then an end date — the course splits across those days. |
| 5099 | 자동차 (렌트카) | Driving (rental) |
| 5100 | 대중교통 | Transit |
| 5107 | 자가용 기준 — 한국도로공사 고속도로 표정속도(약 92km/h)와 진출입·휴게 시간을 적용한 주행시간입니다. KTX·버스 예매는 필요하지 않습니다. | Own car — driving times use the Korea Expressway Corporation average highway speed (~92 km/h) plus ramp and rest stops. No rail or bus booking needed. |
| 5109 | 자동차 경로는 Google이 국내 서비스를 제공하지 않아 추정값입니다. 대중교통을 선택하면 실제 환승 시간·요금이 표시됩니다. | Google does not serve driving routes in Korea — driving values are estimates. Switch to Transit for real times and fares. |
| 5111 | Google 경로 기준 실제 이동 거리·시간 | Real driving/transit times via Google |
| 5112 | ≈ 표시는 경로 조회 전 추정값입니다 | ≈ values are estimates pending route lookup |
| 5194 | 일차 | Day |
| 5195 | 도착 ·  | Arrive ·  |
| 5196 | 귀가 ·  | Return ·  |
| 5197 | 숙박 | Overnight |
| 5198 | 예매 | Book |
| 5221 | 숙소  | Stay  |
| 5318 |  근처 · 숙소 미지정 |  area · not assigned |
| 5325 | 추천 | Nearby |
| 5523 | 여행지 선택 | Pick destinations |
| 5596 | 열린관광지 (무장애) | Barrier-free site |
| 5597 | 한국관광 100선 | Korea Top 100 |
| 5616 | 공식 소개 · 한국관광공사 | Official description · KTO |
| 5625 | 접기 | Show less |
| 5625 | 더 읽기 | Read more |
| 5664 | 오디오 가이드 해설 · 한국관광공사 | Audio guide · KTO |
| 5669 | 해설을 불러오는 중… | Loading the guide… |
| 5680 | 사진·영상 미등록 | No photo or clip yet |
| 5812 | 제주 노선 운항 현황 | Jeju route flight board |
| 5818 | 운항 현황 불러오기 | Load flights |
| 5825 | 김해 출발 (도착지 선택) | From Gimhae (choose destination) |
| 5826 | 김해 도착 (출발지 선택) | To Gimhae (choose origin) |
| 5844 | 정기 편성 요약 · 시즌·요일에 따라 달라집니다 | Typical schedule · varies by season and weekday |
| 5845 | 김해공항 노선 운항 현황 | Gimhae Airport flights |
| 5850 | 국내선은 제주 노선 중심 · 국제선은 일본·동남아 위주로 운항 | Domestic flights are mainly to Jeju; international routes serve Japan and SE Asia |
| 5851 | 항공사별 운항 개요 (편도 · 추정) | By airline (one-way, approximate) |
| 5865 | 항공사별 공식 시간표 | Airline timetables |
| 5867 | 제주 도착 (출발지 선택) | To Jeju (choose origin) |
| 5868 | 제주 출발 (도착지 선택) | From Jeju (choose destination) |
| 5904 | 전철 노선·시간표 | Metro timetable |
| 5919 | 여객선 예매 | Book ferry |
| 5920 | 항공권 예매 | Book flight |
| 5956 | 렌트카 예매 | Rent a car |

장소명 · 운영시간 · 카테고리는 한국관광공사 다국어 DB에서 받아오므로 이 목록에 없습니다. 공사 DB에 프랑스어 서비스가 없어 해당 항목은 영어로 표시됩니다 (docs/APIS.md).
