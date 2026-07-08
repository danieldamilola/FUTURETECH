import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
}

export function Card({ children, className, hoverable }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-[rgba(226,232,240,0.7)]',
        'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
        hoverable && 'transition-shadow duration-200 hover:shadow-md cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
