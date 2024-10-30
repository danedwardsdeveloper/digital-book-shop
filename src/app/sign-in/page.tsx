'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { type AppState } from '@/types';
import {
	CookieNotice,
	Form,
	FormLink,
	FormSpacer,
	Input,
	PasswordInput,
} from '@/components/Form';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { Button } from '@/components/Buttons';

export default function SignIn() {
	const { updateAppState, signedIn } = useAuth();
	const { mergeLocalAndDatabaseCarts } = useCart();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		if (signedIn) {
			router.push('/');
		}
	}, [signedIn, router]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		updateAppState({ message: '', status: 'info' });
		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data: AppState = await response.json();

			if (response.ok && data.user) {
				await mergeLocalAndDatabaseCarts(data.user);

				updateAppState({
					message: `Welcome back, ${data.user.name}!`,
					status: data.status,
					signedIn: true,
					user: data.user,
				});

				router.push('/');
			} else {
				updateAppState({
					message: data.message || 'An unexpected error occurred',
					status: data.status || 'error',
					signedIn: false,
					user: null,
				});
			}
		} catch (error) {
			console.error('An error occurred during sign in', error);
			updateAppState({
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
		<>
			<FeedbackMessage />
			<Form onSubmit={handleSubmit}>
				<FormSpacer />
				<Input
					label="Email"
					id="email"
					name="email"
					type="email"
					value={email}
					autoComplete="email"
					dataTestID="email-input"
					onChange={(event) => setEmail(event.target.value)}
				/>
				<PasswordInput
					label="Password"
					id="password"
					name="password"
					value={password}
					dataTestID="password-input"
					autoComplete="current-password"
					onChange={(event) => setPassword(event.target.value)}
				/>
				<CookieNotice purpose="signing in" />
				<Button
					type="submit"
					dataTestID="sign-in-button"
					text={isLoading ? 'Signing in...' : 'Sign in'}
					variant={isLoading ? 'secondary' : 'primary'}
					disabled={isLoading}
				/>
				<FormLink target="/create-account" text="Create account instead" />
			</Form>
		</>
	);
}
