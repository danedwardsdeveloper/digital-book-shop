'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { type ApiResponse } from '@/types';

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
	dataTestID?: string;
	disabled?: boolean;
	ariaLabel?: string;
	classes?: string;
}

export function Button({
	text,
	type = 'button',
	variant = 'primary',
	dataTestID,
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
			data-testid={dataTestID}
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

interface TextButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	dataTestID?: string;
	ariaLabel?: string;
}

export function TextButton({
	text,
	onClick,
	ariaLabel,
	dataTestID,
}: TextButtonProps) {
	return (
		<button
			onClick={onClick}
			aria-label={ariaLabel}
			className="bg-none text-gray-500 hover:underline"
			data-testid={dataTestID}
		>
			{text}
		</button>
	);
}

interface CartButtonProps {
	slug: string;
	variant: 'button' | 'text';
	dataTestID?: string;
}

export function CartButton({ slug, variant, dataTestID }: CartButtonProps) {
	const router = useRouter();
	const { isInCart, toggleCartItem } = useCart();
	const { updateApiResponse, signedIn } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const inCart = isInCart(slug);

	const handleToggleCart = async () => {
		setIsLoading(true);

		try {
			await toggleCartItem(slug);

			if (signedIn) {
				const endpoint = inCart
					? `/api/cart/remove/${slug}`
					: `/api/cart/add/${slug}`;
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const data: ApiResponse = await response.json();

				if (response.ok && data.status === 'success') {
					updateApiResponse(data);
					if (!inCart) {
						router.push('/cart');
					}
				} else {
					console.error('Error modifying cart:', data.message);
					updateApiResponse({
						status: 'error',
						message: data.message || 'Failed to modify cart',
					});
				}
			} else if (!inCart) {
				router.push('/cart');
			}
		} catch (error) {
			console.error('Error modifying cart:', error);
			updateApiResponse({
				status: 'error',
				message: 'An unexpected error occurred',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return variant === 'button' ? (
		<Button
			text={
				inCart
					? 'Remove from cart'
					: isLoading
					? 'Updating...'
					: 'Add to cart'
			}
			onClick={handleToggleCart}
			variant={inCart ? 'secondary' : 'primary'}
			disabled={isLoading}
			dataTestID={dataTestID}
		/>
	) : (
		<TextButton
			text={inCart ? 'remove' : 'add'}
			onClick={handleToggleCart}
			ariaLabel={`${inCart ? 'remove from' : 'add to'} cart`}
			dataTestID={dataTestID}
		/>
	);
}

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	href: string;
	text: string;
	variant?: Variants;
	disabled?: boolean;
	ariaLabel?: string;
	classes?: string;
}

export function NavButton({
	href,
	text,
	variant = 'primary',
	disabled,
	ariaLabel,
	classes,
}: NavButtonProps) {
	return (
		<Link
			href={href}
			className={clsx(
				baseStyles,
				'text-center',
				variantMap[variant],
				disabled && disabledStyles,
				classes
			)}
			aria-label={ariaLabel}
		>
			{text}
		</Link>
	);
}
