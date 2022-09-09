import type { Password, User } from '@prisma/client'
import { FormStrategy } from 'remix-auth-form'
import bcrypt from '@node-rs/bcrypt'
import { prisma } from '@/db.server'

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

export const formStrategy = new FormStrategy(async ({ form }) => {
  let email = form.get('email')
  let password = form.get('password')
  let user = await login(email, password)
  // the type of this user must match the type you pass to the Authenticator
  // the strategy will automatically inherit the type if you instantiate
  // directly inside the `use` method
  return user
})
