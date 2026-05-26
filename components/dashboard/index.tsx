// Dashboard component stubs
// These will be implemented in the UI phase

'use client';

export function FlashCard({ task, duration, dayNumber }: { task: string; duration: string; dayNumber: number }) {
  return (
    <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Day {dayNumber}</p>
      <p className="text-xl font-semibold text-foreground mb-3">{task}</p>
      <p className="text-sm text-muted-foreground">⏱ {duration}</p>
    </div>
  );
}

export function DayGrid({ totalDays, completedDays }: { totalDays: number; completedDays: number[] }) {
  return (
    <div className="grid grid-cols-10 gap-1.5">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
        <div
          key={day}
          className={[
            'w-7 h-7 rounded-[999px] flex items-center justify-center text-xs font-medium',
            completedDays.includes(day)
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground',
          ].join(' ')}
        >
          {day}
        </div>
      ))}
    </div>
  );
}

export function AnchorBar({ why }: { why: string }) {
  return (
    <div className="rounded-[999px] border border-border bg-muted px-6 py-4">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your why</p>
      <p className="text-foreground font-medium">{why}</p>
    </div>
  );
}

export function PlanMap() {
  return (
    <div className="rounded-[2.5rem] border border-border bg-card p-8 text-muted-foreground text-center">
      Plan connection map — coming soon
    </div>
  );
}
