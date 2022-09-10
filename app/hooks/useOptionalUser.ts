import type { User } from '@prisma/client'
import { useMatchesData } from '@/hooks/useMatchesData'
import { isUser } from '@/utils/http'

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root')
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}
