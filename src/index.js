import { chromium } from 'playwright'
import { auth } from './auth.js'
import { rip } from './rip.js'
import { getRoots } from './config.js'

const browser = await chromium.launch()
const page = await browser.newPage({
  baseURL: process.env.BASE_URL ?? 'https://edu.21-school.ru/'
})

// page.on('request', async (req) => {
//   if(!req.url().endsWith('/graphql')) return
// })

const visited = new Set()

await auth(page)

const roots = await getRoots()
console.log('Going for roots', roots)

for(const root of roots) {
  await rip(page, root, visited)
}

await browser.close()