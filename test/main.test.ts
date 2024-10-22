import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { page, closeBrowser } from './setup.test';
import {
	verifySignedInNavbar,
	verifySignedOutNavbar,
	verifyFeedbackMessage,
	getByTestId,
	clickBookLink,
	verifyAddToCart,
} from './utilities.test';
import { setupTest, BASE_URL } from './setup.test';

describe('Digital Book Shop', () => {
	beforeAll(async () => {
		await setupTest();
	});

	afterAll(async () => {
		await closeBrowser();
	});

	it('should display correct navbar items when signed out', async () => {
		await page.goto(BASE_URL);
		await verifySignedOutNavbar();
	});

	it('should create an account', async () => {
		await page.goto(`${BASE_URL}/create-account`, {
			waitUntil: 'networkidle0',
		});
		await page.waitForSelector('[data-testid="name-input"]');
		await page.type('[data-testid="name-input"]', 'Test');
		await page.type('[data-testid="email-input"]', 'test@gmail.com');
		await page.type('[data-testid="password-input"]', 'securePassword');
		await Promise.all([
			page.click('[data-testid="create-account-button"]'),
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
		expect(page.url()).toBe(BASE_URL);
		await verifyFeedbackMessage(
			'Welcome Test! Your account has been created.'
		);
	});

	it('should display signed-in navbar items after creating an account', async () => {
		await page.goto(BASE_URL, {
			waitUntil: 'networkidle0',
		});
		await verifySignedInNavbar();
	});

	it('should add a book to the cart', async () => {
		await clickBookLink('dracula');
		await verifyAddToCart('dracula', 1);
	});

	it('should redirect to "checkout.stripe.com" after clicking the "Checkout" button', async () => {
		const checkoutButton = await getByTestId('checkout-button');

		await Promise.all([
			checkoutButton.click(),
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);

		const currentUrl = page.url();
		expect(currentUrl).toMatch(/^https:\/\/checkout\.stripe\.com/);
	}, 10000);

	it('should complete Stripe checkout form and redirect to account page', async () => {
		await page.type('#email', 'test@gmail.com');
		await page.type('#cardNumber', '4242424242424242');
		await page.type('#cardExpiry', '0130');
		await page.type('#cardCvc', '123');
		await page.type('#billingName', 'Test Person');
		await page.select('#billingCountry', 'GB');
		await page.waitForSelector('#billingPostalCode', {
			visible: true,
			timeout: 5000,
		});
		await page.type('#billingPostalCode', 'SW1A 1AA');
		const submitButton = await getByTestId('hosted-payment-submit-button');
		await Promise.all([
			submitButton.click(),
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
		]);
		const currentUrl = page.url();
		expect(currentUrl).toBe(`${BASE_URL}account`);
	}, 30000);
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	it(`shows the purchased book in the "Purchase history" table with 5 downloads remaining`, async () => {
		const downloadButton = await getByTestId('dracula-download-button');
		const downloadButtonText = await downloadButton.evaluate(
			(element) => element.textContent
		);
		expect(downloadButtonText).toBe('Download');

		const downloadsRemaining = await getByTestId(
			'dracula-downloads-remaining'
		);
		const downloadsRemainingText = await downloadsRemaining.evaluate(
			(element) => element.textContent
		);
		expect(downloadsRemainingText).toBe('5');
	});

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	it('should delete the account', async () => {
		await page.goto(`${BASE_URL}/account`, { waitUntil: 'networkidle0' });
		await page.waitForSelector('[data-testid="delete-account-button"]', {
			visible: true,
			timeout: 5000,
		});
		const deleteButton = await page.$(
			'[data-testid="delete-account-button"]'
		);
		expect(deleteButton).not.toBeNull();
		page.on('dialog', async (dialog) => {
			expect(dialog.message()).toContain(
				'Are you sure you want to delete your account?'
			);
			await dialog.accept();
		});
		await deleteButton?.click();
		await page.waitForNavigation({ waitUntil: 'networkidle0' });
	});

	it(`should display an 'account deleted' message`, async () => {
		expect(page.url()).toBe(BASE_URL);
		await verifyFeedbackMessage('Account deleted successfully');
	});

	it(`"token" cookie and "cart" local storage should not exist after account deletion`, async () => {
		const cookies = await page.cookies();
		const tokenCookie = cookies.find((cookie) => cookie.name === 'token');
		expect(tokenCookie).toBeUndefined();
		const cartItem = await page.evaluate(() => localStorage.getItem('cart'));
		expect(cartItem).toBeNull();
	});
});
