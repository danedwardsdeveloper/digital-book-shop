'use client';
import { NavButton } from '@/components/Buttons';
import Container from '@/components/Container';
import OrderTable from '@/components/OrderTable';
import { useApiContext } from '@/components/Providers';

export default function Cart() {
	const { cart } = useApiContext();

	const activeCartItems = cart.filter((item) => !item.removed);

	return (
		<div>
			<OrderTable type={'orderSummary'} />
			<Container>
				<NavButton
					href={'/'}
					cta={'Continue shopping'}
					variant={'secondary'}
				/>
				<NavButton
					href={'/checkout'}
					cta={'Checkout'}
					disabled={activeCartItems.length === 0}
				/>
			</Container>
		</div>
	);
}
