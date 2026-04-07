import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const QUOTES_BY_MONTH = [
  'New year, fresh pages, quiet courage.',
  'Lead with heart and steady intention.',
  'Tiny growth still counts as growth.',
  'Let progress bloom one day at a time.',
  'Build momentum, then protect your peace.',
  'Make room for joy and meaningful work.',
  'Stay bright, even when days feel long.',
  'Finish strong and stay consistent.',
  'Reset routines, refocus goals.',
  'Trust the process and keep moving.',
  'Be grateful, grounded, and brave.',
  'Reflect, celebrate, then begin again.',
] as const;

interface QuoteSectionProps {
  currentMonth: Date;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ currentMonth }) => {
  const quote = useMemo(() => {
    return QUOTES_BY_MONTH[currentMonth.getMonth()];
  }, [currentMonth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="px-4 py-1.5 text-center"
    >
      <p className="text-[11px] text-muted-foreground italic font-body leading-relaxed">
        "{quote}"
      </p>
    </motion.div>
  );
};

export default React.memo(QuoteSection);
