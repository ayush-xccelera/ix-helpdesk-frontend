interface BarChartDatum {
  label: string
  value: number
  colorClassName: string
}

export function BarChart({ data, title }: { data: BarChartDatum[]; title: string }): JSX.Element {
  const maxValue = Math.max(1, ...data.map((item) => item.value))

  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-ink">{title}</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs text-muted">{item.label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full rounded-full ${item.colorClassName}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-xs font-medium text-ink">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
