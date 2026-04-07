import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, Trash2 } from 'lucide-react';

const MOOD_OPTIONS = ['😀', '🙂', '😊', '😌', '😎', '🥳', '😴', '😔', '😤', '🤒', '🤩', '🥰'];

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  notes: Record<string, string>;
  moods: Record<string, string>;
  onSave: (date: string, text: string) => void;
  onDelete: (date: string) => void;
  onSaveMood: (date: string, emoji: string) => void;
  onClearMood: (date: string) => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, date, notes, moods, onSave, onDelete, onSaveMood, onClearMood }) => {
  const dateKey = date ? format(date, 'yyyy-MM-dd') : '';
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  useEffect(() => {
    if (date) {
      setText(notes[dateKey] || '');
      setSelectedMood(moods[dateKey] || '');
    }
  }, [date, dateKey, notes, moods]);

  if (!date) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-heading font-semibold text-card-foreground">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-full hover:bg-secondary"
              >
                <X size={18} className="text-muted-foreground" />
              </motion.button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[11px] text-muted-foreground font-body mb-2">Mood diary</p>
                <div className="flex flex-wrap gap-1.5">
                  {MOOD_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedMood(emoji)}
                      className={`w-8 h-8 rounded-lg border text-sm transition ${
                        selectedMood === emoji ? 'border-ring bg-secondary' : 'border-input hover:bg-secondary/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                  {selectedMood && (
                    <button
                      type="button"
                      onClick={() => setSelectedMood('')}
                      className="px-2 py-1 rounded-md text-[11px] text-muted-foreground border border-input hover:bg-secondary/50"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write a note…"
                rows={5}
                className="w-full resize-none rounded-lg border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                style={{ fontFamily: 'var(--font-handwriting)', fontSize: '1.1rem' }}
              />
            </div>
            <div className="flex items-center justify-between p-4 border-t border-border">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { onDelete(dateKey); onClearMood(dateKey); onClose(); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 font-body"
              >
                <Trash2 size={14} /> Delete
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onSave(dateKey, text);
                  if (selectedMood) onSaveMood(dateKey, selectedMood);
                  else onClearMood(dateKey);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg text-sm bg-primary text-primary-foreground font-body font-medium"
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(NotesModal);
