const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto('file:///home/mh/projects/fieldkit/public/patch-panel/index.html');
  await page.fill('#siteName', 'NLS Security — Server Room');
  await page.waitForTimeout(300);

  const ports = [
    { type: 'PC', label: 'Desk 01', colour: 'blue' },
    { type: 'PC', label: 'Desk 02', colour: 'blue' },
    { type: 'Phone', label: 'Reception', colour: 'green' },
    { type: 'Spare', label: '', colour: null },
    { type: 'Server', label: 'DC01', colour: 'red' },
    { type: 'Printer', label: 'HP LaserJet', colour: 'orange' },
    { type: 'AP', label: 'WAP-01', colour: 'yellow' },
    { type: 'Camera', label: 'NVR-01', colour: 'grey' },
  ];

  for (let i = 0; i < ports.length; i++) {
    // Re-query ports each time since DOM rebuilds
    const portEls = await page.$$('.port');
    await portEls[i].click();
    await page.waitForSelector('.modal-overlay.open');
    await page.selectOption('#editType', ports[i].type);
    if (ports[i].label) await page.fill('#editLabel', ports[i].label);
    if (ports[i].colour) await page.click(`[data-colour="${ports[i].colour}"]`);
    await page.click('.modal-footer .btn.primary');
    await page.waitForSelector('.modal-overlay:not(.open)');
  }

  await page.screenshot({ path: '/tmp/patch-filled.png' });
  await browser.close();
})();
