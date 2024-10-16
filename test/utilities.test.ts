import { expect } from 'vitest';
import { ElementHandle } from 'puppeteer';
import { page } from './setup.test';

export async function getByTestId(
	testId: string
): Promise<ElementHandle<Element>> {
	const element = await page.$(`[data-testid="${testId}"]`);
	if (!element) {
		throw new Error(`Element with test ID "${testId}" not found`);
	}
	return element;
}

export async function verifySignedOutNavbar() {
	await page.waitForSelector('[data-testid="nav-home"]');
	const homeLink = await getByTestId('nav-home');
	expect(homeLink).not.toBeNull();

	const createAccountLink = await getByTestId('nav-create-account');
	expect(createAccountLink).not.toBeNull();

	const signInLink = await getByTestId('nav-sign-in');
	expect(signInLink).not.toBeNull();

	const cartLink = await getByTestId('nav-cart');
	expect(cartLink).not.toBeNull();
}

export async function verifySignedInNavbar() {
	await page.waitForSelector('[data-testid="nav-home"]');
	const homeLink = await getByTestId('nav-home');
	expect(homeLink).not.toBeNull();

	const accountLink = await getByTestId('nav-account');
	expect(accountLink).not.toBeNull();

	const cartLink = await getByTestId('nav-cart');
	expect(cartLink).not.toBeNull();
}

export async function verifyFeedbackMessage(expectedMessage: string) {
	await page.waitForSelector('[data-testid="feedback-message"]', {
		visible: true,
	});

	const feedbackMessage = await page.$eval(
		'[data-testid="feedback-message"]',
		(element) => element.textContent
	);

	expect(feedbackMessage).toBe(expectedMessage);
}

export async function clickBookLink(slug: string) {
	const bookLink = await getByTestId(`book-link-${slug}`);
	if (!bookLink) {
		throw new Error(`Book link with slug "${slug}" not found`);
	}

	await Promise.all([
		bookLink.click(),
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
	]);

	const currentUrl = page.url();
	if (!currentUrl.endsWith(`/${slug}`)) {
		throw new Error(
			`Expected URL to end with /${slug}, but got ${currentUrl}`
		);
	}
}

export async function verifyClientCartItems(itemCount: number): Promise<void> {
	const cartLink = await getByTestId('nav-cart');
	expect(cartLink).not.toBeNull();

	if (cartLink) {
		const cartText = await cartLink.evaluate(
			(element) => element.textContent
		);

		if (itemCount === 0) {
			expect(cartText).toBe('Cart');
		} else {
			expect(cartText).toBe(`Cart (${itemCount})`);
		}
	}
}

export async function findInLocalStorageCart(string: string) {
	const cartContent = await page.evaluate(() => {
		return localStorage.getItem('cart');
	});

	if (!cartContent) {
		return false;
	}

	return cartContent.includes(string);
}

export async function verifyAddToCart(slug: string, expectedCartCount: number) {
	const toggleCartButton = await getByTestId(`cart-button-${slug}`);
	if (!toggleCartButton) {
		throw new Error(`'${slug}' toggle cart button not found`);
	}
	await Promise.all([
		toggleCartButton.click(),
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
	]);
	const currentUrl = page.url();
	expect(currentUrl).toMatch(/\/cart$/);
	await verifyClientCartItems(expectedCartCount);
	const cartContainsBook = await findInLocalStorageCart(
		`"slug":"${slug}","removed":false`
	);
	expect(cartContainsBook).toBe(true);
}
