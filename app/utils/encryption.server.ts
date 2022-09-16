import { randomBytes, scryptSync } from 'crypto'

// Pass the password string and get hashed password back
// (and store only the hashed string in your database)
const encryptPassword = (password: string, salt: string) => {
  return scryptSync(password, salt, 32).toString('hex')
}

/**
 * Hash password with random salt
 * @return {string} password hash followed by salt
 *  XXXX till 64 XXXX till 32
 *
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Any random string here (ideally should be atleast 16 bytes)
  const salt = randomBytes(16).toString('hex')
  return encryptPassword(password, salt) + salt
}

/**
 * Match password against the stored hash
 */
export const matchPassword = async (passowrd: string, hash: string): Promise<Boolean> => {
  // extract salt from the hashed string
  // our hex password length is 32*2 = 64
  const salt = hash.slice(64)
  const originalPassHash = hash.slice(0, 64)
  const currentPassHash = encryptPassword(passowrd, salt)
  return originalPassHash === currentPassHash
}
