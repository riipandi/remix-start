import type { User } from '~/services/user.server'
import { useMatchesData } from './useMatchesData'
import { isUser } from '~/utils/auth-utils'

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root')
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}
