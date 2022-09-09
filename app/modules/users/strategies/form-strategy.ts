import type { Password, User } from '@prisma/client'
import { FormStrategy } from 'remix-auth-form'
import bcrypt from '@node-rs/bcrypt'
import { prisma } from '@/db.server'
import { AuthorizationError } from 'remix-auth'

async function login(email: User['email'], password: Password['hash']) {
  const userWithPassword = await prisma.user.findUnique({
    include: { password: true },
    where: { email },
  })

  if (!userWithPassword || !userWithPassword.password) return null

  const isValid = await bcrypt.verify(password, userWithPassword.password.hash)

  if (!isValid) return null

  const { password: _password, ...userWithoutPassword } = userWithPassword

  return userWithoutPassword
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
