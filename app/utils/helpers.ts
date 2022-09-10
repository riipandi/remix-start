/**
 * Gets random int
 * @param min
 * @param max
 * @returns random int - min & max inclusive
 */
export function getRandomInt(min?: number, max?: number): number {
  min = Math.ceil(min || 1)
  max = Math.floor(max || 999)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
