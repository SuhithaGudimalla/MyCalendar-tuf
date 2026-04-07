import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, eachDayOfInterval, isSameDay,
  isToday, isWeekend, format, differenceInDays, isBefore, isAfter
} from 'date-fns';

export interface CalendarNote {
  date: string;
  text: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

const STORAGE_KEYS = {
  notes: 'calendar-notes',
  heroImage: 'calendar-hero-image',
  birthday: 'calendar-birthday',
  theme: 'calendar-theme',
};

export function useCalendarState() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || '{}');
    } catch { return {}; }
  });
  const [heroImage, setHeroImage] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.heroImage)
  );
  const [birthday, setBirthday] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.birthday)
  );
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.theme) === 'dark'
  );
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (heroImage) localStorage.setItem(STORAGE_KEYS.heroImage, heroImage);
    else localStorage.removeItem(STORAGE_KEYS.heroImage);
  }, [heroImage]);

  useEffect(() => {
    if (birthday) localStorage.setItem(STORAGE_KEYS.birthday, birthday);
    else localStorage.removeItem(STORAGE_KEYS.birthday);
  }, [birthday]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);



  const goNextMonth = useCallback(() => {
    setFlipDirection(1);
    setCurrentMonth(m => addMonths(m, 1));
  }, []);
  const goPrevMonth = useCallback(() => {
    setFlipDirection(-1);
    setCurrentMonth(m => subMonths(m, 1));
  }, []);

  const handleDateClick = useCallback((day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  }, []);

  const handleRangeClick = useCallback((day: Date) => {
    setDateRange(prev => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: day, end: null };
      }
      if (isBefore(day, prev.start)) {
        return { start: day, end: prev.start };
      }
      return { ...prev, end: day };
    });
  }, []);

  const resetRange = useCallback(() => setDateRange({ start: null, end: null }), []);

  const isInRange = useCallback((day: Date) => {
    if (!dateRange.start || !dateRange.end) return false;
    return (isAfter(day, dateRange.start) || isSameDay(day, dateRange.start)) &&
           (isBefore(day, dateRange.end) || isSameDay(day, dateRange.end));
  }, [dateRange]);

  const isRangeStart = useCallback((day: Date) =>
    dateRange.start ? isSameDay(day, dateRange.start) : false
  , [dateRange.start]);

  const isRangeEnd = useCallback((day: Date) =>
    dateRange.end ? isSameDay(day, dateRange.end) : false
  , [dateRange.end]);

  const rangeDuration = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return null;
    return differenceInDays(dateRange.end, dateRange.start) + 1;
  }, [dateRange]);

  const saveNote = useCallback((date: string, text: string) => {
    setNotes(prev => ({ ...prev, [date]: text }));
  }, []);

  const deleteNote = useCallback((date: string) => {
    setNotes(prev => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }, []);

  const hasNote = useCallback((day: Date) => {
    const key = format(day, 'yyyy-MM-dd');
    return !!notes[key]?.trim();
  }, [notes]);

  const isBirthdayToday = useMemo(() => {
    if (!birthday) return false;
    const today = new Date();
    const [m, d] = birthday.split('-').map(Number);
    return today.getMonth() + 1 === m && today.getDate() === d;
  }, [birthday]);

  const currentMonthNum = currentMonth.getMonth();

  return {
    currentMonth, currentMonthNum, calendarDays, flipDirection,
    goNextMonth, goPrevMonth,
    selectedDate, handleDateClick, handleRangeClick,
    dateRange, resetRange, isInRange, isRangeStart, isRangeEnd, rangeDuration,
    isModalOpen, setIsModalOpen,
    notes, saveNote, deleteNote, hasNote,
    heroImage, setHeroImage,
    birthday, setBirthday, isBirthdayToday,
    isDark, setIsDark,
  };
}
