import type { User } from '@/modules/users/user.server'
import { useMatchesData } from './useMatchesData'
import { isUser } from '@/utils/http'

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root')
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}
