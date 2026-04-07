import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const QUOTES = [
  "The only way to do great work is to love what you do.",
  "Every day is a fresh start.",
  "Believe you can and you're halfway there.",
  "Happiness depends upon ourselves.",
  "The best time for new beginnings is now.",
  "What lies behind us is nothing compared to what lies ahead.",
  "Be the change you wish to see in the world.",
  "Life is what happens when you're busy making other plans.",
  "Simplicity is the ultimate sophistication.",
  "In the middle of difficulty lies opportunity.",
  "The journey of a thousand miles begins with a single step.",
  "Stars can't shine without darkness.",
  "Do what you can, with what you have, where you are.",
  "Every moment is a fresh beginning.",
  "The future belongs to those who believe in their dreams.",
  "Act as if what you do makes a difference. It does.",
  "Turn your wounds into wisdom.",
  "Life is short. Smile while you still have teeth.",
  "Your only limit is your mind.",
  "Difficult roads often lead to beautiful destinations.",
];

const QuoteSection: React.FC = () => {
  const quote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

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
