import { access, readFile } from 'node:fs/promises'

/**
 * @returns {string[]}
 */
export async function getRoots() {
  try {
    await access(process.env.ROOTS)
    return (await readFile(process.env.ROOTS)).toString('utf8')
      .split(process.env.ROOTS_SEPARATOR ?? ',')
      .map(e => e.trim())
  } catch {}

  return process.env.ROOTS ?? ''
    .split(process.env.ROOTS_SEPARATOR ?? ',')
    .map(e => e.trim())
}