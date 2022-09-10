import { useMatchesData } from '@/hooks/useMatchesData'
import type { User } from '@prisma/client'

function isUser(user: User): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string'
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root')
  // TODO: replace this type with UserSession
  const userSession: any = data?.userSession
  const user = userSession.user

  if (!data || !isUser(user)) {
    return undefined
  }

  return user
}
