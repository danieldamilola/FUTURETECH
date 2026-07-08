interface BadgeProps {
  children: React.ReactNode
  color?: string
}

export function Badge({ children, color = '#F3F4F6' }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: color, color: '#374151' }}
    >
      {children}
    </span>
  )
}

export function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF2F2] text-[#B91C1C] cursor-pointer hover:bg-red-100 transition-colors">
      #{tag}
    </span>
  )
}
