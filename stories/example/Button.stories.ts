import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import Button from '@/components/Button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {},
  // This component will have an automatically generated Autodocs entry.
  // @ref: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: { control: { type: 'select' }, options: ['primary', 'secondary', 'destructive'] },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked.
  // @ref: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
}

export const Large: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'lg',
  },
}

export const Small: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'sm',
  },
}
