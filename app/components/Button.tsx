import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

const button = tv({
  defaultVariants: { variant: 'primary', size: 'md' },
  base: 'rounded-lg text-center font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4',
  variants: {
    variant: {
      primary:
        'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 focus:ring-primary-300 dark:focus:ring-primary-800',
      secondary:
        'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 focus:ring-blue-300 dark:focus:ring-blue-800',
      destructive:
        'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 focus:ring-rose-300 dark:focus:ring-rose-800',
    },
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-4 text-base',
    },
  },
})

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { type = 'button', variant, size, children, ...rest } = props
  return (
    <button ref={ref} type={type} className={button({ size, variant })} {...rest}>
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
