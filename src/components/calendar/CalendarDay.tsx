import React from 'react';
import { motion } from 'framer-motion';
import { isToday, isWeekend, isSameMonth, format } from 'date-fns';
import type { ImportantDate, TaskRange } from '@/hooks/useCalendarState';

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  hasNote: boolean;
  savedRange: TaskRange | null;
  isInSavedRange: boolean;
  isSavedRangeStart: boolean;
  isSavedRangeEnd: boolean;
  isInDraftRange: boolean;
  isDraftRangeStart: boolean;
  isDraftRangeEnd: boolean;
  importantDate: ImportantDate | null;
  moodEmoji: string;
  onDateClick: (day: Date) => void;
  onRangeClick: (day: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day, currentMonth, hasNote, savedRange, isInSavedRange, isSavedRangeStart, isSavedRangeEnd, isInDraftRange, isDraftRangeStart, isDraftRangeEnd, importantDate, moodEmoji,
  onDateClick, onRangeClick,
}) => {
  const inMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const weekend = isWeekend(day);

  const dayKey = format(day, 'yyyy-MM-dd');
  const showSaved = isInSavedRange && !!savedRange;
  const showDraft = isInDraftRange && !showSaved;

  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)').matches : false;
  const [longPressTimer, setLongPressTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [isLongPressed, setIsLongPressed] = React.useState(false);

  const startLongPress = React.useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    // Removed e.preventDefault() to avoid passive listener error
    if (longPressTimer) clearTimeout(longPressTimer);
    const timer = setTimeout(() => {
      setIsLongPressed(true);
      onRangeClick(day);
    }, 500);
    setLongPressTimer(timer);
  }, [isMobile, longPressTimer, onRangeClick, day]);

  const cancelLongPress = React.useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setIsLongPressed(false);
  }, [longPressTimer]);

  React.useEffect(() => {
    return () => {
      if (longPressTimer) clearTimeout(longPressTimer);
    };
  }, []);

  let bgClass = '';
  if (today && !showSaved && !showDraft) bgClass = 'bg-calendar-today text-primary-foreground';
  if ((isSavedRangeStart || isSavedRangeEnd) && showSaved) bgClass = 'bg-calendar-today text-primary-foreground';
  if ((isDraftRangeStart || isDraftRangeEnd) && showDraft) bgClass = 'bg-calendar-today text-primary-foreground';

  const rangeBg = showSaved
    ? `${savedRange?.color || '#F8BBD0'}33`
    : showDraft
      ? 'hsl(var(--calendar-range) / 0.35)'
      : undefined;

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        if (isMobile && isLongPressed) return; // Long press already handled
        if (e.shiftKey) onRangeClick(day);
        else onDateClick(day);
      }}
      onContextMenu={(e) => { e.preventDefault(); onRangeClick(day); }}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      onTouchCancel={cancelLongPress}
      className={`
        relative w-8 h-8 rounded-lg flex items-center justify-center text-xs font-body
        transition-colors duration-150 cursor-pointer ${isMobile ? 'touch-manipulation cursor-default' : 'cursor-pointer'}
        ${!inMonth ? 'opacity-30' : ''}
        ${weekend && inMonth && !today && !isSavedRangeStart && !isSavedRangeEnd && !isDraftRangeStart && !isDraftRangeEnd ? 'text-calendar-weekend' : ''}
        ${bgClass}
        ${!bgClass && inMonth ? 'hover:bg-calendar-hover' : ''}
        ${isLongPressed ? 'ring-2 ring-primary/50' : ''}
      `}
      style={rangeBg ? { background: rangeBg } : undefined}
      title={savedRange?.taskTitle || importantDate?.title || (moodEmoji ? `${format(day, 'PPP')} • Mood ${moodEmoji}` : `${format(day, 'PPP')} — ${isMobile ? 'Long press' : 'Shift+click / right-click'} for range`)}
    >
      {format(day, 'd')}
      {moodEmoji && (
        <span className="absolute top-0.5 left-0.5 text-[9px] leading-none">{moodEmoji}</span>
      )}
      {hasNote && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-calendar-note-dot" />
      )}
      {showSaved && (
        <span className="absolute bottom-0.5 right-1 w-1 h-1 rounded-full" style={{ background: savedRange?.color }} />
      )}
      {importantDate && (
        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-black/10 dark:ring-white/10" style={{ background: importantDate.color }} />
      )}
      {today && !showSaved && !showDraft && (
        <span className="absolute inset-0 rounded-lg ring-2 ring-calendar-today/30 pointer-events-none" />
      )}
      {(showSaved || showDraft) && (dayKey === savedRange?.start || dayKey === savedRange?.end || isDraftRangeStart || isDraftRangeEnd) && (
        <span className="absolute inset-0 rounded-lg ring-2 ring-black/5 dark:ring-white/10 pointer-events-none" />
      )}
    </motion.button>
  );
};

export default React.memo(CalendarDay);
