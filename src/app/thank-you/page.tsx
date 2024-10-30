'use client';
import { useEffect } from 'react';
import { useCart } from '@/providers/CartProvider';
import { ContainerWithHeading, Spacer } from '@/components/Container';
import { NavButton } from '@/components/Buttons';

export default function ThankYou() {
	const { clearCart } = useCart();

	useEffect(() => {
		clearCart();
	}, []);

	return (
		<ContainerWithHeading heading="Thank you">
			<p>Purchase successful.</p>
			<Spacer />
			<NavButton
				text={'View purchases in account'}
				href={'/account'}
			></NavButton>
		</ContainerWithHeading>
	);
}
