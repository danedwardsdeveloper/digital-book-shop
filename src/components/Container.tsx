import clsx from 'clsx'
import { ReactNode } from 'react'

import { FeedbackMessage } from './FeedbackMessage'

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className={clsx('container', 'w-full', 'md:w-2/3 mx-auto flex flex-col space-y-4')}>{children}</div>
  )
}

interface ContainerWithHeadingProps {
  heading: string
  children: ReactNode
}

export function ContainerWithHeading({ heading, children }: ContainerWithHeadingProps) {
  return (
    <div className={clsx('container', 'w-full', 'md:w-2/3 mx-auto flex flex-col space-y-4')}>
      <FeedbackMessage />
      <h1 className="text-lg font-semibold">{heading}</h1>
      {children}
    </div>
  )
}

export function Spacer() {
  return <div className="h-8" />
}
