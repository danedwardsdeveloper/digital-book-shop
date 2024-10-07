'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

interface MenuItem {
	name: string;
	href: string;
	requireAuth: boolean;
}

const menuItems: MenuItem[] = [
	{ name: 'Books', href: '/', requireAuth: false },
	{ name: 'Create account', href: '/create-account', requireAuth: false },
	{ name: 'Sign in', href: '/sign-in', requireAuth: false },
	{ name: 'Account', href: '/account', requireAuth: true },
	{ name: 'Cart', href: '/cart', requireAuth: false },
];

export default function MenuBar() {
	const pathname = usePathname();

	return (
		<nav className="sticky top-0 bg-gray-100 p-4 shadow-sm z-10">
			<ul className="flex flex-wrap gap-4">
				{menuItems
					.filter((menuItem) => !menuItem.requireAuth)
					.map((menuItem, index) => (
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
