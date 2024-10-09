'use client';
import { useState } from 'react';
import { NavButton } from '@/components/Buttons';
import Container from '@/components/Container';
import OrderTable from '@/components/OrderTable';
import { useApiContext } from '@/components/Providers';
import { FeedbackMessage } from '@/components/FeedbackMessage';

type StripeApiResponse = {
	status: 'success' | 'error';
	sessionId?: string;
	message?: string;
};

const CheckoutButton = ({ disabled }: { disabled: boolean }) => {
	const { updateApiResponse } = useApiContext();
	const [isLoading, setIsLoading] = useState(false);

	const handleCheckout = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data: StripeApiResponse = await response.json();

			if (data.status === 'success' && data.sessionId) {
				updateApiResponse({
					message: 'Redirecting to secure checkout...',
					status: 'success',
				});
				window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
			} else {
				updateApiResponse({
					message:
						data.message ||
						'An unexpected error occurred during checkout.',
					status: 'error',
				});
			}
		} catch (error) {
			console.error('Checkout error:', error);
			updateApiResponse({
				message: 'An unexpected error occurred. Please try again later.',
				status: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			onClick={handleCheckout}
			disabled={disabled || isLoading}
			className={`px-4 py-2 rounded ${
				disabled || isLoading
					? 'bg-gray-300 cursor-not-allowed'
					: 'bg-blue-500 hover:bg-blue-600 text-white'
			}`}
		>
			{isLoading ? 'Processing...' : 'Checkout'}
		</button>
	);
};

export default function Cart() {
	const { cart } = useApiContext();

	const activeCartItems = cart.filter((item) => !item.removed);

	return (
		<div>
			<OrderTable type={'orderSummary'} />
			<Container>
				<FeedbackMessage />
				<NavButton
					href={'/'}
					cta={'Continue shopping'}
					variant={'secondary'}
				/>
				<CheckoutButton disabled={activeCartItems.length === 0} />
			</Container>
		</div>
	);
}
