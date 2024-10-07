import React from 'react';
import { notFound } from 'next/navigation';
import { books } from '@/library/books';

type Props = {
	params: { slug: string };
};

export default function BookPage({ params }: Props) {
	const book = books.find((b) => b.slug === params.slug);

	if (!book) {
		notFound();
	}

	return (
		<div className="flex flex-col my-8 mx-4">
			<div className="flex flex-col md:flex-row w-full">
				<div className="w-full md:w-1/2 md:pr-4 md:mb-10 order-2 md:order-1">
					<div className="bg-gray-400 w-full aspect-[3/4] rounded-xl" />
				</div>
				<div className="w-full md:w-1/2 pl-4 order-1 md:order-2">
					<h1 className="text-3xl font-bold">{book.title}</h1>
					<p className="mb-4">{book.author}</p>
					<p className="">£{book.price.toFixed(2)}</p>
					<button className="hover:underline">Add to Cart</button>
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
