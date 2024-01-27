import { join } from 'node:path'

async function getCreds() {
  let creds = {
    user: process.env.EDU_USER,
    pass: process.env.EDU_PASSWORD
  }
  if(creds.user && creds.pass) return creds

  creds = await import(join(process.env.HOME, '.s21.mjs'))

  return {
    user: creds.default.username,
    pass: creds.default.password
  }
}

/**
 * @param {import("playwright").Page} page
 */
export async function auth(page) {
  const creds = await getCreds()

  await page.goto('/')

  await page.getByLabel('login').fill(creds.user)
  await page.getByLabel('password').fill(creds.pass)

  await page.getByText('Log in').click()

  await page.waitForLoadState('domcontentloaded')
  console.log(page.url())
}