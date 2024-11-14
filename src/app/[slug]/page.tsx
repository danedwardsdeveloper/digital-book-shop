import clsx from 'clsx'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { books, getBookBySlug } from '@/library/books'

import { CartButton } from '@/components/Buttons'
import { FeedbackMessage } from '@/components/FeedbackMessage'

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = getBookBySlug(params.slug)

  if (!book) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4">
      <FeedbackMessage />
      <div className="mb-8 flex flex-col sm:flex-row sm:space-x-8">
        <div className="w-full sm:mb-0 sm:w-1/2">
          <div>
            <Image
              priority
              alt={`${book.title} by ${book.author} cover`}
              className="w-full rounded-lg"
              src={book.image}
            />
          </div>
        </div>
        <div className={clsx('w-full space-y-4 sm:w-1/2', 'mt-8 sm:mt-0', 'flex flex-col justify-between')}>
          <div className={clsx('space-y-1', 'mb-10 sm:mb-0')}>
            <h1 className={clsx('text-3xl font-bold', 'text-left sm:text-right')}>{book.title}</h1>
            <p className={clsx('text-xl text-gray-600', 'text-left sm:text-right')}>{book.author}</p>
          </div>
          <div className="space-y-4">
            <p className={clsx('text-lg font-semibold', 'text-left sm:text-right')}>
              £{book.priceInPounds.toFixed(2)}
            </p>
            <p className="text-justify text-gray-700">{`This exclusive digital edition is meticulously typeset to bring ${book.author}'s prose to life for contemporary readers. Purchase now and lose yourself in this unforgettable classic!`}</p>
            <CartButton dataTestID={`cart-button-${book.slug}`} slug={book.slug} variant={'button'} />
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
  )
}

export function generateStaticParams() {
  return books.map(book => ({
    slug: book.slug,
  }))
}
