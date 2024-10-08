'use client';
import { Form, FormErrorMessage, FormLink, Input } from '@/components/Form';
import { SubmitButton } from '@/components/Buttons';

export default function CreateAccount() {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Create account form submitted');
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label="Name" id="name" name="name" type="text" />
			<Input label="Email" id="email" name="email" type="email" />
			<Input
				label="Password"
				id="password"
				name="password"
				type="password"
			/>
			<FormErrorMessage message="Sorry something went wrong." />
			<SubmitButton cta="Create account" />
			<FormLink target={'/sign-in'} text={'Sign in instead'} />
		</Form>
	);
}
