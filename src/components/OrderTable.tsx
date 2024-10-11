'use client';
import { useMemo } from 'react';
import clsx from 'clsx';

import type { StaticBook } from '@/types';
import { books } from '@/library/books';
import { useApiContext, useCart } from '@/components/Providers';
import { TextButton } from './NewButtons';

// function DownloadLink({ book }: { book: StaticBook }) {
// 	return (
// 		<a
// 			href={`/api/download/${book.slug}`}
// 			className=" text-gray-600 cursor-pointer hover:underline"
// 			onClick={(e) => {
// 				e.preventDefault();
// 				window.location.href = `/api/download/${book.slug}`;
// 			}}
// 		>
// 			Download
// 		</a>
// 	);
// }

interface OrderTableProps {
	type: 'orderSummary' | 'purchaseHistory';
}

export default function OrderTable({ type }: OrderTableProps) {
	const { cart } = useApiContext();
	const { toggleCartItem } = useCart();

	const cartBooks = useMemo(() => {
		return books.filter((book) =>
			cart.some((item) => item.slug === book.slug)
		);
	}, [cart]);

	const activeBooks = useMemo(() => {
		return cartBooks.filter(
			(book) => !cart.find((item) => item.slug === book.slug)?.removed
		);
	}, [cartBooks, cart]);

	const numberOfItemsMessage = `Total: (${activeBooks.length} item${
		activeBooks.length !== 1 ? 's' : ''
	})`;

	const orderTotal = activeBooks.reduce((sum, book) => sum + book.price, 0);

	const handleToggleCart =
		(slug: string) => async (event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			await toggleCartItem(slug);
		};

	const handleDownload =
		(slug: string) => async (event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			window.location.href = `/api/download/${slug}`;
		};

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
					{cartBooks.map((book) => {
						const cartItem = cart.find((item) => item.slug === book.slug);
						const removedCartItem = cartItem?.removed;

						return (
							<tr key={book.slug}>
								<td className="py-3 pr-4 w-2/5">
									<span
										className={clsx('text-base', {
											'line-through opacity-50': removedCartItem,
										})}
									>
										{book.title}
									</span>
									<br />
									<span
										className={clsx('text-sm text-gray-600', {
											'line-through opacity-50': removedCartItem,
										})}
									>
										{book.author}
									</span>
								</td>
								<td className="py-3 w-2/5 text-right">
									{type === 'purchaseHistory' ? (
										<span>5</span>
									) : (
										<TextButton
											text={removedCartItem ? 'add' : 'remove'}
											onClick={handleToggleCart(book.slug)}
										/>
									)}
								</td>
								<td className="py-3 pl-4 w-1/5 text-right">
									{type === 'purchaseHistory' ? (
										<TextButton
											text={''}
											onClick={handleDownload(book.slug)}
										/>
									) : (
										<span
											className={clsx('text-sm text-gray-600', {
												' line-through opacity-50': removedCartItem,
											})}
										>{`£${book.price.toFixed(2)}`}</span>
									)}
								</td>
							</tr>
						);
					})}
					{type === 'orderSummary' && (
						<tr className="border-t border-gray-300">
							<td className="py-3"></td>
							<td className="py-3 text-right">{numberOfItemsMessage}</td>
							<td className="py-3 pl-4 text-right font-semibold">
								£{orderTotal.toFixed(2)}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</>
	);
}
