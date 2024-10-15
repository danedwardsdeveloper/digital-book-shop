import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupBrowser, closeBrowser, page } from './puppeteer';
import { getByTestId } from './puppeteer';

const BASE_URL = 'http://localhost:3000';

describe('Digital Book Shop', () => {
	beforeAll(async () => {
		await setupBrowser();
	});

	afterAll(async () => {
		await closeBrowser();
	});

	beforeEach(async () => {
		await page.goto(BASE_URL);

		const client = await page.target().createCDPSession();
		await client.send('Network.clearBrowserCookies');
		await client.send('Network.clearBrowserCache');

		await page.evaluate(() => {
			localStorage.clear();
		});

		await page.reload({ waitUntil: 'networkidle0' });
	});

	it('should have navigation elements', async () => {
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
		await page.goto(`${BASE_URL}/create-account`);

		await page.type('[data-test-id="name-input"]', 'Test');
		await page.type('[data-test-id="email-input"]', 'test@gmail.com');
		await page.type('[data-test-id="password-input"]', 'securePassword');
		await page.click('[data-test-id="create-account-button"]');

		await page.waitForNavigation();

		expect(page.url()).toBe(`${BASE_URL}`);
	});

	it('should delete the account', async () => {
		await page.goto(`${BASE_URL}/account`);

		const deleteButton = await getByTestId(page, 'delete-account-button');
		expect(deleteButton).not.toBeNull();

		if (deleteButton) {
			page.on('dialog', async (dialog) => {
				await dialog.accept();
			});

			await deleteButton.click();

			await page.waitForNavigation();

			const cookies = await page.cookies();
			const tokenCookie = cookies.find((cookie) => cookie.name === 'token');
			expect(tokenCookie).toBeUndefined();

			const cartItem = await page.evaluate(() =>
				localStorage.getItem('cart')
			);
			expect(cartItem).toBeNull();
		} else {
			throw new Error('Delete account button not found');
		}
	});
});
