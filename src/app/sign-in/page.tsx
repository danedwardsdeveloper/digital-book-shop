'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/Buttons'
import { FeedbackMessage } from '@/components/FeedbackMessage'
import { CookieNotice, Form, FormLink, FormSpacer, Input, PasswordInput } from '@/components/Form'

import { useAuth } from '@/providers/AuthProvider'
import { useCart } from '@/providers/CartProvider'
import { type AppState } from '@/types'

export default function SignIn() {
  const { updateAppState, signedIn } = useAuth()
  const { mergeLocalAndDatabaseCarts } = useCart()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (signedIn) {
      router.push('/')
    }
  }, [signedIn, router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateAppState({ message: '', status: 'info' })
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data: AppState = await response.json()

      if (response.ok && data.user) {
        await mergeLocalAndDatabaseCarts(data.user)

        updateAppState({
          message: `Welcome back, ${data.user.name}!`,
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
    } catch {
      updateAppState({
        message: 'An error occurred during sign in',
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
        <FormSpacer />
        <Input
          autoComplete="email"
          dataTestID="email-input"
          id="email"
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
        <PasswordInput
          autoComplete="current-password"
          dataTestID="password-input"
          id="password"
          label="Password"
          name="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <CookieNotice purpose="signing in" />
        <Button
          dataTestID="sign-in-button"
          disabled={isLoading}
          text={isLoading ? 'Signing in...' : 'Sign in'}
          type="submit"
          variant={isLoading ? 'secondary' : 'primary'}
        />
        <FormLink target="/create-account" text="Create account instead" />
      </Form>
    </>
  )
}
