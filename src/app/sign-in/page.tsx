'use client';
import { useState } from 'react';
import { useApiContext } from '../../components/Providers';

import { Form, FormLink, FormSpacer, Input } from '@/components/Form';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { SubmitButton } from '@/components/Buttons';
import { ApiResponse } from '@/types';

export default function CreateAccount() {
	const { updateApiResponse } = useApiContext();

	const [email, setEmail] = useState('dan@gmail.com');
	const [password, setPassword] = useState('securePassword');
	const [isLoading, setIsLoading] = useState(false);

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

			if (response.ok) {
				updateApiResponse({
					message: `Welcome ${data.user?.name}` || 'Sign in successful',
					status: data.status,
					loggedIn: true,
					user: data.user,
				});
			} else {
				updateApiResponse({
					message: data.message || 'An unexpected error occurred',
					status: data.status,
					loggedIn: false,
					user: null,
				});
			}
		} catch (error) {
			updateApiResponse({
				message: 'An error occurred during sign in',
				status: 'error',
				loggedIn: false,
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
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Input
				label="Password"
				id="password"
				name="password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<FeedbackMessage />
			<SubmitButton cta="Sign in" disabled={isLoading} />
			<FormLink target={'/sign-in'} text={'Sign in instead'} />
		</Form>
	);
}
