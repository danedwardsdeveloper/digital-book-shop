// @ts-nocheck

describe.skip('Other tests', () => {
	it('should add Madame Bovary', async () => {
		await clickBookLink('madame-bovary');
		await verifyButton('cart-button-madame-bovary', 'Add to cart');
		await addToCart('madame-bovary');
		await verifyClientCartItems(4);
		await findInLocalStorageCart(`"madame-bovary":false`);
		await continueShopping();
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
		expect(currentUrl).toBe(`${baseURL}account`);
	}, 30000);

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
});
