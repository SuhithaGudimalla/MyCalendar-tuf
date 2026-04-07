import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, eachDayOfInterval, format, differenceInDays, isBefore
} from 'date-fns';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskRange {
  id: string;
  start: string;
  end: string;
  taskTitle: string;
  taskDescription: string;
  priority: TaskPriority;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface ImportantDate {
  id: string;
  date: string;
  title: string;
  description: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEYS = {
  notes: 'calendar-notes',
  heroImage: 'calendar-hero-image',
  birthday: 'calendar-birthday',
  theme: 'calendar-theme',
  ranges: 'calendar-ranges',
  importantDates: 'calendar-important-dates',
  moods: 'calendar-moods',
};

const DEFAULT_PASTEL_COLORS = ['#F8BBD0', '#D9C2FF', '#FFD8B5', '#BFE7FF', '#C7F2D4'] as const;

function toKey(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useCalendarState() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [draftRange, setDraftRange] = useState<DateRange>({ start: null, end: null });
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [activeRangeId, setActiveRangeId] = useState<string | null>(null);
  const [editingRangeId, setEditingRangeId] = useState<string | null>(null);

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || '{}'); } catch { return {}; }
  });
  const [heroImage, setHeroImage] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.heroImage)
  );
  const [birthday, setBirthday] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.birthday)
  );
  const [isDark, setIsDark] = useState(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    // Default to dark mode when the user has no previous preference.
    if (!storedTheme) return true;
    return storedTheme === 'dark';
  });
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);

  const [ranges, setRanges] = useState<TaskRange[]>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.ranges) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [importantDates, setImportantDates] = useState<ImportantDate[]>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.importantDates) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [moods, setMoods] = useState<Record<string, string>>(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.moods) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ranges, JSON.stringify(ranges));
  }, [ranges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.importantDates, JSON.stringify(importantDates));
  }, [importantDates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.moods, JSON.stringify(moods));
  }, [moods]);

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
    setIsNotesModalOpen(true);
  }, []);

  const handleRangeClick = useCallback((day: Date) => {
    setDraftRange(prev => {
      if (!prev.start || prev.end) {
        setActiveRangeId(null);
        setEditingRangeId(null);
        return { start: day, end: null };
      }
      const next = isBefore(day, prev.start) ? { start: day, end: prev.start } : { start: prev.start, end: day };
      setIsRangeModalOpen(true);
      return next;
    });
  }, []);

  const resetDraftRange = useCallback(() => {
    setDraftRange({ start: null, end: null });
    setIsRangeModalOpen(false);
    setEditingRangeId(null);
  }, []);

  const getRangesForDay = useCallback((day: Date) => {
    const key = toKey(day);
    return ranges.filter(r => r.start <= key && r.end >= key);
  }, [ranges]);

  const getPreferredRangeForDay = useCallback((day: Date) => {
    const list = getRangesForDay(day);
    if (!list.length) return null;
    const active = activeRangeId ? list.find(r => r.id === activeRangeId) : null;
    return active || list[0];
  }, [activeRangeId, getRangesForDay]);

  const getImportantDateForDay = useCallback((day: Date) => {
    const key = toKey(day);
    return importantDates.find(d => d.date === key) || null;
  }, [importantDates]);

  const getMoodEmojiForDay = useCallback((day: Date) => {
    const key = toKey(day);
    return moods[key] || '';
  }, [moods]);

  const saveMood = useCallback((date: string, emoji: string) => {
    setMoods(prev => ({ ...prev, [date]: emoji }));
  }, []);

  const clearMood = useCallback((date: string) => {
    setMoods(prev => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }, []);

  const draftRangeDuration = useMemo(() => {
    if (!draftRange.start || !draftRange.end) return null;
    return differenceInDays(draftRange.end, draftRange.start) + 1;
  }, [draftRange]);

  const activeRange = useMemo(
    () => (activeRangeId ? ranges.find(r => r.id === activeRangeId) || null : null),
    [activeRangeId, ranges],
  );

  const selectRange = useCallback((rangeId: string | null) => {
    setActiveRangeId(rangeId);
  }, []);

  const startEditRange = useCallback((rangeId: string) => {
    setEditingRangeId(rangeId);
    setIsRangeModalOpen(true);
    setActiveRangeId(rangeId);
    setDraftRange({ start: null, end: null });
  }, []);

  const deleteRange = useCallback((rangeId: string) => {
    setRanges(prev => prev.filter(r => r.id !== rangeId));
    setActiveRangeId(prev => (prev === rangeId ? null : prev));
  }, []);

  const saveRange = useCallback(
    (input: Omit<TaskRange, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      const now = Date.now();
      const id = input.id || editingRangeId || uid();
      setRanges(prev => {
        const existing = prev.find(r => r.id === id);
        const next: TaskRange = existing
          ? { ...existing, ...input, id, updatedAt: now }
          : { ...input, id, createdAt: now, updatedAt: now };
        return [next, ...prev.filter(r => r.id !== id)];
      });
      setActiveRangeId(id);
      setEditingRangeId(null);
      setIsRangeModalOpen(false);
      setDraftRange({ start: null, end: null });
    },
    [editingRangeId],
  );

  const upsertImportantDate = useCallback((input: Omit<ImportantDate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = Date.now();
    const id = input.id || uid();
    setImportantDates(prev => {
      const existing = prev.find(d => d.id === id);
      const next: ImportantDate = existing
        ? { ...existing, ...input, id, updatedAt: now }
        : { ...input, id, createdAt: now, updatedAt: now };
      return [next, ...prev.filter(d => d.id !== id)].sort((a, b) => a.date.localeCompare(b.date));
    });
  }, []);

  const deleteImportantDate = useCallback((id: string) => {
    setImportantDates(prev => prev.filter(d => d.id !== id));
  }, []);

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
    draftRange, draftRangeDuration, resetDraftRange,
    ranges, activeRangeId, activeRange, selectRange, startEditRange, deleteRange, saveRange,
    getRangesForDay, getPreferredRangeForDay,
    importantDates, getImportantDateForDay, upsertImportantDate, deleteImportantDate,
    moods, getMoodEmojiForDay, saveMood, clearMood,
    isNotesModalOpen, setIsNotesModalOpen,
    isRangeModalOpen, setIsRangeModalOpen, editingRangeId,
    notes, saveNote, deleteNote, hasNote,
    heroImage, setHeroImage,
    birthday, setBirthday, isBirthdayToday,
    isDark, setIsDark,
    DEFAULT_PASTEL_COLORS,
  };
}

