import type { User } from '@prisma/client'

import { useMatchesData } from '@/hooks/useMatchesData'

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string'
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root')
  if (!data || !isUser(data?.user)) {
    return undefined
  }
  return data?.user
}
