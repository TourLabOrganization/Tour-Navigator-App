// Tour Navigator — 화면 공용 코드
// 홈을 제외한 6개 화면(플래너 + 테마 5종)이 함께 쓰는 상수와 순수 함수.
// config.js 다음, 화면 파일보다 먼저 로드된다.
// 화면별로 값이 다른 것(DATA · I18N · ORIGINS · STAYS · TRANSIT)은 각 화면 파일에 남아 있다.

// API 키 — 전부 config.js(window.APP_CONFIG)에서 읽는다. 비어 있으면 해당 기능만 비활성화된다.
const _CFG=window.APP_CONFIG||{};
// Google Maps JavaScript API (지도 로더 URL에 들어간다)
const GMAPS_KEY=_CFG.googleMaps||'';
// YouTube Data API v3 키. 조회수·게시일을 하루 1회 실제 값으로 갱신하는 데 쓴다.
// 지도 키와 같은 키를 쓰려면 콘솔에서 해당 키의 'API 제한'에 YouTube Data API v3를 추가해야 한다.
const YT_KEY=_CFG.youtube||'';
// Kakao REST 키 (날씨·로컬)
const KAKAO_KEY=_CFG.kakao||'';
// 공공데이터포털 서비스키 — 한국관광공사 TourAPI · 한국공항공사 공용
const DATA_GO_KR_KEY=_CFG.dataGoKr||'';
// 한국도로공사 공공데이터 (휴게소 목록)
const EXROAD_KEY=_CFG.exRoad||'';
// TMDB (영화·드라마 작품 정보)
const TMDB_KEY=_CFG.tmdb||'';

// 실크스크린 팔레트 — 잉크·주황·크림
const PALETTE={
  pastel:null,
  vivid:{sea:{bg:'#6fd3e7',fg:'#06323d'},heal:{bg:'#7fd97a',fg:'#0d3b0a'},herit:{bg:'#f5c944',fg:'#3d2c00'},activity:{bg:'#b18cf0',fg:'#231046'},stay:{bg:'#f383ae',fg:'#450f26'},food:{bg:'#f2795c',fg:'#3f1005'}},
  mono:{sea:{bg:'#e6e4e1',fg:'#153b3d'},heal:{bg:'#d2cfcb',fg:'#153b3d'},herit:{bg:'#f2ece0',fg:'#153b3d'},activity:{bg:'#bcb8b3',fg:'#153b3d'},stay:{bg:'#a8a39e',fg:'#f2ece0'},food:{bg:'#153b3d',fg:'#f2ece0'}}
};

// 강조색 변형
const ACCENTS = [
  {base:'#b8431c',on:'#f2ece0'},
  {base:'#153b3d',on:'#f2ece0'},
  {base:'#f2ece0',on:'#153b3d'}
];

// Google Maps 스타일 스킨 (라이트·잉크 등)
const MAP_SKINS={
  paper:[
    {elementType:'geometry',stylers:[{color:'#f2ece0'}]},
    {elementType:'labels.text.fill',stylers:[{color:'#153b3d'}]},
    {elementType:'labels.text.stroke',stylers:[{color:'#f2ece0'},{weight:3}]},
    {featureType:'water',elementType:'geometry',stylers:[{color:'#dfe6e8'}]},
    {featureType:'landscape.natural',elementType:'geometry',stylers:[{color:'#eceae6'}]},
    {featureType:'poi',elementType:'labels',stylers:[{visibility:'off'}]},
    {featureType:'road',elementType:'geometry',stylers:[{color:'#ffffff'}]},
    {featureType:'road.highway',elementType:'geometry',stylers:[{color:'#e8ded9'}]},
    {featureType:'transit',stylers:[{visibility:'off'}]}
  ],
  ink:[
    {elementType:'geometry',stylers:[{color:'#153b3d'}]},
    {elementType:'labels.text.fill',stylers:[{color:'#bdb8b4'}]},
    {elementType:'labels.text.stroke',stylers:[{color:'#153b3d'},{weight:3}]},
    {featureType:'water',elementType:'geometry',stylers:[{color:'#14201f'}]},
    {featureType:'landscape.natural',elementType:'geometry',stylers:[{color:'#2a2726'}]},
    {featureType:'poi',elementType:'labels',stylers:[{visibility:'off'}]},
    {featureType:'road',elementType:'geometry',stylers:[{color:'#3a3634'}]},
    {featureType:'road.highway',elementType:'geometry',stylers:[{color:'#5a4b44'}]},
    {featureType:'transit',stylers:[{visibility:'off'}]}
  ],
  plain:null
};

// 카테고리별 마커 색
const CAT_COLORS={
  sea:{bg:'#e0f7f4',fg:'#0d7377'},
  heal:{bg:'#e8f5e9',fg:'#2e7d32'},
  activity:{bg:'#f3e5f5',fg:'#7b1fa2'},
  herit:{bg:'#fffde7',fg:'#f57f17'},
  stay:{bg:'#fce4ec',fg:'#c2185b'},
  food:{bg:'#ffebee',fg:'#c62828'},
  station:{bg:'#f3e5f5',fg:'#7b1fa2'},
  terminal:{bg:'#f3e5f5',fg:'#7b1fa2'}
};

// 카테고리 축약 라벨
const CAT_SHORT={
  ko:{sea:'해양',heal:'힐링',herit:'역사',activity:'테마',stay:'숙박',food:'상권'},
  en:{sea:'SEA',heal:'ECO',herit:'HER',activity:'FUN',stay:'STAY',food:'EAT'},
  zh:{sea:'海洋',heal:'疗愈',herit:'历史',activity:'主题',stay:'住宿',food:'商圈'},
  ja:{sea:'海洋',heal:'癒し',herit:'歴史',activity:'テーマ',stay:'宿泊',food:'商圏'},
  es:{sea:'MAR',heal:'ECO',herit:'HIS',activity:'OCIO',stay:'HOTEL',food:'COMER'}
};

// 카테고리 스페인어 라벨
const CATS_ES={stay:'Alojamiento y experiencias',sea:'Paisaje costero',heal:'Naturaleza y ecoturismo',herit:'Patrimonio histórico',food:'Comercio y gastronomía',activity:'Parques y actividades',station:'Estación',terminal:'Terminal'};

// 달력 월 이름 (언어별)
const CAL_MONTH={
  ko:(m,y)=>y+'년 '+(m+1)+'월',
  en:(m,y)=>['January','February','March','April','May','June','July','August','September','October','November','December'][m]+' '+y,
  zh:(m,y)=>y+'年'+(m+1)+'月',
  ja:(m,y)=>y+'年'+(m+1)+'月',
  es:(m,y)=>['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][m]+' '+y
};

// 달력 요일 이름 (언어별)
const CAL_WD={
  ko:['일','월','화','수','목','금','토'],
  en:['Su','Mo','Tu','We','Th','Fr','Sa'],
  zh:['日','一','二','三','四','五','六'],
  ja:['日','月','火','水','木','金','土'],
  es:['D','L','M','X','J','V','S']
};

// 오프라인 안내 문구
const OFFL={ko:'장소목록 외',en:'Off-list',zh:'名单外地点',ja:'リスト外',es:'Fuera de lista'};

// 도시 표기를 현재 언어로 변환
const cityName=(o,lang)=>{
  const s=(lang==='ko'?o.ko:(o.en||o.ko))||'';
  return s.replace(/\s*\([^)]*\)\s*$/,'').replace(/(역|터미널|Stn|Station|Terminal|Bus)\s*$/,'').trim()||s;
};

// 조회수 등 숫자 축약 표기 (1.2만 / 12K)
const vNum=s=>Number(String(s||'').replace(/[^\d]/g,''))||0;

// 게시일 표기
const vDate=s=>String(s||'').replace(/[^\d]/g,'');

// 숙소 가격대 표기
function stayPrice(s,lang){
  if(!s||!s.band)return (s&&s.price)||'';
  const [a,b]=s.band;
  if(lang==='ko')return a+'~'+b+'\ub9cc\uc6d0 \ucd94\uc815';
  if(lang==='ja')return a+'\uff5e'+b+'\u4e07\u30a6\u30a9\u30f3\u76ee\u5b89';
  if(lang==='zh')return '\u7ea6'+(a*10)+'\uff5e'+(b*10)+'\u5343\u97e9\u5143';
  if(lang==='es')return '\u20a9'+(a*10)+'\u2013'+(b*10)+'k aprox.';
  return '\u20a9'+(a*10)+'k\u2013'+(b*10)+'k est.';
}

// 숙소 예약 링크용 검색어
function stayQuery(s,lang){
  if(!s)return '';
  if(lang==='ko')return s.qKo||((s.ko||'')+' '+(s.areaKo||'')).trim();
  return s.qEn||((s.en||s.ko||'')+' '+(s.areaEn||'')).trim();
}

// 두 좌표 사이 대권거리(km) — Haversine
function hav(a,b){const R=6371,r=Math.PI/180;const dl=(b.lat-a.lat)*r,dg=(b.lng-a.lng)*r;const s=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(s));}

// 날씨 (어제·오늘·내일). Open-Meteo 로 3일치를 받고, 공공데이터포털 키가 있으면 오늘·내일을 기상청 단기예보로 덮어쓴다. 실패 시 물음표 값
const _openMeteo=async(lat,lng)=>{
  const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Asia/Seoul&past_days=1&forecast_days=3`);
  const data=await res.json();
  if(!data.daily)return null;
  const getIcon=(code)=>code===0?'☀️':code===1||code===2?'☁️':code===3?'☁️':code===45||code===48?'🌫️':code>=51&&code<=67?'🌧️':code>=71&&code<=77?'❄️':code===80||code===81||code===82?'⛈️':'🌡️';
  const day=i=>({tmp:Math.round(data.daily.temperature_2m_max[i])+'°C',rn1:(data.daily.precipitation_sum[i]||0).toFixed(1),icon:getIcon(data.daily.weather_code[i])});
  return {yesterday:day(0),today:day(1),tomorrow:day(2)};
};
const getWeather=async(lat,lng)=>{
  const [om,kma]=await Promise.all([_openMeteo(lat,lng).catch(()=>null),getKmaForecast(lat,lng).catch(()=>null)]);
  const q={tmp:'?',rn1:'0',icon:'?'};
  const res=om||{yesterday:{...q},today:{...q},tomorrow:{...q}};
  if(kma)Object.assign(res,kma);
  return res;
};

// ── 기상청 단기예보 (공공데이터포털 · DATA_GO_KR_KEY) ──────────────────────────
// 위경도 → 기상청 예보 격자(nx, ny). 기상청이 공개한 Lambert Conformal Conic 변환식.
function kmaGrid(lat,lng){
  const RE=6371.00877,GRID=5.0,SLAT1=30.0,SLAT2=60.0,OLON=126.0,OLAT=38.0,XO=43,YO=136;
  const D=Math.PI/180,re=RE/GRID,slat1=SLAT1*D,slat2=SLAT2*D,olon=OLON*D,olat=OLAT*D;
  let sn=Math.tan(Math.PI*0.25+slat2*0.5)/Math.tan(Math.PI*0.25+slat1*0.5);
  sn=Math.log(Math.cos(slat1)/Math.cos(slat2))/Math.log(sn);
  let sf=Math.tan(Math.PI*0.25+slat1*0.5);sf=Math.pow(sf,sn)*Math.cos(slat1)/sn;
  let ro=Math.tan(Math.PI*0.25+olat*0.5);ro=re*sf/Math.pow(ro,sn);
  let ra=Math.tan(Math.PI*0.25+lat*D*0.5);ra=re*sf/Math.pow(ra,sn);
  let theta=lng*D-olon;if(theta>Math.PI)theta-=2*Math.PI;if(theta<-Math.PI)theta+=2*Math.PI;theta*=sn;
  return {nx:Math.floor(ra*Math.sin(theta)+XO+0.5),ny:Math.floor(ro-ra*Math.cos(theta)+YO+0.5)};
}
// 한국 시각. UTC 게터로 읽으면 KST 값이 나온다 (사용자 단말의 시간대와 무관)
const _kst=()=>new Date(Date.now()+9*3600e3);
const _pad2=n=>String(n).padStart(2,'0');
const _ymdU=d=>d.getUTCFullYear()+_pad2(d.getUTCMonth()+1)+_pad2(d.getUTCDate());
// 가장 최근 발표분 (02·05·08·11·14·17·20·23시, 발표 10분 뒤 제공)
function kmaBase(){
  const t=new Date(_kst().getTime()-10*60000);
  let pick=null;for(const b of [2,5,8,11,14,17,20,23]){if(b<=t.getUTCHours())pick=b;}
  if(pick===null){t.setUTCDate(t.getUTCDate()-1);pick=23;}
  return {base_date:_ymdU(t),base_time:_pad2(pick)+'00'};
}
// 오늘·내일의 최고기온 · 강수량 합 · 아이콘. 키가 없거나 실패하면 null
async function getKmaForecast(lat,lng){
  if(!DATA_GO_KR_KEY)return null;
  const {nx,ny}=kmaGrid(lat,lng), b=kmaBase();
  const u='https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey='+encodeURIComponent(DATA_GO_KR_KEY)
    +'&pageNo=1&numOfRows=1000&dataType=JSON&base_date='+b.base_date+'&base_time='+b.base_time+'&nx='+nx+'&ny='+ny;
  const j=await fetch(u).then(r=>r.json());
  const items=(((j.response||{}).body||{}).items||{}).item||[];
  const days={};
  items.forEach(it=>{
    const d=days[it.fcstDate]||(days[it.fcstDate]={tmp:[],tmx:null,rain:0,pty:0,sky:0});
    const v=it.fcstValue;
    if(it.category==='TMX')d.tmx=Number(v);
    else if(it.category==='TMP')d.tmp.push(Number(v));
    else if(it.category==='PCP'){const m=String(v).match(/[\d.]+/);if(m)d.rain+=Number(m[0]);}
    else if(it.category==='PTY'){const p=Number(v);if(p>d.pty)d.pty=p;}
    else if(it.category==='SKY'&&(it.fcstTime==='1200'||!d.sky))d.sky=Number(v);
  });
  const icon=d=>d.pty===3?'❄️':d.pty===4?'⛈️':d.pty>0?'🌧️':(d.sky>=3?'☁️':'☀️');
  const t=_kst(), today=_ymdU(t); t.setUTCDate(t.getUTCDate()+1); const tomorrow=_ymdU(t);
  const out={};
  for(const [k,key] of [[today,'today'],[tomorrow,'tomorrow']]){
    const d=days[k]; if(!d)continue;
    const tmp=d.tmx!=null?d.tmx:(d.tmp.length?Math.max(...d.tmp):null); if(tmp===null)continue;
    out[key]={tmp:Math.round(tmp)+'°C',rn1:d.rain.toFixed(1),icon:icon(d)};
  }
  return Object.keys(out).length?out:null;
}

// ── 에어코리아 미세먼지 (공공데이터포털 · DATA_GO_KR_KEY) ──────────────────────
// 시도별 실시간 측정값의 평균. 시도는 좌표에서 가장 가까운 시도청 기준으로 고른다.
const SIDO_CENTERS=[['서울',37.5665,126.978],['부산',35.1796,129.0756],['대구',35.8714,128.6014],['인천',37.4563,126.7052],['광주',35.1595,126.8526],['대전',36.3504,127.3845],['울산',35.5384,129.3114],['세종',36.48,127.289],['경기',37.4138,127.5183],['강원',37.8228,128.1555],['충북',36.6357,127.4917],['충남',36.5184,126.8],['전북',35.7175,127.153],['전남',34.8679,126.991],['경북',36.4919,128.8889],['경남',35.4606,128.2132],['제주',33.4996,126.5312]];
function nearestSido(lat,lng){let best=null,bd=Infinity;for(const [n,la,ln] of SIDO_CENTERS){const d=hav({lat,lng},{lat:la,lng:ln});if(d<bd){bd=d;best=n;}}return best;}
const AIR_LABEL={
  ko:{title:'미세먼지',g:['','좋음','보통','나쁨','매우나쁨']},
  en:{title:'Air quality',g:['','Good','Moderate','Unhealthy','Very unhealthy']},
  zh:{title:'空气质量',g:['','优','良','差','很差']},
  ja:{title:'大気質',g:['','良い','普通','悪い','非常に悪い']},
  es:{title:'Calidad del aire',g:['','Buena','Moderada','Mala','Muy mala']}
};
const AIR_COLOR=['transparent','rgba(111,211,231,.35)','rgba(127,217,122,.35)','rgba(245,201,68,.45)','rgba(242,121,92,.45)'];
const _airCache={};
async function getAirQuality(lat,lng){
  if(!DATA_GO_KR_KEY)return null;
  const sido=nearestSido(lat,lng), c=_airCache[sido];
  if(c&&Date.now()-c.t<30*60000)return c.v;
  const u='https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey='+encodeURIComponent(DATA_GO_KR_KEY)
    +'&returnType=json&numOfRows=200&pageNo=1&sidoName='+encodeURIComponent(sido)+'&ver=1.3';
  const j=await fetch(u).then(r=>r.json());
  const items=((j.response||{}).body||{}).items||[];
  const num=v=>{const n=Number(v);return v!==''&&v!=='-'&&v!=null&&isFinite(n)?n:null;};
  const p10=items.map(x=>num(x.pm10Value)).filter(v=>v!==null), p25=items.map(x=>num(x.pm25Value)).filter(v=>v!==null);
  if(!p10.length&&!p25.length)return null;
  const avg=a=>a.length?Math.round(a.reduce((s,v)=>s+v,0)/a.length):null;
  const pm10=avg(p10),pm25=avg(p25);
  // 환경부 예보 등급: PM10 0–30 좋음 · 31–80 보통 · 81–150 나쁨 · 151+ 매우나쁨 / PM2.5 0–15 · 16–35 · 36–75 · 76+
  const g10=pm10===null?0:pm10<=30?1:pm10<=80?2:pm10<=150?3:4;
  const g25=pm25===null?0:pm25<=15?1:pm25<=35?2:pm25<=75?3:4;
  const v={sido,pm10,pm25,grade:Math.max(g10,g25),stations:items.length,at:(items[0]||{}).dataTime||''};
  _airCache[sido]={t:Date.now(),v};
  return v;
}

// ── 한국관광공사 축제·행사 (TourAPI searchFestival2 · DATA_GO_KR_KEY) ─────────
// 여행 기간(fromYmd~toYmd, YYYYMMDD)과 겹치고 기준점에서 radiusKm 안에 있는 행사. 가까운 순 최대 12개
const _festCache={};
const _ymdL=d=>d.getFullYear()+_pad2(d.getMonth()+1)+_pad2(d.getDate());
async function getFestivals(lat,lng,fromYmd,toYmd,svc,radiusKm){
  if(!DATA_GO_KR_KEY)return [];
  svc=svc||'KorService2'; radiusKm=radiusKm||30;
  const key=[svc,fromYmd,toYmd,lat.toFixed(2),lng.toFixed(2),radiusKm].join('|'), c=_festCache[key];
  if(c&&Date.now()-c.t<60*60000)return c.v;
  // 시작일 조건은 90일 앞으로 넓혀 두고, 실제 기간 겹침은 아래에서 거른다 (장기 행사 포함)
  const from=new Date(Number(fromYmd.slice(0,4)),Number(fromYmd.slice(4,6))-1,Number(fromYmd.slice(6,8))); from.setDate(from.getDate()-90);
  const u='https://apis.data.go.kr/B551011/'+svc+'/searchFestival2?serviceKey='+encodeURIComponent(DATA_GO_KR_KEY)
    +'&MobileOS=ETC&MobileApp=TourNavigator&_type=json&numOfRows=500&pageNo=1&arrange=A&eventStartDate='+_ymdL(from);
  const j=await fetch(u).then(r=>r.json());
  const it=(((j.response||{}).body||{}).items||{}).item; const arr=Array.isArray(it)?it:(it?[it]:[]);
  const v=arr.map(x=>({id:String(x.contentid||''),title:String(x.title||''),start:String(x.eventstartdate||''),end:String(x.eventenddate||''),addr:String(x.addr1||''),img:x.firstimage2||x.firstimage||'',lat:Number(x.mapy),lng:Number(x.mapx),tel:String(x.tel||'')}))
    .filter(x=>x.start&&x.end&&x.start<=toYmd&&x.end>=fromYmd&&isFinite(x.lat)&&isFinite(x.lng)&&x.lat>30)
    .map(x=>({...x,km:Math.round(hav({lat,lng},x)*10)/10}))
    .filter(x=>x.km<=radiusKm).sort((a,b)=>a.km-b.km).slice(0,12);
  _festCache[key]={t:Date.now(),v};
  return v;
}

// ── TMDB 작품 정보 (TMDB_KEY) ────────────────────────────────────────────────
// 영화(type 'movie')·드라마(type 'tv') 제목으로 검색해 첫 결과를 돌려준다. 7일간 localStorage 캐시
async function getTitleMeta(query,type,lang){
  if(!TMDB_KEY)return null;
  const lg={ko:'ko-KR',en:'en-US',zh:'zh-CN',ja:'ja-JP',es:'es-ES',fr:'fr-FR'}[lang]||'ko-KR';
  const ck='rs_tmdb:'+lg+':'+type+':'+query;
  try{const c=JSON.parse(localStorage.getItem(ck)||'null');if(c&&Date.now()-c.t<7*864e5)return c.v;}catch(e){}
  const u='https://api.themoviedb.org/3/search/'+type+'?api_key='+encodeURIComponent(TMDB_KEY)+'&language='+lg+'&query='+encodeURIComponent(query);
  const j=await fetch(u).then(r=>r.json());
  const r=(j.results||[])[0]; if(!r)return null;
  const v={id:r.id,type,title:r.title||r.name||query,orig:r.original_title||r.original_name||'',
    year:String(r.release_date||r.first_air_date||'').slice(0,4),rating:r.vote_average?Math.round(r.vote_average*10)/10:null,
    overview:r.overview||'',poster:r.poster_path?'https://image.tmdb.org/t/p/w342'+r.poster_path:'',url:'https://www.themoviedb.org/'+type+'/'+r.id};
  try{localStorage.setItem(ck,JSON.stringify({t:Date.now(),v}));}catch(e){}
  return v;
}

// ── 한국관광공사 연관 관광지 (TarRlteTarService1 · DATA_GO_KR_KEY) ─────────────
// 장소 이름 + 시군구 코드로 "함께 많이 가는 관광지" 를 찾는다. 시군구 코드는 Kakao 좌표→행정구역(KAKAO_KEY) 으로 얻고,
// 없으면 SIGNGU_FALLBACK 표(지역명 부분일치) → 가장 가까운 시도 순으로 대체한다. 2→3→4개월 전 기준월을 차례로 시도
const RLTE_KEY=DATA_GO_KR_KEY;
const SIDO_AREA_CD={'서울':'11','부산':'26','대구':'27','인천':'28','광주':'29','대전':'30','울산':'31','세종':'36','경기':'41','강원':'51','충북':'43','충남':'44','전북':'52','전남':'46','경북':'47','경남':'48','제주':'50'};
const _rlteCache={};
// 시군구 코드(signguCd, 5자리 법정동) — 카카오 좌표→행정구역(B) 코드 앞 5자리, 실패 시 지역명 표
const SIGNGU_FALLBACK={'서울':'11110','종로':'11110','부산':'26350','해운대':'26350','부산 중구':'26110','영도':'26200','기장':'26710','인천':'28125','강화':'28710','대구':'27110','광주':'12210','대전':'30110','울산':'31110','세종':'36110','수원':'41115','가평':'41820','양평':'41830','남양주':'41360','강릉':'51150','속초':'51210','춘천':'51110','평창':'51760','정선':'51770','영월':'51750','양양':'51830','전주':'52111','군산':'52130','여수':'12130','순천':'12150','목포':'12110','경주':'47130','안동':'47170','포항':'47111','울릉':'47940','통영':'48220','거제':'48310','남해':'48840','제주':'50110','서귀포':'50130','공주':'44150','부여':'44760','단양':'43800'};
const _sgCache={};
async function getSignguCd(lat,lng,loc){
  const ck=lat.toFixed(3)+','+lng.toFixed(3);
  if(_sgCache[ck])return _sgCache[ck];
  let code='';
  const kk=(typeof KAKAO_KEY!=='undefined'&&KAKAO_KEY)||(window.APP_CONFIG||{}).kakao||'';
  if(kk){try{const j=await fetch('https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x='+lng+'&y='+lat,{headers:{Authorization:'KakaoAK '+kk}}).then(r=>r.json());
    const b=(j.documents||[]).find(d=>d.region_type==='B')||(j.documents||[])[0];
    if(b&&b.code)code=String(b.code).slice(0,5);}catch(e){}}
  // 옛 강원(42)·전북(45) 코드는 특별자치도 코드(51·52)로 바꾼다
  if(/^42/.test(code))code='51'+code.slice(2); if(/^45/.test(code))code='52'+code.slice(2);
  if(!code&&loc){const k=Object.keys(SIGNGU_FALLBACK).sort((a,b)=>b.length-a.length).find(n=>String(loc).indexOf(n)>-1);if(k)code=SIGNGU_FALLBACK[k];}
  if(!code){const s=nearestSido(lat,lng);code=SIGNGU_FALLBACK[s]||'';}
  _sgCache[ck]=code;
  return code;
}
async function getRelatedSpots(name,lat,lng,loc){
  if(!RLTE_KEY||!name)return [];
  const kw=String(name).replace(/\s*\(.*?\)\s*/g,'').trim();
  const sg=await getSignguCd(lat,lng,loc);
  if(!sg)return [];
  const areaCd=sg.slice(0,2), signguCd=sg;
  const ck=signguCd+'|'+kw; if(_rlteCache[ck])return _rlteCache[ck];
  // 이름 비교는 느슨하게 — 공백·괄호·'/부제'·가운뎃점 무시, 앞부분이 겹치면 같은 곳으로 본다
  const nz=s=>String(s||'').replace(/\/.*$/,'').replace(/\(.*?\)/g,'').replace(/[\s·\-_.,'"]/g,'').toLowerCase();
  const me=nz(kw);
  const score=t=>{const n=nz(t);if(!n||!me)return 0;if(n===me)return 3;if(me.length>=3&&n.length>=3&&(n.indexOf(me)===0||me.indexOf(n)===0))return 2;if(me.length>=3&&n.length>=3&&(n.indexOf(me)>-1||me.indexOf(n)>-1))return 1;return 0;};
  const pick=arr=>{const g={};arr.forEach(x=>{(g[x.tAtsNm]=g[x.tAtsNm]||[]).push(x);});let best=null,bs=0;Object.keys(g).forEach(t=>{const s=score(t);if(s>bs||(s===bs&&best&&g[t].length>g[best].length)){bs=s;best=t;}});return bs?g[best]:[];};
  const get=async(op,ym,extra)=>{const u='https://apis.data.go.kr/B551011/TarRlteTarService1/'+op+'?serviceKey='+encodeURIComponent(RLTE_KEY)+'&MobileOS=ETC&MobileApp=TourNavigator&_type=json&numOfRows='+(op==='areaBasedList1'?2000:100)+'&pageNo=1&baseYm='+ym+'&areaCd='+areaCd+'&signguCd='+signguCd+(extra||'');
    const j=await fetch(u).then(r=>r.json());const rc=String(((j.response||{}).header||{}).resultCode||'');if(rc&&rc!=='0000'&&rc!=='00')throw new Error(rc);
    const it=(((j.response||{}).body||{}).items||{}).item;return Array.isArray(it)?it:(it?[it]:[]);};
  // 검색어 후보: 전체 이름 → 첫 단어 → 앞 3글자
  const kws=[...new Set([kw,kw.split(/\s+/)[0],nz(kw).slice(0,3)].filter(k=>k&&k.length>=2))];
  const now=new Date(); let rows=[], ymHit='';
  try{
    for(const back of [2,3,4]){
      const d=new Date(now.getFullYear(),now.getMonth()-back,1);
      const ym=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0');
      for(const k of kws){rows=pick(await get('searchKeyword1',ym,'&keyword='+encodeURIComponent(k)));if(rows.length)break;}
      if(!rows.length){const ak='a|'+signguCd+'|'+ym;_rlteCache[ak]=_rlteCache[ak]||await get('areaBasedList1',ym);rows=pick(_rlteCache[ak]);}
      if(rows.length){ymHit=ym;break;}
    }
  }catch(e){}
  const out=[],seen={};
  rows.sort((a,b)=>Number(a.rlteRank||99)-Number(b.rlteRank||99)).forEach(x=>{const n=String(x.rlteTatsNm||'');if(!n||seen[n]||score(n)===3)return;seen[n]=1;
    out.push({name:n,cat:String(x.rlteCtgrySclsNm||x.rlteCtgryMclsNm||x.rlteCtgryLclsNm||''),region:[x.rlteRegnNm,x.rlteSignguNm].filter(Boolean).join(' '),rank:Number(x.rlteRank)||out.length+1,ym:ymHit,matched:rows[0]?rows[0].tAtsNm:''});});
  if(out.length)_rlteCache[ck]=out.slice(0,8);
  return out.slice(0,8);
}
