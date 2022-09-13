import { verify } from '@node-rs/bcrypt'
import type { Password, User } from '@prisma/client'
import { AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'

import { prisma } from '@/db.server'

async function login(email: User['email'], password: Password['hash']): Promise<User | null> {
  const user = await prisma.user.findUnique({
    include: { password: true },
    where: { email },
  })

  if (!user || !user.password) return null

  const isValid = await verify(password, user.password.hash)

  if (!isValid) return null

  // Limit the result for session security.
  const { password: _password, ...userWithoutPassword } = user

  return userWithoutPassword
}

export const formStrategy = new FormStrategy(async (request) => {
  let identity = request.form.get('email') as string
  let password = request.form.get('password') as string
  let user = await login(identity, password)

  if (!user) throw new AuthorizationError('Invalid credentials')
  if (user && !user.emailVerifiedAt) throw new AuthorizationError('Your email not verified!')

  return { ...user }
})
