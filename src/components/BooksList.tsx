import Link from 'next/link';

import { books } from '@/library/books';
import PlaceholderImage from './PlacehoderImage';

export default function BooksList() {
	return (
		<ul className="my-6 space-y-4">
			{books.map((book, index) => (
				<li key={index} className="group">
					<Link href={`/${book.slug}`}>
						<div className="flex space-x-4 p-3 rounded-lg transition duration-150 ease-in-out hover:bg-slate-200">
							<PlaceholderImage />
							<div className="flex-grow">
								<h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:underline underline-offset-2 transition-all duration-300 ease-in-out">
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
	);
}
