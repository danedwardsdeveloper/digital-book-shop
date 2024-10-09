'use client';
import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { CartItem } from '@/types';
import { useCart } from '@/hooks/useCart';

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
	cta:
		| 'Sign in'
		| 'Create account'
		| 'Buy now'
		| 'Add to cart'
		| 'Sign out'
		| 'In cart'
		| 'Adding...';
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

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	href: string;
	cta: string;
	variant?: 'primary' | 'secondary';
}

export function NavButton({
	href,
	cta,
	variant = 'primary',
	...props
}: NavButtonProps) {
	const colourStyles =
		variant === 'primary' ? primaryColourStyles : secondaryColourStyles;

	return (
		<button
			className={clsx('text-center', baseButtonStyles, colourStyles)}
			{...props}
		>
			<Link
				href={href}
				className="w-full h-full flex items-center justify-center"
			>
				{cta}
			</Link>
		</button>
	);
}

export function CartButton({ slug }: CartItem) {
	const { addToCart, isInCart } = useCart();
	const [isLoading, setIsLoading] = useState(false);
	const inCart = isInCart(slug);

	const handleAddToCart = async () => {
		if (inCart) return;

		setIsLoading(true);
		try {
			await addToCart(slug);
		} catch (error) {
			console.error('Error adding item to cart:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SubmitButton
			classes={'my-8'}
			cta={inCart ? 'In cart' : isLoading ? 'Adding...' : 'Add to cart'}
			onClick={handleAddToCart}
			disabled={inCart || isLoading}
		/>
	);
}

interface ToggleCartButtonProps {
	slug: string;
	isRemoved: boolean;
	onToggle: (slug: string) => void;
}

export function ToggleCartButton({
	slug,
	isRemoved,
	onToggle,
}: ToggleCartButtonProps) {
	const handleToggle = async () => {
		onToggle(slug);
	};

	return (
		<button
			onClick={handleToggle}
			className="text-gray-500 hover:underline focus:outline-none lowercase"
		>
			{isRemoved ? 'add' : 'remove'}
		</button>
	);
}
