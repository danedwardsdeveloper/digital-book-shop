'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/Buttons'
import { FeedbackMessage } from '@/components/FeedbackMessage'
import { CookieNotice, Form, FormLink, Input, PasswordInput } from '@/components/Form'

import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/providers/CartProvider'
import type { AppState } from '@/types'

export default function CreateAccount() {
  const { updateAppState, signedIn } = useAuth()
  const { mergeLocalAndDatabaseCarts } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (signedIn) {
      router.push('/')
    }
  }, [signedIn, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateAppState({ message: '', status: 'info' })
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data: AppState = await response.json()

      if (response.ok && data.user) {
        await mergeLocalAndDatabaseCarts(data.user)

        updateAppState({
          message: `Welcome ${data.user.name}! Your account has been created.`,
          status: data.status,
          signedIn: true,
          user: data.user,
        })

        router.push('/')
      } else {
        updateAppState({
          message: data.message || 'An unexpected error occurred',
          status: data.status || 'error',
          signedIn: false,
          user: null,
        })
      }
    } catch (error) {
      console.error('An error occurred during account creation', error)
      updateAppState({
        message: 'An error occurred during account creation',
        status: 'error',
        signedIn: false,
        user: null,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <FeedbackMessage />

      <Form onSubmit={handleSubmit}>
        <Input
          label="Name"
          id="name"
          name="name"
          type="text"
          value={name}
          autoComplete="given-name"
          dataTestID="name-input"
          onChange={event => setName(event.target.value)}
        />
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={email}
          autoComplete="email"
          dataTestID="email-input"
          onChange={event => setEmail(event.target.value)}
        />
        <PasswordInput
          label="Password"
          id="password"
          name="password"
          value={password}
          autoComplete="new-password"
          dataTestID="password-input"
          onChange={event => setPassword(event.target.value)}
        />
        <CookieNotice purpose="creating an account" />
        <Button
          type="submit"
          text={isLoading ? 'Creating account...' : 'Create account'}
          variant={isLoading ? 'secondary' : 'primary'}
          disabled={isLoading}
          dataTestID="create-account-button"
        />
        <FormLink target={'/sign-in'} text={'Sign in instead'} />
      </Form>
    </>
  )
}
