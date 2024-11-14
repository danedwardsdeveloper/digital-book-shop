import { ElementHandle } from 'puppeteer'
import { expect } from 'vitest'

import { baseURL, page } from './setup.test'

export async function getByTestId(testId: string): Promise<ElementHandle<Element>> {
  const element = await page.$(`[data-testid="${testId}"]`)
  if (!element) {
    throw new Error(`Element with test ID "${testId}" not found`)
  }
  return element
}

export async function verifySignedOutNavbar() {
  await page.waitForSelector('[data-testid="nav-home"]')
  const homeLink = await getByTestId('nav-home')
  expect(homeLink).not.toBeNull()

  const createAccountLink = await getByTestId('nav-create-account')
  expect(createAccountLink).not.toBeNull()

  const signInLink = await getByTestId('nav-sign-in')
  expect(signInLink).not.toBeNull()

  const cartLink = await getByTestId('nav-cart')
  expect(cartLink).not.toBeNull()
}

export async function createAccount({
  name = 'Test',
  email = 'test@gmail.com',
  password = 'securePassword',
}: {
  name?: string
  email?: string
  password?: string
} = {}) {
  await page.goto(`${baseURL}/create-account`, {
    waitUntil: 'networkidle0',
  })

  await page.waitForSelector('[data-testid="name-input"]')
  await page.type('[data-testid="name-input"]', name)
  await page.type('[data-testid="email-input"]', email)
  await page.type('[data-testid="password-input"]', password)

  await Promise.all([
    page.click('[data-testid="create-account-button"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ])
}

export async function signIn({
  email = 'test@gmail.com',
  password = 'securePassword',
}: {
  email?: string
  password?: string
} = {}) {
  await page.waitForSelector('[data-testid="email-input"]')
  await page.type('[data-testid="email-input"]', email)
  await page.type('[data-testid="password-input"]', password)

  await Promise.all([
    page.click('[data-testid="sign-in-button"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ])
}

export async function continueShopping() {
  const continueShoppingButton = await getByTestId('continue-shopping-button')

  const buttonText = await continueShoppingButton.evaluate(element => element.textContent)
  expect(buttonText).toBe('Continue shopping')

  await Promise.all([continueShoppingButton.click(), page.waitForNavigation({ waitUntil: 'networkidle0' })])

  expect(page.url()).toBe(baseURL)
}

export async function verifySignedInNavbar() {
  await page.waitForSelector('[data-testid="nav-home"]')
  const homeLink = await getByTestId('nav-home')
  expect(homeLink).not.toBeNull()

  const accountLink = await getByTestId('nav-account')
  expect(accountLink).not.toBeNull()

  const cartLink = await getByTestId('nav-cart')
  expect(cartLink).not.toBeNull()
}

export async function verifyFeedbackMessage(expectedMessage: string) {
  await page.waitForSelector('[data-testid="feedback-message"]', {
    visible: true,
  })

  const feedbackMessage = await page.$eval('[data-testid="feedback-message"]', element => element.textContent)

  expect(feedbackMessage).toBe(expectedMessage)
}

export async function clickBookLink(slug: string) {
  const bookLink = await getByTestId(`book-link-${slug}`)
  if (!bookLink) {
    throw new Error(`Book link with slug "${slug}" missing`)
  }

  await Promise.all([bookLink.click(), page.waitForNavigation({ waitUntil: 'networkidle0' })])

  const currentUrl = page.url()
  if (!currentUrl.endsWith(`/${slug}`)) {
    throw new Error(`Expected URL to end with /${slug}, but got ${currentUrl}`)
  }
}

export async function clickNavLink(dataTestID: string, path: string = '/') {
  const navLink = await getByTestId(dataTestID)
  if (!navLink) {
    throw new Error(`Nav link data-testid="${dataTestID}" missing`)
  }

  await Promise.all([navLink.click(), page.waitForNavigation({ waitUntil: 'networkidle0' })])

  const expectedPath = path.startsWith('/') ? baseURL.replace(/\/$/, '') + path : baseURL + path

  const currentUrl = page.url()
  if (currentUrl !== expectedPath) {
    throw new Error(`Expected URL to be ${expectedPath}, but got ${currentUrl}`)
  }
}

export async function clickElement(dataTestID: string) {
  const item = await page.waitForSelector(`[data-testid="${dataTestID}"]`)
  if (!item) {
    throw new Error(`Item with data-testid="${dataTestID}" missing`)
  }
  await item.click()
}

export async function expectCartCountToBe(itemCount: number): Promise<void> {
  const cartLink = await getByTestId('nav-cart')
  expect(cartLink).not.toBeNull()

  if (cartLink) {
    const cartText = await cartLink.evaluate(element => element.textContent)

    if (itemCount === 0) {
      expect(cartText).toBe('Cart')
    } else {
      expect(cartText).toBe(`Cart (${itemCount})`)
    }
  }
}

export async function findInLocalStorageCart(string: string) {
  const cartContent = await page.evaluate(() => {
    return localStorage.getItem('cart')
  })

  if (!cartContent) {
    return false
  }

  return cartContent.includes(string)
}

export async function verifyButton(testId: string, expectedText: string) {
  const button = await getByTestId(testId)
  if (!button) {
    throw new Error(`Button with test ID '${testId}' not found`)
  }

  const buttonText = await button.evaluate(element => element.textContent)
  expect(buttonText?.trim()).toBe(expectedText)
  return button
}

export async function addToCart(slug: string) {
  const button = await getByTestId(`cart-button-${slug}`)
  if (!button) {
    throw new Error(`'${slug}' toggle cart button not found`)
  }

  await Promise.all([button.click(), page.waitForNavigation({ waitUntil: 'networkidle0' })])
}

export async function removeFromCart(slug: string) {
  const button = await getByTestId(`cart-button-${slug}`)
  if (!button) {
    throw new Error(`'${slug}' toggle cart button not found`)
  }

  await button.click()
}

export async function waitForNavigationComplete() {
  try {
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    console.log('Navigation completed')
  } catch (error) {
    console.error('Navigation failed:', error)
    throw error
  }
}

export async function waitForElement(testId: string) {
  try {
    await page.waitForSelector(`[data-testid="${testId}"]`, {
      visible: true,
    })
    console.log(`Found element with data-testid="${testId}"`)
    return true
  } catch (error) {
    console.error(`Element with data-testid="${testId}" not found:`, error)
    throw error
  }
}

export async function expectUrlToBe(expectedUrl: string) {
  const actualUrl = page.url()
  const normalizedActualUrl = actualUrl.replace(/\/$/, '')
  const normalizedExpectedUrl = expectedUrl.replace(/\/$/, '')
  try {
    expect(normalizedActualUrl).toBe(normalizedExpectedUrl)
    console.log(`URL matches ${expectedUrl}`)
  } catch (error) {
    console.error(`URL mismatch - Expected: ${expectedUrl}, Got: ${actualUrl}`)
    throw error
  }
}
