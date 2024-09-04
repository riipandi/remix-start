import { createRemixStub } from '@remix-run/testing'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it } from 'vitest'
import Index from '#/routes/_index'

describe('Homepage', () => {
  it('renders correctly', async () => {
    const RemixStub = createRemixStub([{ path: '/', Component: Index }])

    render(<RemixStub />)

    await waitFor(() =>
      screen.getByRole('heading', {
        name: /Welcome to Remix/i,
        level: 1,
      })
    )
  })
})
