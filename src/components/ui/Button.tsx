import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/utils'
type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'text'
}
type ButtonLinkProps = ComponentPropsWithoutRef<'a'> & {
  variant?: 'primary' | 'secondary' | 'text'
}
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={cn('button', `button-${variant}`, className)} {...props} />
}
export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <a className={cn('button', `button-${variant}`, className)} {...props} />
}
