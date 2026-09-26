// 구성도.html → 시스템_구성도.png (2배 해상도)
//   npm i playwright   (또는 NODE_PATH 로 전역 playwright 지정)   ·  브라우저: 설치된 Chromium (CHROME 환경변수로 경로 지정 가능)
//   LOCAL_FONT_DIR=<woff2 폴더> 를 주면 Google Fonts 대신 로컬 Noto Sans KR 을 쓴다 (오프라인 렌더용)
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
let html = fs.readFileSync(path.join(here, '구성도.html'), 'utf8');
if (process.env.LOCAL_FONT_DIR) {
  const d = process.env.LOCAL_FONT_DIR;
  html = html.replace('/*LOCAL_FONT*/', `@font-face{font-family:"NotoKR";src:url("file://${d}/noto-sans-kr-korean-400-normal.woff2") format("woff2");font-weight:400}\n@font-face{font-family:"NotoKR";src:url("file://${d}/noto-sans-kr-korean-700-normal.woff2") format("woff2");font-weight:700}`);
}
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const page = await browser.newPage({ viewport: { width: 1600, height: 1225 }, deviceScaleFactor: 2 });
const tmp = path.join(here, '.render.tmp.html'); fs.writeFileSync(tmp, html);   // file:// 로 열어야 로컬 폰트가 읽힌다
await page.goto('file://' + tmp, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
await page.locator('#c').screenshot({ path: path.join(here, '시스템_구성도.png') });
const over = await page.evaluate(() => [...document.querySelectorAll('.box')].filter(b => !b.classList.contains('group') && b.scrollHeight > b.clientHeight + 2).map(b => (b.querySelector('.t') || b).textContent.slice(0, 30)));
console.log('시스템_구성도.png 저장', over.length ? '· 글자 넘침: ' + JSON.stringify(over) : '· 넘침 없음');
await browser.close(); fs.unlinkSync(tmp);
