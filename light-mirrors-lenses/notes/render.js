const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/notes.html'); await p.evaluate(() => document.fonts.ready);
  const fam = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length);
  console.log('fonts loaded', fam);
  const foot = '<div style="width:100%;font-family:Poppins,sans-serif;font-size:8px;color:#56668a;padding:0 12mm;display:flex;justify-content:space-between;align-items:center"><span style="line-height:1"><b style="font-size:8.5px;letter-spacing:.08em;color:#10254d">ABHIMANYU</b><br><span style="font-size:6px;letter-spacing:.22em;color:#10254d">ACADEMY</span></span><span>Light: Mirrors and Lenses · Class 8 Science · Chapter 10</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>';
  await p.pdf({ path: 'Light-Mirrors-and-Lenses-Notes.pdf', format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<div></div>', footerTemplate: foot, margin: { top: '11mm', bottom: '15mm', left: '12mm', right: '12mm' } });
  await b.close();
})();
