// @ts-nocheck
import puppeteer from 'puppeteer';

async function recordScrollingVideo(url, options = {}) {
	const {
		outputPath = 'scroll-recording.webm',
		viewport = { width: 1920, height: 1080 },
		scrollDuration = 3000, // Duration for one-way scroll in ms
		frameRate = 60,
		pauseAtEnds = 500, // Pause duration at top/bottom in ms
	} = options;

	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox'],
	});

	try {
		const page = await browser.newPage();
		await page.setViewport(viewport);

		// Navigate to the URL
		await page.goto(url, { waitUntil: 'networkidle0' });

		// Start recording
		await page.evaluate(() => (document.documentElement.scrollTop = 0));
		const recording = await page.screencast({
			path: outputPath,
			fps: frameRate,
		});

		// Get page dimensions
		const pageHeight = await page.evaluate(
			() => document.documentElement.scrollHeight
		);
		const viewportHeight = await page.evaluate(() => window.innerHeight);
		const scrollDistance = pageHeight - viewportHeight;

		// Scroll down smoothly
		await page.evaluate((duration) => {
			return new Promise((resolve) => {
				const start = window.scrollY;
				const end =
					document.documentElement.scrollHeight - window.innerHeight;
				const startTime = performance.now();

				function scroll() {
					const currentTime = performance.now();
					const progress = (currentTime - startTime) / duration;

					if (progress < 1) {
						const scrollPos = start + (end - start) * progress;
						window.scrollTo(0, scrollPos);
						requestAnimationFrame(scroll);
					} else {
						window.scrollTo(0, end);
						resolve();
					}
				}

				requestAnimationFrame(scroll);
			});
		}, scrollDuration);

		// Pause at bottom
		await page.waitForTimeout(pauseAtEnds);

		// Scroll back up smoothly
		await page.evaluate((duration) => {
			return new Promise((resolve) => {
				const start = window.scrollY;
				const startTime = performance.now();

				function scroll() {
					const currentTime = performance.now();
					const progress = (currentTime - startTime) / duration;

					if (progress < 1) {
						const scrollPos = start * (1 - progress);
						window.scrollTo(0, scrollPos);
						requestAnimationFrame(scroll);
					} else {
						window.scrollTo(0, 0);
						resolve();
					}
				}

				requestAnimationFrame(scroll);
			});
		}, scrollDuration);

		// Pause at top before ending
		await page.waitForTimeout(pauseAtEnds);

		// Stop recording
		await recording.stop();
	} catch (error) {
		console.error('Error during recording:', error);
	} finally {
		await browser.close();
	}
}

// Example usage
(async () => {
	await recordScrollingVideo('https://your-website.com', {
		outputPath: 'website-scroll.webm',
		viewport: { width: 1920, height: 1080 },
		scrollDuration: 3000,
		frameRate: 60,
		pauseAtEnds: 500,
	});
})();
