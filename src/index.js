import { chromium } from 'playwright'
import { auth } from './auth.js'
import { rip } from './rip.js'
import { getRoots } from './config.js'

const browser = await chromium.launch()
const page = await browser.newPage({
  baseURL: process.env.BASE_URL ?? 'https://edu.21-school.ru/',
  ...(process.env.HAR_OUTPUT ? {
    recordHar: {
      urlFilter: '/services/graphql',
      path: process.env.HAR_OUTPUT,
      content: 'embed',
      mode: 'minimal',
    }
  } : {}),
  ...(process.env.VIDEO_W && process.env.VIDEO_H ? {
    ...(process.env.VIDEO_DIR ? {
      recordVideo: {
        dir: process.env.VIDEO_DIR,
        size: {
          width: parseInt(process.env.VIDEO_W),
          height: parseInt(process.env.VIDEO_H),
        }
      },
    } : {}),
    viewport: {
      width: parseInt(process.env.VIDEO_W),
      height: parseInt(process.env.VIDEO_H),
    }
  } : {})
})

const visited = new Set()

await auth(page)

const roots = await getRoots()
console.log('Going for roots', roots)

for(const root of roots) {
  await rip(page, root, visited)
}

await page.close()
await browser.close()