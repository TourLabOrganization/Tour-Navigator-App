// Tour Navigator — 화면 공용 코드
// 홈을 제외한 6개 화면(플래너 + 테마 5종)이 함께 쓰는 상수와 순수 함수.
// config.js 다음, 화면 파일보다 먼저 로드된다.
// 화면별로 값이 다른 것(DATA · I18N · ORIGINS · STAYS · TRANSIT)은 각 화면 파일에 남아 있다.

// Kakao REST 키 (config.js)
const KAKAO_KEY=(window.APP_CONFIG||{}).kakao||'';

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

// 기상청 단기예보 조회 (어제·오늘·내일). 실패 시 물음표 값을 돌려준다
const getWeather=async(lat,lng)=>{
  try{
    const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Asia/Seoul&past_days=1&forecast_days=3`);
    const data=await res.json();
    if(data.daily){
      const today=1;
      const getIcon=(code)=>code===0?'☀️':code===1||code===2?'☁️':code===3?'☁️':code===45||code===48?'🌫️':code>=51&&code<=67?'🌧️':code>=71&&code<=77?'❄️':code===80||code===81||code===82?'⛈️':'🌡️';
      return {
        yesterday:{tmp:Math.round(data.daily.temperature_2m_max[0])+'°C',rn1:(data.daily.precipitation_sum[0]||0).toFixed(1),icon:getIcon(data.daily.weather_code[0])},
        today:{tmp:Math.round(data.daily.temperature_2m_max[today])+'°C',rn1:(data.daily.precipitation_sum[today]||0).toFixed(1),icon:getIcon(data.daily.weather_code[today])},
        tomorrow:{tmp:Math.round(data.daily.temperature_2m_max[2])+'°C',rn1:(data.daily.precipitation_sum[2]||0).toFixed(1),icon:getIcon(data.daily.weather_code[2])}
      };
    }
  }catch(e){}
  return {yesterday:{tmp:'?',rn1:'0',icon:'?'},today:{tmp:'?',rn1:'0',icon:'?'},tomorrow:{tmp:'?',rn1:'0',icon:'?'}};
};

