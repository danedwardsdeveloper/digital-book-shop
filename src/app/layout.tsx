import clsx from 'clsx'
import type { Metadata, Viewport } from 'next'

import '@/library/globals.tailwind.css'

import MenuBar from '../components/MenuBar'
import { Providers } from '../components/Providers'

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
}

export const metadata: Metadata = {
  title: 'Digital Book Shop',
  description: 'A MERN eCommerce site selling digital editions of classic novels.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB">
      <body>
        <Providers>
          <MenuBar />
          <div className={clsx('max-w-2xl mx-auto', 'min-h-screen')}>
            <main className="p-4 pb-40">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
