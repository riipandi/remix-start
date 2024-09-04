import { type LinkProps, Link as RouterLink } from '@remix-run/react'
import type React from 'react'
import { forwardRef, useMemo } from 'react'
import { clx } from '#/utils/ui-helper'

interface CustomLinkProps extends LinkProps {
  newTab?: boolean
}

/**
 * A custom Link component that extends the functionality of the Remix Link component.
 * It adds support for opening links in a new tab and applies a consistent set of styles.
 *
 * @param props - The props for the Link component, including the standard Link props from Remix.
 * @param props.newTab - Whether to open the link in a new tab.
 * @param props.className - Additional CSS classes to apply to the link.
 * @param ref - A ref to the underlying anchor element.
 * @returns A Remix Link component with the custom functionality and styles applied.
 *
 * Example usage:
 * ```tsx
 * <Link to="/path" className="custom-class">Link Text</Link>
 * ```
 */
const Link = forwardRef(function Component(
  props: CustomLinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const { className, newTab, ...rest } = props
  const NEW_TAB_REL = 'noopener noreferrer'
  const NEW_TAB_TARGET = '_blank'
  const DEFAULT_TARGET = '_self'

  const linkClassName = useMemo(() => clx(className), [className])

  return (
    <RouterLink
      className={linkClassName}
      rel={newTab ? NEW_TAB_REL : undefined}
      target={newTab ? NEW_TAB_TARGET : DEFAULT_TARGET}
      ref={ref}
      {...rest}
    />
  )
})

export { Link }
