import OrderTable from '@/components/OrderTable';
import { books } from '@/library/books';

export default function Cart() {
	return (
		<div>
			<OrderTable books={books} />
			<div className="mt-8 flex justify-center space-x-4">
				<button className="hover:underline">Continue shopping</button>
				<button className="hover:underline font-semibold">Checkout</button>
			</div>
		</div>
	);
}
