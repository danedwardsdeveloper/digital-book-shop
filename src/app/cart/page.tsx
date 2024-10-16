'use client';
import { useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import Container from '@/components/Container';
import OrderTable from '@/components/OrderTable';
import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { Button, NavButton } from '@/components/Buttons';

const useRealMoney = process.env.NEXT_PUBLIC_USE_REAL_MONEY === 'true';

const stripePublicKey = useRealMoney
	? process.env.NEXT_PUBLIC_STRIPE_LIVE_KEY!
	: process.env.NEXT_PUBLIC_STRIPE_TEST_KEY!;

const stripePromise = loadStripe(stripePublicKey);

export default function Cart() {
	const { cart } = useCart();
	const { updateApiResponse } = useAuth();
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

				const stripe = await stripePromise;
				if (stripe) {
					const { error } = await stripe.redirectToCheckout({
						sessionId: data.sessionId,
					});

					if (error) {
						console.error('Stripe redirect error:', error);
						updateApiResponse({
							message:
								'Unable to redirect to checkout. Please try again.',
							status: 'error',
						});
					}
				} else {
					updateApiResponse({
						message:
							'Unable to initialize payment system. Please try again later.',
						status: 'error',
					});
				}
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
					dataTestID={'checkout-button'}
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
