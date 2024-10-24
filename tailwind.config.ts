import { type Config } from 'tailwindcss';

const config: Config = {
	plugins: [require('@tailwindcss/aspect-ratio')],
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
		},
	},
};
export default config;
