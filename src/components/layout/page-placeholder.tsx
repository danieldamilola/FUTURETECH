interface PlaceholderProps {
  title: string
  description?: string
  icon?: string
}

export function PagePlaceholder({ title, description, icon = '🚧' }: PlaceholderProps) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center">
      <span className="text-5xl mb-6 select-none">{icon}</span>
      <h1
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: '#18181B' }}
      >
        {title}
      </h1>
      {description && (
        <p className="text-sm max-w-xs" style={{ color: '#71717A' }}>
          {description}
        </p>
      )}
    </main>
  )
}
