import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  })

  const page = await browser.newPage();
  // await page.goto("https://flipkart.com/", {
  //   waitUntil: "networkidle0",
  // });
  await page.setContent('<h1>Testing puppeteer</h1>');
  await page.setViewport({ width: 1080, height: 1024 });
  console.log("page loaded")
  await page.pdf({
    path: 'flipkart.pdf'
  })

  await browser.close();
})()
