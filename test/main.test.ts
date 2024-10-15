import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupBrowser, closeBrowser, page } from './puppeteer';
import { getByTestId } from './puppeteer';

const BASE_URL = 'http://localhost:3000/';

describe('Digital Book Shop', () => {
	beforeAll(async () => {
		await setupBrowser();

		await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

		const session = await page.createCDPSession();
		await session.send('Network.clearBrowserCookies');
		await session.send('Network.clearBrowserCache');

		await page.evaluate(() => {
			localStorage.clear();
		});

		await page.reload({ waitUntil: 'networkidle0' });
	});

	afterAll(async () => {
		await closeBrowser();
	});

	it('should have signed-out navigation elements', async () => {
		await page.waitForSelector('[data-test-id="nav-home"]');
		const homeLink = await getByTestId(page, 'nav-home');
		expect(homeLink).not.toBeNull();

		const createAccountLink = await getByTestId(page, 'nav-create-account');
		expect(createAccountLink).not.toBeNull();

		const signInLink = await getByTestId(page, 'nav-sign-in');
		expect(signInLink).not.toBeNull();

		const cartLink = await getByTestId(page, 'nav-cart');
		expect(cartLink).not.toBeNull();
	});

	it('should create an account', async () => {
		await page.goto(`${BASE_URL}/create-account`, {
			waitUntil: 'networkidle0',
		});

		await page.waitForSelector('[data-test-id="name-input"]');
		await page.type('[data-test-id="name-input"]', 'Test');
		await page.type('[data-test-id="email-input"]', 'test@gmail.com');
		await page.type('[data-test-id="password-input"]', 'securePassword');

		await Promise.all([
			page.click('[data-test-id="create-account-button"]'),
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);

		expect(page.url()).toBe(BASE_URL);

		await page.waitForSelector('[data-test-id="feedback-message"]', {
			visible: true,
		});
		const feedbackMessage = await page.$eval(
			'[data-test-id="feedback-message"]',
			(element) => element.textContent
		);
		expect(feedbackMessage).toBe(
			'Welcome Test! Your account has been created.'
		);
	});

	it('should delete the account', async () => {
		await page.goto(`${BASE_URL}/account`, { waitUntil: 'networkidle0' });

		await page.waitForSelector('[data-test-id="delete-account-button"]', {
			visible: true,
			timeout: 5000,
		});
		const deleteButton = await page.$(
			'[data-test-id="delete-account-button"]'
		);
		expect(deleteButton).not.toBeNull();

		page.on('dialog', async (dialog) => {
			expect(dialog.message()).toContain(
				'Are you sure you want to delete your account?'
			);
			await dialog.accept();
		});

		await deleteButton!.click();

		await page.waitForNavigation({ waitUntil: 'networkidle0' });
	});

	it(`should display an 'account deleted' message`, async () => {
		expect(page.url()).toBe(BASE_URL);

		await page.waitForSelector('[data-test-id="feedback-message"]', {
			visible: true,
		});
		const feedbackMessage = await page.$eval(
			'[data-test-id="feedback-message"]',
			(element) => element.textContent
		);
		expect(feedbackMessage).toBe('Account deleted successfully');
	});

	it(`Cookies and local storage should be cleared`, async () => {
		const cookies = await page.cookies();
		const tokenCookie = cookies.find((cookie) => cookie.name === 'token');
		expect(tokenCookie).toBeUndefined();

		const cartItem = await page.evaluate(() => localStorage.getItem('cart'));
		expect(cartItem).toBeNull();
	});
});
