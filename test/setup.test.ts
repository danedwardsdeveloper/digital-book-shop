import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
// import { setupBrowser, page } from './puppeteer';

let browser: Browser;
let page: Page;

export const BASE_URL = 'http://localhost:3000/';

export async function setupTest() {
	browser = await puppeteer.launch();
	page = await browser.newPage();

	await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

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
