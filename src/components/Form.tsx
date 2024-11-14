'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'

import { EyeIcon } from './Icons'

const focusStyles = 'ring-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500'

interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
}

export function Form({ onSubmit, children }: FormProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4">
      {children}
    </form>
  )
}

interface InputProps {
  label: string
  id: string
  name: string
  type: string
  value: string
  dataTestID: string
  autoComplete: 'given-name' | 'email' | 'new-password' | 'current-password'
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export function Input({
  label,
  id,
  name,
  type,
  value,
  dataTestID,
  autoComplete,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="w-1/3">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        placeholder={placeholder}
        data-testid={dataTestID}
        className={clsx('w-2/3 border border-gray-400 bg-gray-100 p-2 rounded-md', focusStyles)}
      />
    </div>
  )
}

interface PasswordInputProps {
  label: string
  id: string
  name: string
  value: string
  dataTestID: string
  autoComplete: 'new-password' | 'current-password'
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

export function PasswordInput({
  label,
  id,
  name,
  value,
  dataTestID,
  autoComplete,
  onChange,
  placeholder,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="w-1/3">
        {label}
      </label>
      <div className="relative w-2/3">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          required
          value={value}
          autoComplete={autoComplete}
          onChange={onChange}
          placeholder={placeholder}
          data-testid={dataTestID}
          className={clsx(
            'w-full border border-gray-400 bg-gray-100 p-2 rounded-md pr-10 font-mono tracking-wider ',
            focusStyles,
          )}
          spellCheck="false"
          autoCapitalize="off"
          autoCorrect="off"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <EyeIcon slash={showPassword} />
        </button>
      </div>
    </div>
  )
}

interface FormLinkProps {
  target: '/sign-in' | '/create-account'
  text: 'Sign in instead' | 'Create account instead'
}

export function FormLink({ target, text }: FormLinkProps) {
  return (
    <p className="text-center text-sm text-gray-600 mt-4">
      <Link href={target} className={clsx('cursor-pointer hover:underline rounded', focusStyles)}>
        {text}
      </Link>
    </p>
  )
}

export function CookieNotice({ purpose }: { purpose: 'signing in' | 'creating an account' }) {
  return (
    <div className="mb-8">
      <p className="text-sm text-gray-500 text-center mb-8">
        {`This site uses strictly necessary cookies to keep you signed in. By
			${purpose}, you agree to the use of these
			cookies. We do not use any cookies for marketing or analytics purposes.`}
      </p>
    </div>
  )
}

export function FormSpacer() {
  return <div className="h-[42px]" />
}
