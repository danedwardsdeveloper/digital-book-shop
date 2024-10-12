'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { ApiResponse } from '@/types';
import { useApiContext } from '@/components/Providers';
import { Form, FormLink, FormSpacer, Input } from '@/components/Form';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { Button } from '@/components/NewButtons';

export default function SignIn() {
	const { updateApiResponse, mergeCartsOnLogin, signedIn } = useApiContext();
	const [email, setEmail] = useState('dan@gmail.com');
	const [password, setPassword] = useState('securePassword');
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

				updateApiResponse({
					message: `Welcome ${data.user.name}` || 'Sign in successful',
					status: data.status,
					signedIn: true,
					user: data.user,
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
	};

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
