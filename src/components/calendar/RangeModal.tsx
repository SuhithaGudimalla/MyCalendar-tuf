import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format, parse } from 'date-fns';
import { X } from 'lucide-react';
import type { TaskPriority, TaskRange } from '@/hooks/useCalendarState';

type RangeModalDraft = { start: Date | null; end: Date | null };

interface RangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftRange: RangeModalDraft;
  editingRangeId: string | null;
  ranges: TaskRange[];
  defaultColors: string[];
  onSave: (range: Omit<TaskRange, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const RangeModal: React.FC<RangeModalProps> = ({
  isOpen,
  onClose,
  draftRange,
  editingRangeId,
  ranges,
  defaultColors,
  onSave,
}) => {
  const editing = useMemo(
    () => (editingRangeId ? ranges.find(r => r.id === editingRangeId) || null : null),
    [editingRangeId, ranges],
  );

  const derived = useMemo(() => {
    if (editing) {
      return {
        start: parse(editing.start, 'yyyy-MM-dd', new Date()),
        end: parse(editing.end, 'yyyy-MM-dd', new Date()),
      };
    }
    return { start: draftRange.start, end: draftRange.end };
  }, [draftRange.end, draftRange.start, editing]);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [color, setColor] = useState(defaultColors[0] || '#F8BBD0');

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setTaskTitle(editing.taskTitle);
      setTaskDescription(editing.taskDescription);
      setPriority(editing.priority);
      setColor(editing.color || defaultColors[0] || '#F8BBD0');
      return;
    }
    setTaskTitle('');
    setTaskDescription('');
    setPriority('medium');
    setColor(defaultColors[Math.floor(Math.random() * defaultColors.length)] || '#F8BBD0');
  }, [defaultColors, editing, isOpen]);

  const canSave = !!derived.start && !!derived.end && taskTitle.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 18 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-heading font-semibold text-card-foreground">
                  {editing ? 'Edit task range' : 'New task range'}
                </h3>
                <span className="text-xs text-muted-foreground font-body">
                  {derived.start && derived.end
                    ? `${format(derived.start, 'MMM d')} – ${format(derived.end, 'MMM d')}`
                    : 'Select start and end'}
                </span>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title"
                className="w-full text-sm px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              />
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                className="w-full resize-none text-sm px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                >
                  {PRIORITY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2 flex-wrap">
                  {defaultColors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border ${color === c ? 'ring-2 ring-ring' : ''}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
              <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-sm bg-secondary text-secondary-foreground">Cancel</button>
              <button
                disabled={!canSave}
                onClick={() => {
                  if (!derived.start || !derived.end) return;
                  onSave({
                    id: editing?.id,
                    start: format(derived.start, 'yyyy-MM-dd'),
                    end: format(derived.end, 'yyyy-MM-dd'),
                    taskTitle: taskTitle.trim(),
                    taskDescription: taskDescription.trim(),
                    priority,
                    color,
                  });
                  onClose();
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  canSave ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(RangeModal);
