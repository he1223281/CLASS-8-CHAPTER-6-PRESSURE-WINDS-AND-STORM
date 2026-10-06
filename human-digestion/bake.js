// Pre-bakes the organ textures once at build time (so the lesson opens instantly).
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file://' + __dirname + '/digestion.html?rebake');
  await p.waitForFunction(() => !document.getElementById('loading'), null, { timeout: 120000 });
  const t = await p.evaluate(() => JSON.stringify(TEXI));
  require('fs').writeFileSync(__dirname + '/src/textures.json', t);
  console.log('textures', Math.round(t.length / 1024), 'KB');
  await b.close();
})();
