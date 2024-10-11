'use client';
import { useState, useMemo } from 'react';

import Container from '@/components/Container';
import OrderTable from '@/components/OrderTable';
import { useApiContext } from '@/components/Providers';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { Button, NavButton } from '@/components/NewButtons';

export default function Cart() {
	const { cart, updateApiResponse } = useApiContext();
	const [isLoading, setIsLoading] = useState(false);

	const activeCartItems = useMemo(() => {
		return cart.filter((item) => !item.removed);
	}, [cart]);

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
					disabled={isLoading || activeCartItems.length === 0}
					onClick={handleCheckout}
				/>
				<NavButton
					href={'/'}
					text={'Continue shopping'}
					variant={'secondary'}
				/>
			</Container>
		</div>
	);
}
