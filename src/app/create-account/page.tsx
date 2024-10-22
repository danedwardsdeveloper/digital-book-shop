'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { ApiResponse } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { Form, FormLink, Input } from '@/components/Form';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { Button } from '@/components/Buttons';

export default function CreateAccount() {
	const { updateApiResponse, signedIn } = useAuth();
	const { mergeLocalAndDatabaseCarts } = useCart();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		if (signedIn) {
			router.push('/');
		}
	}, [signedIn, router]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateApiResponse({ message: '', status: 'info' });
		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/create-account', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, password }),
			});

			const data: ApiResponse = await response.json();

			if (response.ok && data.user) {
				await mergeLocalAndDatabaseCarts(data.user);

				updateApiResponse({
					message: `Welcome ${data.user.name}! Your account has been created.`,
					status: data.status,
					signedIn: true,
					user: data.user,
				});

				router.push('/');
			} else {
				updateApiResponse({
					message: data.message || 'An unexpected error occurred',
					status: data.status || 'error',
					signedIn: false,
					user: null,
				});
			}
		} catch (error) {
			console.error('An error occurred during account creation', error);
			updateApiResponse({
				message: 'An error occurred during account creation',
				status: 'error',
				signedIn: false,
				user: null,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input
				label="Name"
				id="name"
				name="name"
				type="text"
				value={name}
				autoComplete="given-name"
				dataTestID="name-input"
				onChange={(event) => setName(event.target.value)}
			/>
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
			<Input
				label="Password"
				id="password"
				name="password"
				type="password"
				value={password}
				autoComplete="new-password"
				dataTestID="password-input"
				onChange={(event) => setPassword(event.target.value)}
			/>
			<FeedbackMessage />
			<Button
				type="submit"
				text={isLoading ? 'Creating account...' : 'Create account'}
				variant={isLoading ? 'secondary' : 'primary'}
				disabled={isLoading}
				dataTestID="create-account-button"
			/>
			<FormLink target={'/sign-in'} text={'Sign in instead'} />
		</Form>
	);
}
