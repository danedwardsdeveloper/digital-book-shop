import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupBrowser, closeBrowser, page } from './puppeteer';

const BASE_URL = 'http://localhost:3000';

describe('Home Page', () => {
	beforeAll(async () => {
		await setupBrowser();
	});

	afterAll(async () => {
		await closeBrowser();
	});

	it('should load the home page', async () => {
		await page.goto(BASE_URL);
		const title = await page.title();
		expect(title).toBe('Your Expected Title');
	});

	it('should have a welcome message', async () => {
		await page.goto(BASE_URL);
		const welcomeText = await page.$eval('h1', (el) => el.textContent);
		expect(welcomeText).toContain('Welcome');
	});
});
