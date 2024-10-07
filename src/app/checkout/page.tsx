'use client';
import { books } from '@/library/books';
import OrderTable from '@/components/OrderTable';

export default function Checkout() {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log('Form submitted');
	};

	return (
		<div>
			<OrderTable books={books} />
			<form onSubmit={handleSubmit} className="space-y-4 mt-8 w-2/3 mx-auto">
				<div className="flex items-center justify-between">
					<label htmlFor="card-name" className="w-1/3">
						Name on card
					</label>
					<input
						type="text"
						id="card-name"
						name="card-name"
						required
						className="w-2/3 border border-gray-400 bg-gray-100 p-2 rounded-md"
					/>
				</div>
				<div className="flex items-center justify-between">
					<label htmlFor="card-number" className="w-1/3">
						Card number
					</label>
					<input
						type="text"
						id="card-number"
						name="card-number"
						required
						placeholder="0000 0000 0000 0000"
						className="w-2/3 border border-gray-400 bg-gray-100 p-2 rounded-md"
					/>
				</div>
				<div className="flex items-center justify-between">
					<label htmlFor="card-expiry" className="w-1/3">
						Expiration
					</label>
					<input
						type="text"
						id="card-expiry"
						name="card-expiry"
						required
						placeholder="MMYY"
						className="w-2/3 border border-gray-400 bg-gray-100 p-2 rounded-md"
					/>
				</div>
				<div className="flex items-center justify-between">
					<label htmlFor="card-cvc" className="w-1/3">
						CVC
					</label>
					<input
						type="text"
						id="card-cvc"
						name="card-cvc"
						required
						className="w-2/3 border border-gray-400 bg-gray-100 p-2 rounded-md"
					/>
				</div>
				<p className="text-red-500 text-center">
					Sorry something went wrong.
				</p>
				<button
					type="submit"
					className="hover:underline font-semibold w-full bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
				>
					Buy now
				</button>
			</form>
		</div>
	);
}
