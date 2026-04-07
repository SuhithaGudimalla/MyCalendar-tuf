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

const Calendar: React.FC = () => {
  const state = useCalendarState();

  return (
    <div className="h-screen flex items-center justify-center p-2 bg-background overflow-hidden relative">
      {/* Full-page seasonal effects */}
      <SeasonalEffects month={state.currentMonthNum} />

      {/* Birthday confetti - full page */}
      <BirthdayConfetti active={state.isBirthdayToday} />

      <div className="w-full max-w-[500px] relative flex flex-col" style={{ maxHeight: '96vh' }}>
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

              <QuoteSection />

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
              {state.rangeDuration && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-0.5 flex items-center justify-between"
                >
                  <span className="text-[10px] font-body text-muted-foreground">
                    {state.rangeDuration} day{state.rangeDuration > 1 ? 's' : ''} selected
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={state.resetRange}
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
                {state.calendarDays.map(day => (
                  <div key={day.toISOString()} className="flex justify-center">
                    <CalendarDay
                      day={day}
                      currentMonth={state.currentMonth}
                      hasNote={state.hasNote(day)}
                      isInRange={state.isInRange(day)}
                      isRangeStart={state.isRangeStart(day)}
                      isRangeEnd={state.isRangeEnd(day)}
                      onDateClick={state.handleDateClick}
                      onRangeClick={state.handleRangeClick}
                    />
                  </div>
                ))}
              </div>

              <div className="px-4 pb-2">
                <p className="text-[8px] text-muted-foreground font-body text-center opacity-50">
                  Click a date to add notes · Shift+click for range
                </p>
              </div>

              {/* Paper edge effect */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <NotesModal
          isOpen={state.isModalOpen}
          onClose={() => state.setIsModalOpen(false)}
          date={state.selectedDate}
          notes={state.notes}
          onSave={state.saveNote}
          onDelete={state.deleteNote}
        />
      </div>
    </div>
  );
};

export default Calendar;
