import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-[#71717A]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full rounded-xl px-4 py-2.5 text-sm bg-white text-[#18181B]',
          'border border-[rgba(226,232,240,0.7)] outline-none',
          'placeholder:text-[#A1A1AA]',
          'transition-all duration-200',
          'focus:border-[#B91C1C] focus:ring-2 focus:ring-[#B91C1C]/10',
          error && 'border-[#B91C1C] focus:ring-[#B91C1C]/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#B91C1C]">{error}</p>}
      {hint && !error && <p className="text-xs text-[#A1A1AA]">{hint}</p>}
    </div>
  )
)

Input.displayName = 'Input'
