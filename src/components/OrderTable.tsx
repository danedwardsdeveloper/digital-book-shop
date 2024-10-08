'use client';
import { type StaticBook } from '@/types';

interface BookTableProps {
	type: 'orderSummary' | 'purchaseHistory';
	books: StaticBook[];
}

function DownloadLink({ book }: { book: StaticBook }) {
	return (
		<a
			href={`/api/download/${book.slug}`}
			className=" text-gray-600 cursor-pointer hover:underline"
			onClick={(e) => {
				e.preventDefault();
				window.location.href = `/api/download/${book.slug}`;
			}}
		>
			Download
		</a>
	);
}

export default function OrderTable({ type, books }: BookTableProps) {
	const total = books.reduce((sum, book) => sum + book.price, 0);

	return (
		<>
			<div className="w-2/3 mx-auto mt-8 mb-2 pb-2">
				<h2 className="text-lg font-semibold">
					{type === 'orderSummary' ? 'Your order' : 'Purchase history'}
				</h2>
			</div>
			<table className="w-2/3 mx-auto">
				{type === 'purchaseHistory' && (
					<thead className="border-b border-gray-300 pb-4">
						<tr>
							<th scope="col" className="pb-2" />
							<th
								scope="col"
								className="pb-2 text-left text-sm font-normal text-gray-500"
							>
								Downloads remaining
							</th>
							<th scope="col" className="pb-2" />
						</tr>
					</thead>
				)}
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
							<td className="py-3 w-1/6">
								{type === 'purchaseHistory' ? (
									<span>5</span>
								) : (
									<button className="hover:underline text-gray-500">
										Remove
									</button>
								)}
							</td>
							<td className="py-3 pl-4 w-1/6 text-right">
								{type === 'purchaseHistory' ? (
									<DownloadLink book={book} />
								) : (
									<span>{`£${book.price.toFixed(2)}`}</span>
								)}
							</td>
						</tr>
					))}
					{type === 'orderSummary' && (
						<tr className="border-t border-gray-300">
							<td className="py-3"></td>
							<td className="py-3 px-4 text-right font-bold">Total</td>
							<td className="py-3 pl-4 text-right font-semibold">
								£{total.toFixed(2)}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</>
	);
}
