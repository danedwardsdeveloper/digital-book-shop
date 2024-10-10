'use client';
import { useState } from 'react';

import { NavButton } from '@/components/Buttons';
import Container from '@/components/Container';
import OrderTable from '@/components/OrderTable';
import { useApiContext } from '@/components/Providers';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { Button } from '@/components/NewButtons';

export default function Cart() {
	const { cart } = useApiContext();

	const activeCartItems = cart.filter((item) => !item.removed);

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

			interface StripeApiResponse {
				status: 'success' | 'error';
				sessionId?: string;
				message?: string;
			}

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
		<div>
			<OrderTable type={'orderSummary'} />
			<Container>
				<FeedbackMessage />
				<Button
					text={isLoading ? 'Processing...' : 'Checkout'}
					disabled={isLoading}
					onClick={handleCheckout}
				/>
				<NavButton
					href={'/'}
					cta={'Continue shopping'}
					variant={'secondary'}
				/>
			</Container>
		</div>
	);
}
