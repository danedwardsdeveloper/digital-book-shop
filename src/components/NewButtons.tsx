'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { CartItem } from '@/types';
import { useState } from 'react';
import { useCart } from '@/components/Providers';

const baseStyles = clsx(
	'w-full p-2',
	'rounded',
	'font-semibold',
	'transition-colors duration-200'
	// focus states
);

const disabledStyles = 'cursor-not-allowed bg-gray-300 hover:bg-gray-300';

const variantMap = {
	primary: clsx('bg-blue-500 hover:bg-blue-600', 'text-white'),
	secondary: clsx(
		'bg-gray-200',
		'border border-gray-300',
		'hover:bg-gray-300',
		'active:bg-gray-400',
		'text-gray-800 hover:text-gray-900'
	),
	delete: clsx(
		'bg-red-400',
		'hover:bg-red-500',
		'active:bg-red-600',
		'text-black'
	),
};

type Variants = keyof typeof variantMap;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	type?: 'button' | 'submit';
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	variant?: Variants;
	disabled?: boolean;
	ariaLabel?: string;
	classes?: string;
}

export function Button({
	text,
	type = 'button',
	variant = 'primary',
	onClick,
	disabled,
	ariaLabel,
	classes,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
			className={clsx(
				baseStyles,
				variantMap[variant],
				disabled && disabledStyles,
				classes
			)}
		>
			{text}
		</button>
	);
}

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	classes: string;
}

export function NavButton() {
	return <button></button>;
}

/*
TextButton
    <button /> looks like text
- onClick
- disabled
- text
- aria label?
*/

interface TextButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	ariaLabel?: string;
}

export function TextButton({ text, onClick, ariaLabel }: TextButtonProps) {
	return (
		<button
			onClick={onClick}
			aria-label={ariaLabel}
			className="bg-none text-gray-500 hover:underline"
		>
			{text}
		</button>
	);
}

export function CartButtons({ slug }: CartItem) {
	const router = useRouter();
	const { isInCart, addToCart, removeFromCart } = useCart();
	const [isLoading, setIsLoading] = useState(false);

	const inCart = isInCart(slug);

	const handleAddToCart = async () => {
		setIsLoading(true);

		try {
			if (inCart) {
				await removeFromCart(slug);
			} else {
				await addToCart(slug);
				router.push('/cart');
			}
		} catch (error) {
			console.error('Error modifying cart:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Button
				text={
					inCart
						? 'Remove from cart'
						: isLoading
						? 'Adding...'
						: 'Add to cart'
				}
				onClick={handleAddToCart}
				variant={inCart ? 'secondary' : 'primary'}
			/>
		</>
	);
}

/* 
Button
    <button />
- onClick
- disabled
- text
- variant
- classes?
- aria label?

NavButton
    <Link /> styled to look like a button
    role="button"
- href
- text
- variant
- classes?
- aria label?
*/
