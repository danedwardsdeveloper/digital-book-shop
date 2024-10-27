import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { page, setupTest, closeBrowser, baseURL } from './setup.test';
import {
	verifySignedInNavbar,
	verifySignedOutNavbar,
	verifyFeedbackMessage,
	clickBookLink,
	createAccount,
	continueShopping,
	addToCart,
	findInLocalStorageCart,
	expectCartCountToBe,
	verifyButton,
	removeFromCart,
	clickNavLink,
	waitForNavigationComplete,
	clickElement,
	expectUrlToBe,
} from './utilities.test';

beforeAll(async () => {
	await setupTest();
});

afterAll(async () => {
	await closeBrowser();
});

describe('Digital Book Shop', () => {
	describe('Signed-out functionality', () => {
		it('should display correct navbar items when signed out', async () => {
			await page.goto(baseURL, {
				waitUntil: 'networkidle0',
			});
			await verifySignedOutNavbar();
		});

		describe('Add books to cart', () => {
			it('should add Dracula', async () => {
				await clickBookLink('dracula');
				await verifyButton('cart-button-dracula', 'Add to cart');
				await addToCart('dracula');
				await expectCartCountToBe(1);
				await findInLocalStorageCart(`"dracula":false`);
				await continueShopping();
			});

			it('should add Jane Eyre', async () => {
				await clickBookLink('jane-eyre');
				await verifyButton('cart-button-jane-eyre', 'Add to cart');
				await addToCart('jane-eyre');
				await expectCartCountToBe(2);
				await findInLocalStorageCart(`"jane-eyre":false`);
				await continueShopping();
			});

			it('should add Wuthering Heights', async () => {
				await clickBookLink('wuthering-heights');
				await verifyButton('cart-button-wuthering-heights', 'Add to cart');
				await addToCart('wuthering-heights');
				await expectCartCountToBe(3);
				await findInLocalStorageCart(`"wuthering-heights":false`);
				await continueShopping();
			});
		});

		describe('Remove books from cart', () => {
			it('should remove Wuthering Heights', async () => {
				await clickBookLink('wuthering-heights');
				await verifyButton(
					'cart-button-wuthering-heights',
					'Remove from cart'
				);
				await removeFromCart('wuthering-heights');
				await expectCartCountToBe(2);
				await findInLocalStorageCart(`"wuthering-heights":true`);
				await clickNavLink('nav-home', '/');
			});
		});
	});

	describe('Create account', () => {
		it('should create an account', async () => {
			await createAccount();
			expect(page.url()).toBe(baseURL);
			await verifyFeedbackMessage(
				'Welcome Test! Your account has been created.'
			);
		});

		it('should still have 2 items in the cart', async () => {
			await expectCartCountToBe(2);
		});

		it('should display signed-in menu items', async () => {
			await page.goto(baseURL, {
				waitUntil: 'networkidle0',
			});
			await verifySignedInNavbar();
		});

		it('should add Wuthering Heights', async () => {
			await clickBookLink('wuthering-heights');
			await verifyButton('cart-button-wuthering-heights', 'Add to cart');
			await addToCart('wuthering-heights');
			await expectCartCountToBe(3);
			await findInLocalStorageCart(`"wuthering-heights":false`);
			await continueShopping();
		});
	});

	describe('Sign out', () => {
		it('should sign out', async () => {
			await clickElement('nav-account');
			await clickElement('sign-out-button');
			await expectUrlToBe('/');
		});

		it(`should have deleted the "token" cookie and "cart" local storage`, async () => {
			const cookies = await page.cookies();
			const tokenCookie = cookies.find((cookie) => cookie.name === 'token');
			expect(tokenCookie).toBeUndefined();
			const cartItem = await page.evaluate(() =>
				localStorage.getItem('cart')
			);
			expect(cartItem).toBeNull();
		});

		it('should have no items in the cart', async () => {
			await expectCartCountToBe(0);
		});

		it('should add Madame Bovary', async () => {
			await clickBookLink('madame-bovary');
			await verifyButton('cart-button-madame-bovary', 'Add to cart');
			await addToCart('madame-bovary');
			await expectCartCountToBe(1);
			await findInLocalStorageCart(`"madame-bovary":false`);
			await continueShopping();
		});
	});

	describe('Sign in', () => {
		it('should sign in', async () => {
			await clickElement('nav-sign-in');
			await clickElement('sign-out-button');
			await expectUrlToBe('/');
		});

		it('should display signed-in menu items', async () => {
			await page.goto(baseURL, {
				waitUntil: 'networkidle0',
			});
			await verifySignedInNavbar();
		});

		it('should have 4 items in the cart', async () => {
			await expectCartCountToBe(4);
		});
	});

	describe('Delete account', () => {
		it('should delete the account', async () => {
			await page.goto(`${baseURL}account`);
			const dialogPromise = new Promise<void>((resolve) => {
				page.once('dialog', async (dialog) => {
					console.log('Dialog appeared:', dialog.message());
					expect(dialog.message()).toContain(
						'Are you sure you want to delete your account?\nAccess to purchased books will be lost.'
					);
					await dialog.accept();
					console.log('Dialog accepted');
					resolve();
				});
			});
			await clickElement('delete-account-button');
			await Promise.all([dialogPromise, waitForNavigationComplete()]);
		});

		it(`should display an 'account deleted' message`, async () => {
			expect(page.url()).toBe(baseURL);
			await verifyFeedbackMessage('Account deleted successfully');
		});

		it(`should have deleted the "token" cookie and "cart" local storage`, async () => {
			const cookies = await page.cookies();
			const tokenCookie = cookies.find((cookie) => cookie.name === 'token');
			expect(tokenCookie).toBeUndefined();
			const cartItem = await page.evaluate(() =>
				localStorage.getItem('cart')
			);
			expect(cartItem).toBeNull();
		});
	});
});
