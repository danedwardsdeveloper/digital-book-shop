'use client';
import { useState, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { Container, Spacer } from '@/components/Container';
import CartSummary from '@/components/CartSummary';
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
	const { updateAppState } = useAuth();
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
				updateAppState({
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
						updateAppState({
							message:
								'Unable to redirect to checkout. Please try again.',
							status: 'error',
						});
					}
				} else {
					updateAppState({
						message:
							'Unable to initialize payment system. Please try again later.',
						status: 'error',
					});
				}
			} else {
				updateAppState({
					message:
						data.message ||
						'An unexpected error occurred during checkout.',
					status: 'error',
				});
			}
		} catch (error) {
			console.error('Checkout error:', error);
			updateAppState({
				message: 'An unexpected error occurred. Please try again later.',
				status: 'error',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container>
			<FeedbackMessage />
			<CartSummary />
			<Spacer />
			<Button
				text={isLoading ? 'Processing...' : 'Checkout'}
				disabled={isLoading || activeCartItems.length === 0}
				onClick={handleCheckout}
				dataTestID={'checkout-button'}
				variant="buy"
			/>
			<NavButton
				href={'/'}
				text={'Continue shopping'}
				variant={'secondary'}
				dataTestID="continue-shopping-button"
			/>
		</Container>
	);
}
