'use client';
import { useMemo } from 'react';
import clsx from 'clsx';

import type { StaticBook } from '@/types';
import { ToggleCartButton } from './Buttons';
import { books } from '@/library/books';
import { useApiContext } from '@/components/Providers';

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

interface OrderTableProps {
	type: 'orderSummary' | 'purchaseHistory';
}

export default function OrderTable({ type }: OrderTableProps) {
	const { cart, addToCart, removeFromCart } = useApiContext();

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

	const total = activeBooks.reduce((sum, book) => sum + book.price, 0);

	const handleToggle = (slug: string) => {
		const cartItem = cart.find((item) => item.slug === slug);
		if (cartItem?.removed) {
			addToCart(slug);
		} else {
			removeFromCart(slug);
		}
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
					{books.map((book) => {
						const cartItem = cart.find((item) => item.slug === book.slug);
						const removedCartItem = cartItem?.removed;

						return (
							<tr key={book.slug}>
								<td className="py-3 pr-4 w-2/3">
									<span
										className={clsx('text-base', {
											'line-through': removedCartItem,
										})}
									>
										{book.title}
									</span>
									<br />
									<span
										className={clsx('text-sm text-gray-600', {
											'line-through': removedCartItem,
										})}
									>
										{book.author}
									</span>
								</td>
								<td className="py-3 w-1/6 text-right">
									{type === 'purchaseHistory' ? (
										<span>5</span>
									) : (
										<ToggleCartButton
											slug={book.slug}
											isRemoved={removedCartItem || false}
											onToggle={handleToggle}
										/>
									)}
								</td>
								<td className="py-3 pl-4 w-1/6 text-right">
									{type === 'purchaseHistory' ? (
										<DownloadLink book={book} />
									) : (
										<span
											className={clsx('text-sm text-gray-600', {
												'line-through': removedCartItem,
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
