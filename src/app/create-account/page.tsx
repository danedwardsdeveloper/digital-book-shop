'use client';
import { Form, FormLink, Input } from '@/components/Form';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { SubmitButton } from '@/components/Buttons';

export default function CreateAccount() {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Create account form submitted');
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input
				label="Name"
				id="name"
				name="name"
				type="text"
				value={''}
				onChange={() => null}
			/>
			<Input
				label="Email"
				id="email"
				name="email"
				type="email"
				value={''}
				onChange={() => null}
			/>
			<Input
				label="Password"
				id="password"
				name="password"
				type="password"
				value={''}
				onChange={() => null}
			/>
			<FeedbackMessage />
			<SubmitButton cta="Create account" />
			<FormLink target={'/sign-in'} text={'Sign in instead'} />
		</Form>
	);
}
