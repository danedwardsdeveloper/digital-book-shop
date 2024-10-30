import { notFound } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';

import { books } from '@/library/books';
import { CartButton } from '@/components/Buttons';
import { FeedbackMessage } from '@/components/FeedbackMessage';

export default function BookPage({ params }: { params: { slug: string } }) {
	const book = books.find((book) => book.slug === params.slug);

	if (!book) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4">
			<FeedbackMessage />
			<div className="flex flex-col sm:flex-row sm:space-x-8 mb-8">
				<div className="w-full sm:w-1/2 sm:mb-0">
					<div>
						<Image
							priority
							src={book.image}
							alt={`${book.title} by ${book.author} cover`}
							className="rounded-lg w-full"
						/>
					</div>
				</div>
				<div
					className={clsx(
						'w-full sm:w-1/2 space-y-4',
						'mt-8 sm:mt-0',
						'flex flex-col justify-between'
					)}
				>
					<div className={clsx('space-y-1', 'mb-10 sm:mb-0')}>
						<h1
							className={clsx(
								'text-3xl font-bold',
								'text-left sm:text-right'
							)}
						>
							{book.title}
						</h1>
						<p
							className={clsx(
								'text-xl text-gray-600',
								'text-left sm:text-right'
							)}
						>
							{book.author}
						</p>
					</div>
					<div className="space-y-4">
						<p
							className={clsx(
								'font-semibold text-lg',
								'text-left sm:text-right'
							)}
						>
							£{book.priceInPounds.toFixed(2)}
						</p>
						<p className="text-gray-700 text-justify">{`This exclusive digital edition is meticulously typeset to bring ${book.author}'s prose to life for contemporary readers. Purchase now and lose yourself in this unforgettable classic!`}</p>
						<CartButton
							slug={book.slug}
							variant={'button'}
							dataTestID={`cart-button-${book.slug}`}
						/>
					</div>
				</div>
			</div>
			<div className="space-y-6">
				{book.description.map((paragraph, index) => (
					<p key={index} className="text-gray-700">
						{paragraph}
					</p>
				))}
			</div>
		</div>
	);
}

export function generateStaticParams() {
	return books.map((book) => ({
		slug: book.slug,
	}));
}
