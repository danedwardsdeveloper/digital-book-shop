'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { useApiContext } from './Providers';

const displayAllItemsForTesting = false;

interface MenuItem {
	name: string;
	href: string;
	showWhen: 'always' | 'signedIn' | 'signedOut' | 'itemsInCart' | 'test';
}

const menuItems: MenuItem[] = [
	{ name: 'Home', href: '/', showWhen: 'always' },
	{ name: 'Create account', href: '/create-account', showWhen: 'signedOut' },
	{ name: 'Sign in', href: '/sign-in', showWhen: 'signedOut' },
	{ name: 'Account', href: '/account', showWhen: 'signedIn' },
	{ name: 'Cart', href: '/cart', showWhen: 'itemsInCart' },
];

export default function MenuBar() {
	const pathname = usePathname();
	const { signedIn, cart } = useApiContext();

	const hasItemsInCart = cart.length > 0;

	const visibleMenuItems = displayAllItemsForTesting
		? menuItems
		: menuItems.filter(
				(item) =>
					item.showWhen === 'always' ||
					(signedIn && item.showWhen === 'signedIn') ||
					(!signedIn && item.showWhen === 'signedOut') ||
					(hasItemsInCart && item.showWhen === 'itemsInCart')
		  );

	return (
		<div className="sticky top-0 shadow-sm z-10 bg-white bg-opacity-90">
			<nav className={clsx('max-w-2xl mx-auto p-4')}>
				<ul className="flex flex-wrap gap-4">
					{visibleMenuItems.map((menuItem, index) => (
						<li key={index}>
							<Link
								href={menuItem.href}
								className={clsx(
									'hover:underline',
									pathname === menuItem.href && 'underline'
								)}
							>
								{menuItem.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
