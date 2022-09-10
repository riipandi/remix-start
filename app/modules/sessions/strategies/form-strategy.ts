import type { Password, User } from '@prisma/client'
import { AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { verify } from '@node-rs/bcrypt'
import { prisma } from '@/db.server'
import type { UserSession } from '@/modules/users/auth.server'

async function login(email: User['email'], password: Password['hash']): Promise<UserSession | null> {
  const user = await prisma.user.findUnique({
    include: { password: true },
    where: { email },
  })

  if (!user || !user.password) return null

  const isValid = await verify(password, user.password.hash)

  if (!isValid) return null

  // Limit the result for session security.
  // const { password: _password, ...userWithoutPassword } = user
  // return userWithoutPassword

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
  }
}

export const formStrategy = new FormStrategy(async (request) => {
  let identity = request.form.get('email') as string
  let password = request.form.get('password') as string

  // Validate credentials input
  if (!identity || identity?.length === 0) throw new AuthorizationError('Email required!')
  if (typeof identity !== 'string') throw new AuthorizationError('Email must be string!')

  if (!password || password?.length === 0) throw new AuthorizationError('Password required!')
  if (typeof password !== 'string') throw new AuthorizationError('Password must be string!')

  let user = await login(identity, password)

  if (!user) throw new AuthorizationError('Invalid credentials')

  return user
})
