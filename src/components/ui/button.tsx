import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<string, string> = {
  primary:   'bg-[#B91C1C] text-white hover:bg-[#991B1B]',
  secondary: 'bg-[#F9FAFB] text-[#18181B] border border-[rgba(226,232,240,0.7)] hover:bg-gray-100',
  ghost:     'text-[#71717A] hover:bg-gray-100 hover:text-[#18181B]',
  danger:    'bg-[#FEF2F2] text-[#B91C1C] hover:bg-red-100',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-5 py-2.5 text-sm rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
)

Button.displayName = 'Button'
