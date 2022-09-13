import invariant from 'tiny-invariant'

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be set')
invariant(process.env.SESSION_STORAGE, 'SESSION_STORAGE must be set')

export const SESSION_SECRET = process.env.SESSION_SECRET
export const SESSION_KEY = 'user'
export const SESSION_ERROR_KEY = 'error'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days;
export const REFRESH_THRESHOLD = 60 * 10 // 10 minutes left before token expires
export const LOGIN_URL = '/auth/signin'
