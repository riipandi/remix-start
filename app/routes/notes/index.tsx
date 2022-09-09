import { useNavigate } from '@remix-run/react'
import type { MetaFunction } from '@remix-run/node'
import { EmptyState } from '@/components/EmptyState'

export const meta: MetaFunction = () => ({ title: 'Notes - Prismix' })

export default function NoteIndexPage() {
  const navigate = useNavigate()

  return (
    <div>
      <EmptyState action={() => navigate('new')} />
    </div>
  )
}
