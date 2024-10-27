import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: [
			'node_modules',
			'dist',
			'.idea',
			'.git',
			'.cache',
			'test/setup.test.ts',
			'test/utilities.test.ts',
			'test/work-in-progress.test.ts',
		],
		// watch: true,
		testTimeout: 20000,
	},
});
