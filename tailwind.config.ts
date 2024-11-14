import aspectRatio from '@tailwindcss/aspect-ratio'
import { type Config } from 'tailwindcss'

export default {
  plugins: [aspectRatio],
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
} satisfies Config
