import { NavButton } from '@/components/Buttons';
import Container from '@/components/Container';
import OrderTable from '@/components/OrderTable';
import { books } from '@/library/books';

export default function Cart() {
	return (
		<div>
			<OrderTable type={'orderSummary'} books={books} />
			<Container>
				<NavButton
					href={'/'}
					cta={'Continue shopping'}
					variant={'secondary'}
				/>
				<NavButton href={'/checkout'} cta={'Checkout'} />
			</Container>
		</div>
	);
}
