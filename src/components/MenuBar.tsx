'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/providers/CartProvider'

type MenuItem = {
  name: string
  href: string
  showWhen: 'always' | 'signedIn' | 'signedOut'
  testID: string
  className?: string
}

const menuItems: MenuItem[] = [
  {
    name: 'Home',
    href: '/',
    showWhen: 'always',
    testID: 'nav-home',
    className: 'mr-auto',
  },
  {
    name: 'Create account',
    href: '/create-account',
    showWhen: 'signedOut',
    testID: 'nav-create-account',
    className: 'hidden sm:block',
  },
  {
    name: 'Sign in',
    href: '/sign-in',
    showWhen: 'signedOut',
    testID: 'nav-sign-in',
  },
  {
    name: 'Account',
    href: '/account',
    showWhen: 'signedIn',
    testID: 'nav-account',
  },
  {
    name: 'Cart',
    href: '/cart',
    showWhen: 'always',
    testID: 'nav-cart',
  },
]

function MenuContainer({ children }: { children: React.ReactNode }) {
  return (
    <nav className="sticky top-0 z-10 shadow-sm bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-2">
        <ul className="flex flex-wrap gap-4">{children}</ul>
      </div>
    </nav>
  )
}

function MenuItem({ item }: { item: MenuItem }) {
  const { cart } = useCart()
  const pathname = usePathname()
  const activeCartItems = cart.filter(cartItem => !cartItem.removed).length
  const isCart = item.name === 'Cart'
  const displayName = isCart && activeCartItems > 0 ? `Cart (${activeCartItems})` : item.name

  return (
    <Link
      href={item.href}
      className={clsx(
        'underline underline-offset-4 decoration-2',
        'transition-all duration-300',
        'focus:outline-2 outline-offset-4 rounded',
        item.className,
        {
          'decoration-transparent hover:decoration-black': pathname !== item.href,
          'decoration-black': pathname === item.href,
        },
      )}
      data-testid={item.testID}
      aria-current={pathname === item.href ? 'page' : undefined}
      aria-label={isCart ? `${displayName}, ${activeCartItems} items` : displayName}
      role="menuitem"
    >
      {displayName}
    </Link>
  )
}

function MenuItems({ signedIn }: { signedIn: boolean }) {
  const visibleItems = menuItems.filter(
    item =>
      item.showWhen === 'always' ||
      (signedIn && item.showWhen === 'signedIn') ||
      (!signedIn && item.showWhen === 'signedOut'),
  )

  return (
    <>
      {visibleItems.map(item => (
        <MenuItem key={item.testID} item={item} />
      ))}
    </>
  )
}

function LoadingMenu() {
  const alwaysItems = menuItems.filter(item => item.showWhen === 'always')

  return (
    <>
      <MenuItem item={alwaysItems[0]} />
      <div className="h-6 w-20 bg-gray-100 animate-pulse rounded" />
      <div className="h-6 w-20 bg-gray-100 animate-pulse rounded" />
      {alwaysItems[1] && <MenuItem item={alwaysItems[1]} />}
    </>
  )
}

export default function MenuBar() {
  const { signedIn, isLoading } = useAuth()

  return <MenuContainer>{isLoading ? <LoadingMenu /> : <MenuItems signedIn={signedIn} />}</MenuContainer>
}
