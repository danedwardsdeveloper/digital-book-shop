import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser;
let page: Page;

export async function setupBrowser() {
	browser = await puppeteer.launch();
	page = await browser.newPage();
}

export async function closeBrowser() {
	await browser.close();
}

export async function getByTestId(page: Page, testId: string) {
	return await page.$(`[data-test-id="${testId}"]`);
}

export { browser, page };
