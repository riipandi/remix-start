import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '#/components/base-ui'

// TODO: add test render variants and sizes
describe('Button', () => {
  // Test rendering of the button component
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeDefined()
  })

  // Test loading state
  describe('loading state', () => {
    it('shows loader icon when loading', () => {
      render(<Button isLoading>Loading</Button>)
      const [button] = screen.getAllByText('Loading')
      const loader = button.querySelector('svg')

      expect(button.closest('button')).toHaveAttribute('data-loading', 'true')
      expect(loader).toBeInTheDocument()
    })

    it('disables button when loading', () => {
      render(<Button isLoading>Loading State</Button>)
      const [button] = screen.getAllByText('Loading State')
      expect(button.closest('button')).toHaveAttribute('disabled')
    })
  })

  // Test disabled state
  describe('disabled state', () => {
    it('renders disabled state correctly', () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      )
      const [button] = screen.getAllByText('Disabled Button')

      expect(button.closest('button')).toHaveAttribute('disabled')
      button.click()
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  // Test with icon
  describe('icon button', () => {
    it('renders icon size correctly', () => {
      render(<Button size="icon">🔍</Button>)
      const [button] = screen.getAllByText('🔍')
      expect(button.className).toContain('size-9')
    })
  })

  // Test custom className
  it('accepts and applies custom className', () => {
    const customClass = 'my-custom-class'
    render(<Button className={customClass}>Custom Button</Button>)
    const [button] = screen.getAllByText('Custom Button')
    expect(button.className).toContain(customClass)
  })

  // Test default props
  it('renders with default props', () => {
    render(<Button>Default Button</Button>)
    const [button] = screen.getAllByText('Default Button')
    expect(button.closest('button')).not.toHaveAttribute('data-loading')
  })
})
