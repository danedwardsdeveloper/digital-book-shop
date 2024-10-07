import { type Book } from '@/library/books';

export default function OrderTable({ books }: { books: Book[] }) {
	const total = books.reduce((sum, book) => sum + book.price, 0);

	return (
		<table className="w-2/3 mx-auto">
			<tbody>
				{books.map((book) => (
					<tr key={book.slug}>
						<td className="py-3 pr-4 w-2/3">
							<span className="text-base">{book.title}</span>
							<br />
							<span className="text-sm text-gray-600">
								{book.author}
							</span>
						</td>
						<td className="py-3 px-4 w-1/6">
							<button className="hover:underline text-gray-500">
								Remove
							</button>
						</td>
						<td className="py-3 pl-4 w-1/6 text-right">
							£{book.price.toFixed(2)}
						</td>
					</tr>
				))}
				<tr className="border-t border-gray-300">
					<td className="py-3"></td>
					<td className="py-3 px-4 text-right font-bold">Total</td>
					<td className="py-3 pl-4 text-right font-semibold">
						£{total.toFixed(2)}
					</td>
				</tr>
			</tbody>
		</table>
	);
}
