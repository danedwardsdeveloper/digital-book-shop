import clsx from 'clsx';
import Link from 'next/link';

const baseButtonStyles = clsx(
	'font-semibold',
	'w-full p-2',
	'rounded-md',
	'transition-colors duration-200'
);

const primaryColourStyles = clsx(
	'bg-gray-400',
	'hover:bg-gray-500',
	'active:bg-gray-600',
	'text-black'
);

const secondaryColourStyles = clsx(
	'bg-gray-200',
	'border border-gray-300',
	'hover:bg-gray-300',
	'active:bg-gray-400',
	'text-gray-800 hover:text-gray-900'
);

const deleteColorStyles = clsx(
	'bg-red-400',
	'hover:bg-red-500',
	'active:bg-red-600',
	'text-black'
);

interface SubmitButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	cta: 'Sign in' | 'Create account' | 'Buy now' | 'Add to cart' | 'Sign out';
	variant?: 'primary' | 'secondary';
	classes?: string;
}

export function SubmitButton({
	cta,
	type = 'submit',
	variant = 'primary',
	classes,
	...props
}: SubmitButtonProps) {
	const colourStyles =
		variant === 'primary' ? primaryColourStyles : secondaryColourStyles;
	return (
		<button
			type={type}
			className={clsx(baseButtonStyles, colourStyles, classes)}
			{...props}
		>
			{cta}
		</button>
	);
}

interface DeleteButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	classes?: string;
}

export function DeleteButton({ classes, ...props }: DeleteButtonProps) {
	return (
		<button
			type="button"
			className={clsx(baseButtonStyles, deleteColorStyles, classes)}
			{...props}
		>
			Delete account
		</button>
	);
}

interface NavButtonProps {
	href: string;
	cta: string;
	variant?: 'primary' | 'secondary';
}

export function NavButton({ href, cta, variant = 'primary' }: NavButtonProps) {
	const colourStyles =
		variant === 'primary' ? primaryColourStyles : secondaryColourStyles;

	return (
		<Link
			href={href}
			className={clsx('text-center', baseButtonStyles, colourStyles)}
		>
			{cta}
		</Link>
	);
}
