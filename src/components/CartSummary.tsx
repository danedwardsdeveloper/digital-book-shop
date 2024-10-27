'use client';
import { useMemo } from 'react';
import clsx from 'clsx';

import { books } from '@/library/books';
import { useCart } from '@/providers/CartProvider';
import { CartButton } from './Buttons';

export default function CartSummary() {
	const { cart } = useCart();

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
		activeBooks.length === 1 ? '' : 's'
	})`;

	const orderTotal = activeBooks.reduce((sum, book) => sum + book.price, 0);

	return (
		<>
			<div className="w-2/3 mx-auto mb-2 pb-2">
				<h2 className="text-lg font-semibold">{`Cart`}</h2>
			</div>
			<table className="w-2/3 mx-auto">
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
									<CartButton slug={book.slug} variant={'text'} />
								</td>
								<td className="py-3 pl-4 w-1/5 text-right">
									<span
										className={clsx('text-sm text-gray-600', {
											' line-through opacity-50': removedCartItem,
										})}
									>{`£${book.price.toFixed(2)}`}</span>
								</td>
							</tr>
						);
					})}

					<tr className="border-t border-gray-300">
						<td className="py-3"></td>
						<td className="py-3 text-right">{numberOfItemsMessage}</td>
						<td className="py-3 pl-4 text-right font-semibold">
							£{orderTotal.toFixed(2)}
						</td>
					</tr>
				</tbody>
			</table>
		</>
	);
}
