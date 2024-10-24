'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';

type MenuItem = {
	name: string;
	href: string;
	showWhen: 'always' | 'signedIn' | 'signedOut';
	testID: string;
	className?: string;
};

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
		className: 'hidden md:block',
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

export default function MenuBar() {
	const pathname = usePathname();
	const { signedIn, isLoading } = useAuth();
	const { cart } = useCart();

	const activeCartItems = cart.filter((item) => !item.removed).length;

	const MenuItem = ({ item }: { item: MenuItem }) => {
		const isCart = item.name === 'Cart';
		const displayName =
			isCart && activeCartItems > 0
				? `Cart (${activeCartItems})`
				: item.name;

		return (
			<Link
				href={item.href}
				className={`hover:underline ${
					pathname === item.href ? 'underline' : ''
				} ${item.className || ''}`}
				data-testid={item.testID}
			>
				{displayName}
			</Link>
		);
	};

	if (isLoading) {
		const alwaysItems = menuItems.filter(
			(item) => item.showWhen === 'always'
		);
		return (
			<nav className="sticky top-0 z-10 shadow-sm bg-white/80 backdrop-blur border-b border-gray-200">
				<div className="max-w-2xl mx-auto px-4 py-2">
					<ul className="flex flex-wrap gap-4">
						<MenuItem item={alwaysItems[0]} />
						<div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
						<div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
						{alwaysItems[1] && <MenuItem item={alwaysItems[1]} />}
					</ul>
				</div>
			</nav>
		);
	}

	const visibleItems = menuItems.filter(
		(item) =>
			item.showWhen === 'always' ||
			(signedIn && item.showWhen === 'signedIn') ||
			(!signedIn && item.showWhen === 'signedOut')
	);

	return (
		<nav className="sticky top-0 z-10 shadow-sm bg-white/80 backdrop-blur border-b border-gray-200">
			<div className="max-w-2xl mx-auto px-4 py-2">
				<ul className="flex flex-wrap gap-4">
					{visibleItems.map((item, index) => (
						<MenuItem key={index} item={item} />
					))}
				</ul>
			</div>
		</nav>
	);
}
