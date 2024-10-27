'use client';
import { useMemo } from 'react';

import { useAuth } from '@/providers/AuthProvider';
import { books } from '@/library/books';
import { TextButton } from './Buttons';
import { PurchasedItem, AppState } from '@/types';

export default function PurchaseHistory() {
	const { user, updateAppState } = useAuth();

	const purchasedBooks = useMemo(() => {
		if (!user) return [];
		return books.filter((book) =>
			user.purchased.some((item) => item.slug === book.slug)
		);
	}, [user]);

	if (!purchasedBooks) {
		return <div>No purchases</div>;
	}

	const handleDownload =
		(slug: string) => async (event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();

			try {
				const response = await fetch(`/api/download/${slug}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});

				if (response.ok) {
					const blob = await response.blob();
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.style.display = 'none';
					a.href = url;
					a.download = `${slug}.pdf`;
					document.body.appendChild(a);
					a.click();
					window.URL.revokeObjectURL(url);

					if (user) {
						const updatedPurchased = user.purchased.map((item) =>
							item.slug === slug
								? { ...item, downloads: (item.downloads || 0) - 1 }
								: item
						);

						updateAppState({
							user: {
								...user,
								purchased: updatedPurchased,
							},
						});
					}
				} else {
					const errorData: AppState = await response.json();
					console.error('Download failed:', errorData.message);
					updateAppState({
						status: 'error',
						message: errorData.message || 'Download failed',
					});
				}
			} catch (error) {
				console.error('Download error:', error);
				updateAppState({
					status: 'error',
					message:
						error instanceof Error ? error.message : 'Download failed',
				});
			}
		};

	if (!user) {
		return <div>Please sign in to view your purchase history.</div>;
	}

	return (
		<>
			<div className="w-2/3 mx-auto mt-8 mb-2 pb-2">
				<h2 className="text-lg font-semibold">Purchase history</h2>
			</div>
			<table className="w-2/3 mx-auto">
				<thead className="border-b border-gray-300 pb-4">
					<tr>
						<th scope="col" className="pb-2" />
						<th
							scope="col"
							className="pb-2 text-right text-sm font-normal text-gray-500"
						>
							downloads
							<br />
							remaining
						</th>
						<th scope="col" className="pb-2" />
					</tr>
				</thead>
				<tbody>
					{purchasedBooks.map((book) => {
						const purchasedItem = user.purchased.find(
							(item): item is PurchasedItem => item.slug === book.slug
						);
						const downloadsRemaining = purchasedItem
							? purchasedItem.downloads
							: 0;

						return (
							<tr key={book.slug}>
								<td className="py-3 pr-4 w-2/5">
									<span className="text-base">{book.title}</span>
									<br />
									<span className="text-sm text-gray-600">
										{book.author}
									</span>
								</td>
								<td className="py-3 w-2/5 text-right">
									<span
										data-testid={`${book.slug}-downloads-remaining`}
									>
										{purchasedItem?.downloads ?? 0}
									</span>
								</td>
								<td className="py-3 pl-4 w-1/5 text-right">
									<TextButton
										text={'Download'}
										dataTestID={`${book.slug}-download-button`}
										onClick={handleDownload(book.slug)}
										disabled={downloadsRemaining === 0}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
}
