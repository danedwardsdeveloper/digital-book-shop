import Image from 'next/image';
import { notFound } from 'next/navigation';

import { books } from '@/library/books';
import { CartButton } from '@/components/CartButton';

export default function BookPage({ params }: { params: { slug: string } }) {
	const book = books.find((book) => book.slug === params.slug);

	if (!book) {
		notFound();
	}

	return (
		<div className="flex flex-col my-8 mx-4">
			<div className="flex flex-col md:flex-row w-full">
				<div className="w-full md:w-1/2 md:pr-4 md:mb-10 order-2 md:order-1">
					<div>
						<Image
							src={book.image}
							alt={`${book.title} by ${book.author} cover`}
							className="rounded-lg"
						/>
					</div>
				</div>
				<div className="w-full md:w-1/2 pl-4 order-1 md:order-2">
					<h1 className="text-3xl font-bold">{book.title}</h1>
					<p className="mb-4">{book.author}</p>
					<p className="mb-4">£{book.price.toFixed(2)}</p>
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
