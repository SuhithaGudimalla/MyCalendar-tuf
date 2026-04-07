import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Cake } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  birthday: string | null;
  setBirthday: (v: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, setIsDark, birthday, setBirthday }) => {
  const [showBday, setShowBday] = useState(false);
  const [bdayInput, setBdayInput] = useState(birthday || '');

  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <h1 className="text-lg font-heading font-bold text-foreground tracking-tight">
        My Calendar
      </h1>
      <div className="flex items-center gap-1.5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBday(!showBday)}
          className="p-1.5 rounded-full bg-secondary text-secondary-foreground"
          title="Set birthday"
        >
          <Cake size={14} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className="p-1.5 rounded-full bg-secondary text-secondary-foreground"
          title="Toggle theme"
          transition={{ duration: 0.3 }}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </motion.button>
      </div>
      {showBday && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 right-2 z-50 bg-card border border-border rounded-lg p-2.5 shadow-lg"
        >
          <label className="text-[10px] font-body text-muted-foreground block mb-1">Birthday (MM-DD)</label>
          <input
            type="text"
            placeholder="12-25"
            value={bdayInput}
            onChange={e => setBdayInput(e.target.value)}
            className="w-20 text-xs px-2 py-1 rounded border border-input bg-background text-foreground font-body"
          />
          <div className="flex gap-1 mt-1.5">
            <button
              onClick={() => { setBirthday(bdayInput || null); setShowBday(false); }}
              className="text-[10px] px-2 py-0.5 rounded bg-primary text-primary-foreground font-body"
            >Save</button>
            <button
              onClick={() => setShowBday(false)}
              className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-body"
            >Cancel</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(Header);
