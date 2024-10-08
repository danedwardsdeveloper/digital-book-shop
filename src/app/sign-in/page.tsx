'use client';
import { useState } from 'react';
import {
	Form,
	FormErrorMessage,
	FormLink,
	FormSpacer,
	Input,
} from '@/components/Form';
import { SubmitButton } from '@/components/Buttons';

export default function CreateAccount() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage(null);
		setIsLoading(true);

		try {
			const response = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			setMessage(
				data.message || data.error || 'An unexpected error occurred'
			);
		} catch (error) {
			setMessage('An error occurred during sign in');
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
			{message && <FormErrorMessage message={message} />}
			<SubmitButton cta="Sign in" disabled={isLoading} />
			<FormLink target={'/sign-in'} text={'Sign in instead'} />
		</Form>
	);
}
