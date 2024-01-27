/**
 * Возвращает список ссылок на странице имхо по самой оптимальной стратегии
 * @param {number} bidNum Сколько итераций ждать изменений списка
 * @param {number} queryTime Время итерации
 * @param {import("playwright").Page} page
 */
async function waitForLinks(page, bidNum = 10, queryTime = 1000) {
  return new Promise((res) => {
    let links = []
    let bid = 0

    const interval = setInterval(async () => {
      const n = await page.$$('a')
      if(n.length != links.length) {
        bid = 0
      } else if(bid >= bidNum) {
        clearInterval(interval)
        res(links)
      } else {
        bid += 1
      }

      links = n
    }, queryTime)
  })
}

/**
 * @param {import("playwright").Page} page
 * @param {string} url
 * @param {Set} visited Не посещать дважды
 */
export async function rip(page, url, visited = new Set()) {
  await page.goto(url)
  visited.add(url.replaceAll('/', ''))

  await new Promise(res => setTimeout(res, 20000))

  const links = await Promise.all(
    (await waitForLinks(page)).map(e => 
      e.getAttribute('href')
    )
  )
  console.log(url)

  for(const link of links) {
    if(visited.has(link.replaceAll('/', ''))) continue

    await rip(page, link, visited)
  }
}