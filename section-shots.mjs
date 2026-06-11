import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';

const url = process.argv[2] || 'http://localhost:3000';
const outDir = './temporary screenshots/sections';
await mkdir(outDir, { recursive: true });

const sections = ['top', 'process', 'why', 'about', 'services'];

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 500));

for (const id of sections) {
  await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, id);
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${outDir}/${id}.png` });
  console.log(`Saved ${outDir}/${id}.png`);
}

await browser.close();
