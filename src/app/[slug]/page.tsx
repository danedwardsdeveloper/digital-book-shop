import { notFound } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';

import { books } from '@/library/books';
import { CartButton } from '@/components/NewButtons';

export default function BookPage({ params }: { params: { slug: string } }) {
	const book = books.find((book) => book.slug === params.slug);

	if (!book) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			<div className="flex flex-col md:flex-row md:space-x-8">
				<div className="w-full md:w-1/2 md:mb-0 order-2 md:order-1">
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
						'w-full md:w-1/2 space-y-4',
						'order-1 md:order-2 mb-8'
					)}
				>
					<div className="space-y-1">
						<h1 className="text-3xl font-bold">{book.title}</h1>
						<p className="text-xl text-gray-600">{book.author}</p>
					</div>
					<p>£{book.price.toFixed(2)}</p>
					<p className="text-gray-700">{`This exclusive digital edition is meticulously typeset to bring ${book.author}'s prose to life for contemporary readers. Purchase now and lose yourself in this unforgettable classic!`}</p>
					<CartButton slug={book.slug} />
				</div>
			</div>
			<div className="space-y-4">
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
