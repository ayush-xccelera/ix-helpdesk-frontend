interface MiniLineChartDatum {
  date: string
  count: number
}

export function MiniLineChart({ data, title }: { data: MiniLineChartDatum[]; title: string }): JSX.Element {
  const width = 280
  const height = 100
  const paddingX = 10
  const paddingY = 10
  const maxValue = Math.max(1, ...data.map((item) => item.count))

  const points = data.map((item, index) => {
    const x = data.length > 1 ? paddingX + (index / (data.length - 1)) * (width - paddingX * 2) : width / 2
    const y = height - paddingY - (item.count / maxValue) * (height - paddingY * 2)
    return { x, y }
  })

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ')

  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-ink">{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full" role="img" aria-label={title}>
        <path d={linePath} fill="none" stroke="#0066cc" strokeWidth={2} />
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={3} fill="#0066cc" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-muted">
        {data.map((item) => (
          <span key={item.date}>{item.date.slice(5)}</span>
        ))}
      </div>
    </div>
  )
}
