'use client';
import { useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';

interface MenuItem {
	name: string;
	href: string;
	showWhen: 'always' | 'signedIn' | 'signedOut' | 'test';
	testID: string;
}

const menuItems: MenuItem[] = [
	{ name: 'Home', href: '/', showWhen: 'always', testID: 'nav-home' },
	{
		name: 'Create account',
		href: '/create-account',
		showWhen: 'signedOut',
		testID: 'nav-create-account',
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
];

function PlaceholderMenuItem() {
	return <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>;
}

export default function MenuBar() {
	const pathname = usePathname();
	const { signedIn, isLoading } = useAuth();
	const { cart } = useCart();

	const activeCartItems = useMemo(() => {
		return cart.filter((item) => !item.removed).length;
	}, [cart]);

	const visibleMenuItems = useMemo(() => {
		return menuItems.filter(
			(item) =>
				item.showWhen === 'always' ||
				(signedIn && item.showWhen === 'signedIn') ||
				(!signedIn && item.showWhen === 'signedOut')
		);
	}, [signedIn]);

	const formatCartText = useCallback((itemCount: number) => {
		if (itemCount === 0) {
			return 'Cart';
		}
		return (
			<>
				Cart (<span className="px-[2px]">{itemCount}</span>)
			</>
		);
	}, []);

	const renderMenuItem = useCallback(
		(menuItem: MenuItem, index: number) => (
			<li key={index}>
				<Link
					href={menuItem.href}
					className={clsx(
						'hover:underline',
						pathname === menuItem.href && 'underline'
					)}
					data-testid={menuItem.testID}
				>
					{menuItem.name === 'Cart'
						? formatCartText(activeCartItems)
						: menuItem.name}
				</Link>
			</li>
		),
		[pathname, activeCartItems, formatCartText]
	);

	const renderMenuItems = () => {
		if (isLoading) {
			const alwaysVisibleItems = menuItems.filter(
				(menuItem) => menuItem.showWhen === 'always'
			);

			return (
				<>
					{renderMenuItem(alwaysVisibleItems[0], 0)} {/* Home */}
					<PlaceholderMenuItem />
					<PlaceholderMenuItem />
					{alwaysVisibleItems.length > 1 &&
						renderMenuItem(alwaysVisibleItems[1], 1)}{' '}
					{/* Cart */}
				</>
			);
		}
		return visibleMenuItems.map(renderMenuItem);
	};

	return (
		<div className="sticky top-0 shadow-sm z-10 bg-white bg-opacity-90">
			<nav className={clsx('max-w-2xl mx-auto p-4')}>
				<ul className="flex flex-wrap gap-4">{renderMenuItems()}</ul>
			</nav>
		</div>
	);
}
