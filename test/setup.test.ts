import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser;
let page: Page;

export const baseURL = 'http://localhost:3000/';

export async function setupTest() {
	browser = await puppeteer.launch({
		headless: false,
		slowMo: 20,
		// devtools: true,
		defaultViewport: {
			width: 1920,
			height: 1080,
		},
	});
	page = await browser.newPage();

	await page.goto(baseURL, { waitUntil: 'networkidle0' });

	const session = await page.createCDPSession();
	await session.send('Network.clearBrowserCookies');
	await session.send('Network.clearBrowserCache');

	await page.evaluate(() => {
		localStorage.clear();
	});

	await page.reload({ waitUntil: 'networkidle0' });
}

export async function closeBrowser() {
	await browser.close();
}

export { browser, page };
