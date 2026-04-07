import React from 'react';
import { motion } from 'framer-motion';
import { isToday, isWeekend, isSameMonth, format } from 'date-fns';

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  hasNote: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  onDateClick: (day: Date) => void;
  onRangeClick: (day: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day, currentMonth, hasNote, isInRange, isRangeStart, isRangeEnd,
  onDateClick, onRangeClick,
}) => {
  const inMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const weekend = isWeekend(day);

  let bgClass = '';
  if (isRangeStart || isRangeEnd) bgClass = 'bg-calendar-today text-primary-foreground';
  else if (isInRange) bgClass = 'bg-calendar-range';
  else if (today) bgClass = 'bg-calendar-today text-primary-foreground';

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        if (e.shiftKey) onRangeClick(day);
        else onDateClick(day);
      }}
      onContextMenu={(e) => { e.preventDefault(); onRangeClick(day); }}
      className={`
        relative w-8 h-8 rounded-lg flex items-center justify-center text-xs font-body
        transition-colors duration-150 cursor-pointer
        ${!inMonth ? 'opacity-30' : ''}
        ${weekend && inMonth && !today && !isRangeStart && !isRangeEnd ? 'text-calendar-weekend' : ''}
        ${bgClass}
        ${!bgClass && inMonth ? 'hover:bg-calendar-hover' : ''}
      `}
      title={`${format(day, 'PPP')}${hasNote ? ' (has note)' : ''} — Shift+click for range`}
    >
      {format(day, 'd')}
      {hasNote && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-calendar-note-dot" />
      )}
      {today && !isRangeStart && !isRangeEnd && (
        <span className="absolute inset-0 rounded-lg ring-2 ring-calendar-today/30 pointer-events-none" />
      )}
    </motion.button>
  );
};

export default React.memo(CalendarDay);
