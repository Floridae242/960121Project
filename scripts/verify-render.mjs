// ตรวจสอบการ render ของ landing page ด้วย Playwright headless
// จับ screenshot ที่หลาย breakpoint + เช็ค console error + ยืนยันว่า 3D canvas mount
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";

// ใช้ full Chromium ที่โหลดเสร็จแล้ว เลี่ยงการรอ chrome-headless-shell บน hotspot ช้า
const CHROME = `${homedir()}/Library/Caches/ms-playwright/chromium-1223/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;

const URL = "http://localhost:5174/";
const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });

const breakpoints = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-375", width: 375, height: 812 },
];

const errors = [];
const browser = await chromium.launch({ executablePath: CHROME });

for (const bp of breakpoints) {
  const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${bp.name}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${bp.name}] PAGEERROR ${e.message}`));

  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
  const h1 = (await page.locator("h1").first().textContent())?.trim();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/${bp.name}-hero.png` });

  // scroll through in steps so IntersectionObserver / whileInView reveals fire
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/${bp.name}-full.png`, fullPage: true });

  // check for horizontal overflow (responsive correctness)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  if (bp.name === "desktop-1440") {
    const canvasCount = await page.locator("canvas").count();
    const chips = await page.locator("#classes-section button").allTextContents();
    const cats = chips.filter((c) => c && c.length < 30).slice(0, 8);
    console.log("H1:", JSON.stringify(h1));
    console.log("3D canvas elements:", canvasCount);
    console.log("category buttons:", cats.join(" | "));
  }
  console.log(`${bp.name}: horizontal overflow = ${overflow}px ${overflow > 2 ? "FAIL ⚠" : "OK"}`);
  await ctx.close();
}

await browser.close();
console.log("\nConsole/page errors:", errors.length);
for (const e of errors) console.log("  -", e);
console.log("Screenshots written to", OUT);
