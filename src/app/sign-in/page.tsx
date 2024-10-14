'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { type CartItem, type ApiResponse } from '@/types';
import { Form, FormLink, FormSpacer, Input } from '@/components/Form';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { Button } from '@/components/Buttons';

export default function SignIn() {
	const { updateApiResponse, signedIn } = useAuth();
	const { mergeCartsOnLogin } = useCart();
	const [email, setEmail] = useState('dan@gmail.com');
	const [password, setPassword] = useState('securePassword');
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		if (signedIn) {
			router.push('/');
		}
	}, [signedIn, router]);

	const mergeCarts = (
		localCart: CartItem[],
		userCart: CartItem[]
	): CartItem[] => {
		const mergedCart = new Map<string, CartItem>();

		[...localCart, ...userCart].forEach((item) => {
			if (!item.removed) {
				mergedCart.set(item.slug, item);
			}
		});

		return Array.from(mergedCart.values());
	};

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		updateApiResponse({ message: '', status: 'info' });
		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data: ApiResponse = await response.json();

			if (response.ok && data.user) {
				await mergeCartsOnLogin(data.user);

				const updatedUser = {
					...data.user,
					cart: data.user.cart,
				};

				updateApiResponse({
					message: `Welcome back, ${data.user.name}!`,
					status: data.status,
					signedIn: true,
					user: updatedUser,
				});

				router.push('/');
			} else {
				updateApiResponse({
					message: data.message || 'An unexpected error occurred',
					status: data.status,
					signedIn: false,
					user: null,
				});
			}
		} catch (error) {
			updateApiResponse({
				message: 'An error occurred during sign in',
				status: 'error',
				signedIn: false,
				user: null,
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form onSubmit={handleSubmit}>
			<FormSpacer />
			<Input
				label="Email"
				id="email"
				name="email"
				type="email"
				value={email}
				autoComplete="email"
				onChange={(event) => setEmail(event.target.value)}
			/>
			<Input
				label="Password"
				id="password"
				name="password"
				type="password"
				value={password}
				autoComplete="current-password"
				onChange={(event) => setPassword(event.target.value)}
			/>
			<FeedbackMessage />
			<Button
				type="submit"
				text={isLoading ? 'Signing in...' : 'Sign in'}
				variant={isLoading ? 'secondary' : 'primary'}
				disabled={isLoading}
			/>
			<FormLink target="/create-account" text="Create account instead" />
		</Form>
	);
}
