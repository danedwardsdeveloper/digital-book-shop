import Link from 'next/link';

import { books } from '@/library/books';
import Image from 'next/image';

export default function BooksList() {
	return (
		<div className="w-full my-6">
			<ul className="flex flex-wrap -mx-2 gap-y-4">
				{books.map((book, index) => (
					<li key={index} className="group w-full sm:w-1/2">
						<Link href={`/${book.slug}`}>
							<div className="flex space-x-4 p-3 rounded-lg transition duration-150 ease-in-out hover:bg-slate-200">
								<div className="w-1/2">
									<Image
										src={book.image}
										alt={`${book.title} by ${book.author} cover`}
										className="w-full rounded-lg"
									/>
								</div>
								<div className="w-1/2">
									<h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:underline underline-offset-2 transition-all duration-300 ease-in-out leading-tight">
										{book.title}
									</h2>
									<p className="text-base text-gray-600 mb-1">
										{book.author}
									</p>
									<p className="text-base font-medium text-gray-900">
										£{book.price.toFixed(2)}
									</p>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
