import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCalendarState } from '@/hooks/useCalendarState';
import Header from './Header';
import HeroSection from './HeroSection';
import CalendarDay from './CalendarDay';
import NotesModal from './NotesModal';
import SeasonalEffects from './SeasonalEffects';
import BirthdayConfetti from './BirthdayConfetti';
import QuoteSection from './QuoteSection';
import RangeModal from './RangeModal';
import TaskPanel from './TaskPanel';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pageFlipVariants = {
  enter: (dir: number) => ({
    rotateX: dir > 0 ? -90 : 90,
    opacity: 0,
    transformOrigin: dir > 0 ? 'bottom center' : 'top center',
  }),
  center: {
    rotateX: 0,
    opacity: 1,
    transformOrigin: 'center center',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: (dir: number) => ({
    rotateX: dir > 0 ? 90 : -90,
    opacity: 0,
    transformOrigin: dir > 0 ? 'top center' : 'bottom center',
    transition: {
      duration: 0.35,
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  }),
};

const pageCurlVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    rotate: dir > 0 ? 7 : -7,
    scale: 0.94,
  }),
  center: {
    opacity: 0,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: (dir: number) => ({
    opacity: 0.95,
    rotate: dir > 0 ? -8 : 8,
    scale: 1.03,
    transition: {
      duration: 0.28,
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  }),
};

const Calendar: React.FC = () => {
  const state = useCalendarState();

  return (
    <div className="min-h-screen flex items-center justify-center p-3 md:p-4 overflow-hidden relative">
      {/* Full-page seasonal effects */}
      <SeasonalEffects month={state.currentMonthNum} />

      {/* Birthday confetti - full page */}
      <BirthdayConfetti active={state.isBirthdayToday} />

      <div className="w-full max-w-[1150px] relative z-10 flex flex-col lg:flex-row gap-3 md:gap-4 items-start justify-center">
        <div className="w-full max-w-[740px] relative flex flex-col" style={{ maxHeight: '96vh' }}>
        <Header
          isDark={state.isDark}
          setIsDark={state.setIsDark}
          birthday={state.birthday}
          setBirthday={state.setBirthday}
        />

        {/* Spiral binding */}
        <div className="flex justify-center gap-8 mb-0.5 relative z-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="spiral-ring" />
          ))}
        </div>

        {/* Calendar card with perspective for 3D flip */}
        <div className="relative flex-1 min-h-0" style={{ perspective: '1200px' }}>
          <AnimatePresence mode="wait" custom={state.flipDirection}>
            <motion.div
              key={format(state.currentMonth, 'yyyy-MM')}
              custom={state.flipDirection}
              variants={pageFlipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative bg-card rounded-xl overflow-hidden paper-texture calendar-card"
              style={{
                boxShadow:
                  '0 12px 48px -12px hsl(var(--calendar-shadow) / 0.5), 0 4px 12px hsl(var(--calendar-shadow) / 0.2), inset 0 1px 0 hsl(var(--calendar-paper) / 0.5)',
                backfaceVisibility: 'hidden',
              }}
            >
              <HeroSection
                currentMonth={state.currentMonth}
                heroImage={state.heroImage}
                setHeroImage={state.setHeroImage}
              />

              <QuoteSection currentMonth={state.currentMonth} />

              {/* Month navigation */}
              <div className="flex items-center justify-between px-4 py-1.5">
                <motion.button
                  whileHover={{ scale: 1.15, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={state.goPrevMonth}
                  className="p-1 rounded-full hover:bg-secondary text-foreground"
                >
                  <ChevronLeft size={16} />
                </motion.button>

                <span className="font-heading font-semibold text-foreground tracking-wide text-xs">
                  {format(state.currentMonth, 'MMMM yyyy')}
                </span>

                <motion.button
                  whileHover={{ scale: 1.15, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={state.goNextMonth}
                  className="p-1 rounded-full hover:bg-secondary text-foreground"
                >
                  <ChevronRight size={16} />
                </motion.button>
              </div>

              {/* Range info */}
              {state.draftRangeDuration && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-0.5 flex items-center justify-between"
                >
                  <span className="text-[10px] font-body text-muted-foreground">
                    {state.draftRangeDuration} day{state.draftRangeDuration > 1 ? 's' : ''} selected
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={state.resetDraftRange}
                    className="text-[10px] flex items-center gap-1 text-muted-foreground hover:text-foreground font-body"
                  >
                    <X size={10} /> Clear
                  </motion.button>
                </motion.div>
              )}

              {/* Weekday headers */}
              <div className="grid grid-cols-7 px-4">
                {WEEKDAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-body font-medium text-muted-foreground py-0.5">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 px-4 pb-2">
                {state.calendarDays.map(day => {
                  const preferred = state.getPreferredRangeForDay(day);
                  const dayKey = format(day, 'yyyy-MM-dd');
                  const inSaved = !!preferred;
                  const savedStart = preferred ? preferred.start === dayKey : false;
                  const savedEnd = preferred ? preferred.end === dayKey : false;
                  const draftStart = state.draftRange.start ? format(state.draftRange.start, 'yyyy-MM-dd') === dayKey : false;
                  const draftEnd = state.draftRange.end ? format(state.draftRange.end, 'yyyy-MM-dd') === dayKey : false;
                  const inDraft = !!state.draftRange.start && !!state.draftRange.end &&
                    format(state.draftRange.start, 'yyyy-MM-dd') <= dayKey &&
                    format(state.draftRange.end, 'yyyy-MM-dd') >= dayKey;

                  return (
                    <div key={day.toISOString()} className="flex justify-center">
                      <CalendarDay
                        day={day}
                        currentMonth={state.currentMonth}
                        hasNote={state.hasNote(day)}
                        savedRange={preferred}
                        isInSavedRange={inSaved}
                        isSavedRangeStart={savedStart}
                        isSavedRangeEnd={savedEnd}
                        isInDraftRange={inDraft}
                        isDraftRangeStart={draftStart}
                        isDraftRangeEnd={draftEnd}
                        importantDate={state.getImportantDateForDay(day)}
                        moodEmoji={state.getMoodEmojiForDay(day)}
                        onDateClick={state.handleDateClick}
                        onRangeClick={state.handleRangeClick}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="px-4 pb-2">
                <p className="text-[8px] text-muted-foreground font-body text-center opacity-50">
                  Click a date to add notes · Shift+click / long press to create a task range
                </p>
              </div>

              {/* Paper edge effect */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Book-like paper corner turn during page flip */}
              <motion.div
                key={`curl-main-${format(state.currentMonth, 'yyyy-MM')}`}
                custom={state.flipDirection}
                variants={pageCurlVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={`pointer-events-none absolute top-0 z-20 page-curl-corner ${
                  state.flipDirection > 0 ? 'forward' : 'backward'
                }`}
              />
              <motion.div
                key={`curl-under-${format(state.currentMonth, 'yyyy-MM')}`}
                custom={state.flipDirection}
                variants={pageCurlVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={`pointer-events-none absolute top-0 z-10 page-curl-under ${
                  state.flipDirection > 0 ? 'forward' : 'backward'
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <NotesModal
          isOpen={state.isNotesModalOpen}
          onClose={() => state.setIsNotesModalOpen(false)}
          date={state.selectedDate}
          notes={state.notes}
          moods={state.moods}
          onSave={state.saveNote}
          onDelete={state.deleteNote}
          onSaveMood={state.saveMood}
          onClearMood={state.clearMood}
        />

        <RangeModal
          isOpen={state.isRangeModalOpen}
          onClose={() => {
            state.setIsRangeModalOpen(false);
            state.resetDraftRange();
          }}
          draftRange={state.draftRange}
          editingRangeId={state.editingRangeId}
          ranges={state.ranges}
          defaultColors={[...state.DEFAULT_PASTEL_COLORS]}
          onSave={state.saveRange}
        />
      </div>

      <div className="w-full lg:w-[360px] lg:ml-auto lg:self-end lg:mt-0 lg:max-h-[96vh] lg:overflow-y-auto">
        <TaskPanel
          currentMonth={state.currentMonth}
          ranges={state.ranges}
          importantDates={state.importantDates}
          activeRangeId={state.activeRangeId}
          onSelectRange={state.selectRange}
          onEditRange={state.startEditRange}
          onDeleteRange={state.deleteRange}
          onUpsertImportantDate={state.upsertImportantDate}
          onDeleteImportantDate={state.deleteImportantDate}
          defaultColors={[...state.DEFAULT_PASTEL_COLORS]}
        />
      </div>
      </div>
    </div>
  );
};

export default Calendar;

