import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClasses, type ButtonStyleProps } from './button-styles'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, block, className, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses({ variant, size, block }, className)} {...props} />
})

export type ButtonLinkProps = LinkProps & ButtonStyleProps

/** Enlace con aspecto de botón (navega: no es una acción). */
export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant, size, block, className, ...props },
  ref,
) {
  return <Link ref={ref} className={buttonClasses({ variant, size, block }, className)} {...props} />
})
