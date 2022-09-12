export function validateEmail(email: string): email is string {
  return typeof email === 'string' && email.length > 3 && email.includes('@')
}
