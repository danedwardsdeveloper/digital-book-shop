'use client'

import { useEffect } from 'react'

import { NavButton } from '@/components/Buttons'
import { ContainerWithHeading, Spacer } from '@/components/Container'

import { useCart } from '@/providers/CartProvider'

export default function ThankYou() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <ContainerWithHeading heading="Thank you">
      <p>Purchase successful.</p>
      <Spacer />
      <NavButton href={'/account'} text={'View purchases in account'}></NavButton>
    </ContainerWithHeading>
  )
}
