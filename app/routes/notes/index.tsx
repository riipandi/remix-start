import { useNavigate } from '@remix-run/react'
import { EmptyState } from '@/components/EmptyState'

export default function NoteIndexPage() {
  const navigate = useNavigate()

  return (
    <div>
      <EmptyState action={() => navigate('new')} />
    </div>
  )
}
