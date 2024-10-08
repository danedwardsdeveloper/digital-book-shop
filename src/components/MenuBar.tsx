'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

const signedIn = true;
const displayAllItemsForTesting = true;

interface MenuItem {
	name: string;
	href: string;
	showWhen: 'always' | 'signedIn' | 'signedOut' | 'test';
}

const menuItems: MenuItem[] = [
	{ name: 'Home', href: '/', showWhen: 'always' },
	{ name: 'Create account', href: '/create-account', showWhen: 'signedOut' },
	{ name: 'Sign in', href: '/sign-in', showWhen: 'signedOut' },
	{ name: 'Account', href: '/account', showWhen: 'signedIn' },
	{ name: 'Cart', href: '/cart', showWhen: 'always' },
	{ name: 'Checkout', href: '/checkout', showWhen: 'test' },
];

export default function MenuBar() {
	const pathname = usePathname();

	const visibleMenuItems = displayAllItemsForTesting
		? menuItems
		: menuItems.filter(
				(item) =>
					item.showWhen === 'always' ||
					(signedIn && item.showWhen === 'signedIn') ||
					(!signedIn && item.showWhen === 'signedOut')
		  );

	return (
		<nav className="sticky top-0 bg-gray-100 p-4 shadow-sm z-10">
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
	);
}
