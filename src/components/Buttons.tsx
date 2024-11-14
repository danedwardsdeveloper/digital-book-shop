'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { getBookTitle } from '@/library/books'

import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/providers/CartProvider'
import { type AppState } from '@/types'

const focusStyles = 'focus:outline-2 outline-offset-4'

const baseStyles = clsx('w-full p-2', 'rounded', 'font-semibold', 'transition-colors duration-200')

const variantMap = {
  buy: clsx(
    'bg-yellow-400 enabled:hover:bg-yellow-500',
    'text-black',
    'disabled:bg-gray-300 disabled:cursor-not-allowed',
  ),
  primary: clsx(
    'bg-blue-500 enabled:hover:bg-blue-600',
    'text-white',
    'disabled:bg-gray-300 disabled:cursor-not-allowed',
  ),
  secondary: clsx(
    'bg-gray-200',
    'border border-gray-300',
    'enabled:hover:bg-gray-300',
    'enabled:active:bg-gray-400',
    'text-gray-800 enabled:hover:text-gray-900',
    'disabled:bg-gray-300 disabled:cursor-not-allowed',
  ),
  delete: clsx(
    'bg-red-400',
    'enabled:hover:bg-red-500',
    'enabled:active:bg-red-600',
    'text-black',
    'disabled:bg-gray-300 disabled:cursor-not-allowed',
  ),
}

type Variants = keyof typeof variantMap

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  type?: 'button' | 'submit'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  variant?: Variants
  dataTestID?: string
  disabled?: boolean
  ariaLabel?: string
  classes?: string
}

export function Button({
  text,
  type = 'button',
  variant = 'primary',
  dataTestID,
  onClick,
  disabled,
  ariaLabel,
  classes,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={dataTestID}
      className={clsx(baseStyles, focusStyles, variantMap[variant], classes)}
    >
      {text}
    </button>
  )
}

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  dataTestID?: string
  ariaLabel?: string
}

export function TextButton({ text, onClick, ariaLabel, dataTestID }: TextButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(
        focusStyles,
        'bg-none',
        'text-gray-500',
        'underline underline-offset-4',
        'decoration-gray-300 sm:decoration-transparent sm:hover:decoration-gray-300',
        'transition-all duration-300',
      )}
      data-testid={dataTestID}
    >
      {text}
    </button>
  )
}

interface CartButtonProps {
  slug: string
  variant: 'button' | 'text'
  dataTestID?: string
}

export function CartButton({ slug, variant, dataTestID }: CartButtonProps) {
  const router = useRouter()
  const { isInCart, toggleCartItem } = useCart()
  const { updateAppState, signedIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const inCart = isInCart(slug)
  const bookTitle = getBookTitle(slug)

  const handleToggleCart = async () => {
    setIsLoading(true)

    try {
      await toggleCartItem(slug)

      const baseState: AppState = {
        message: inCart ? `${bookTitle} removed from cart` : `${bookTitle} added to cart`,
        status: inCart ? 'info' : 'success',
        signedIn,
        user: null,
      }

      if (signedIn) {
        const endpoint = inCart ? `/api/cart/remove/${slug}` : `/api/cart/add/${slug}`

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data: AppState = await response.json()

        if (response.ok) {
          updateAppState(data)
          if (!inCart) {
            router.push('/cart')
          }
        } else {
          console.error('Error modifying cart:', data.message)
          updateAppState({
            status: data.status,
            message: data.message || 'Failed to modify cart',
            signedIn,
            user: null,
          })
        }
      } else {
        updateAppState(baseState)
        if (!inCart) {
          router.push('/cart')
        }
      }
    } catch (error) {
      console.error('Error modifying cart:', error)
      updateAppState({
        status: 'error',
        message: 'An unexpected error occurred',
        signedIn,
        user: null,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return variant === 'button' ? (
    <Button
      text={inCart ? 'Remove from cart' : isLoading ? 'Updating...' : 'Add to cart'}
      onClick={handleToggleCart}
      variant={inCart ? 'secondary' : 'buy'}
      disabled={isLoading}
      dataTestID={dataTestID}
    />
  ) : (
    <TextButton
      text={inCart ? 'remove' : 'add'}
      onClick={handleToggleCart}
      ariaLabel={`${inCart ? 'remove from' : 'add to'} cart`}
      dataTestID={dataTestID}
    />
  )
}

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string
  text: string
  variant?: Variants
  disabled?: boolean
  ariaLabel?: string
  dataTestID?: string
  classes?: string
}

export function NavButton({
  href,
  text,
  variant = 'primary',
  ariaLabel,
  dataTestID,
  classes,
}: NavButtonProps) {
  return (
    <Link
      href={href}
      className={clsx(baseStyles, focusStyles, 'text-center', variantMap[variant], classes)}
      data-testid={dataTestID}
      aria-label={ariaLabel}
    >
      {text}
    </Link>
  )
}
