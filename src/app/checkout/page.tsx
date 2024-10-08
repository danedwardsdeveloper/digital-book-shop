'use client';
import { books } from '@/library/books';
import OrderTable from '@/components/OrderTable';
import { Form, FormErrorMessage, Input } from '@/components/Form';
import { SubmitButton } from '@/components/Buttons';

export default function Checkout() {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Form submitted');
	};

	return (
		<>
			<OrderTable type={'orderSummary'} books={books} />
			<Form onSubmit={handleSubmit}>
				<Input
					label={'Name on card'}
					id={'card-name'}
					name={'card-name'}
					type={'text'}
				/>
				<Input
					label={'Card number'}
					id={'card-number'}
					name={'card-number'}
					type={'text'}
					placeholder={'0000 0000 0000 0000'}
				/>
				<Input
					label={'Expiration'}
					id={'card-expiry'}
					name={'card-expiry'}
					type={'text'}
					placeholder={'MMYY'}
				/>
				<Input
					label={'CVC'}
					id={'card-cvc'}
					name={'card-cvc'}
					type={'text'}
				/>
				<FormErrorMessage message={'Sorry something went wrong.'} />
				<SubmitButton cta={`Buy now`} />
			</Form>
		</>
	);
}
