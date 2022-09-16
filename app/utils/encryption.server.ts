import bcrypt from '@node-rs/bcrypt'

/**
 * Hash password with bcrypt
 * @return {string} password hash
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password)
}

/**
 * Match password against the stored hash
 */
export const matchPassword = async (password: string, hash: string): Promise<Boolean> => {
  return await bcrypt.verify(password, hash)
}
