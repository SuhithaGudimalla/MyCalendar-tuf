import React, { useMemo, useState } from 'react';
import { format, parse } from 'date-fns';
import { Trash2, Pencil } from 'lucide-react';
import type { ImportantDate, TaskRange } from '@/hooks/useCalendarState';

interface TaskPanelProps {
  currentMonth: Date;
  ranges: TaskRange[];
  importantDates: ImportantDate[];
  activeRangeId: string | null;
  defaultColors: string[];
  onSelectRange: (id: string | null) => void;
  onEditRange: (id: string) => void;
  onDeleteRange: (id: string) => void;
  onUpsertImportantDate: (input: Omit<ImportantDate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDeleteImportantDate: (id: string) => void;
}

function fmtRange(r: TaskRange) {
  return `${format(parse(r.start, 'yyyy-MM-dd', new Date()), 'MMM d')}–${format(parse(r.end, 'yyyy-MM-dd', new Date()), 'MMM d')}`;
}

const TaskPanel: React.FC<TaskPanelProps> = ({
  currentMonth,
  ranges,
  importantDates,
  activeRangeId,
  defaultColors,
  onSelectRange,
  onEditRange,
  onDeleteRange,
  onUpsertImportantDate,
  onDeleteImportantDate,
}) => {
  const [impDate, setImpDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [impTitle, setImpTitle] = useState('');
  const [impDesc, setImpDesc] = useState('');
  const [impColor, setImpColor] = useState(defaultColors[0] || '#F8BBD0');

  const upcoming = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return importantDates.filter(d => d.date >= today).slice(0, 6);
  }, [importantDates]);

  return (
    <div className="w-full lg:w-[330px] flex flex-col gap-2.5 md:gap-3">
      <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-sm">Productivity</h2>
          <span className="text-[10px] text-muted-foreground">{format(currentMonth, 'MMMM yyyy')}</span>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          <div className="rounded-lg bg-background border border-border p-1.5"><div className="text-[9px] text-muted-foreground">Tasks</div><div className="text-base font-heading font-bold">{ranges.length}</div></div>
          <div className="rounded-lg bg-background border border-border p-1.5"><div className="text-[9px] text-muted-foreground">Important</div><div className="text-base font-heading font-bold">{importantDates.length}</div></div>
          <div className="rounded-lg bg-background border border-border p-1.5"><div className="text-[9px] text-muted-foreground">High</div><div className="text-base font-heading font-bold">{ranges.filter(r => r.priority === 'high').length}</div></div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-semibold text-sm">Important Tasks</h2>
          <button onClick={() => onSelectRange(null)} className="text-[10px] text-muted-foreground">Clear</button>
        </div>
        <div className="mt-2.5 space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
          {ranges.length === 0 ? (
            <div className="text-xs text-muted-foreground">No task ranges yet.</div>
          ) : ranges.map(r => (
            <button
              key={r.id}
              onClick={() => onSelectRange(r.id)}
              className={`w-full text-left rounded-lg border p-2 ${activeRangeId === r.id ? 'border-ring bg-background' : 'border-border bg-background hover:bg-secondary/40'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                    <span className="font-heading font-semibold text-xs">{r.taskTitle}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{fmtRange(r)} · {r.priority}</div>
                </div>
                <div className="flex gap-1">
                  <span onClick={(e) => { e.stopPropagation(); onEditRange(r.id); }} className="p-1.5 rounded hover:bg-secondary"><Pencil size={14} /></span>
                  <span onClick={(e) => { e.stopPropagation(); onDeleteRange(r.id); }} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
        <h2 className="font-heading font-semibold text-sm">Important Dates</h2>
        <div className="mt-2.5 space-y-1.5">
          <input type="date" value={impDate} onChange={(e) => setImpDate(e.target.value)} className="w-full text-[11px] px-2 py-1.5 rounded-lg border border-input bg-background text-foreground" />
          <input value={impTitle} onChange={(e) => setImpTitle(e.target.value)} placeholder="Title" className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground" />
          <input value={impDesc} onChange={(e) => setImpDesc(e.target.value)} placeholder="Description (optional)" className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-input bg-background text-foreground" />
          <div className="flex items-center gap-2 flex-wrap">
            {defaultColors.map(c => (
              <button key={c} type="button" onClick={() => setImpColor(c)} className={`w-5 h-5 rounded-full border ${impColor === c ? 'ring-2 ring-ring' : ''}`} style={{ background: c }} />
            ))}
          </div>
          <button
            onClick={() => {
              if (!impDate || !impTitle.trim()) return;
              onUpsertImportantDate({ date: impDate, title: impTitle.trim(), description: impDesc.trim(), color: impColor });
              setImpTitle('');
              setImpDesc('');
            }}
            className="w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground"
          >
            Add important date
          </button>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-border space-y-1.5">
          {upcoming.map(d => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-2">
              <div>
                <div className="text-xs font-heading font-semibold">{d.title}</div>
                <div className="text-[10px] text-muted-foreground">{format(parse(d.date, 'yyyy-MM-dd', new Date()), 'PPP')}</div>
              </div>
              <button onClick={() => onDeleteImportantDate(d.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskPanel);
