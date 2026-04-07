import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Camera } from 'lucide-react';

const DEFAULT_IMAGES: Record<number, string> = {
  // Winter
  0: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1600&q=80',
  1: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1600&q=80',
  // Spring
  2: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80',
  3: 'https://images.unsplash.com/photo-1470093851219-69951fcbb533?auto=format&fit=crop&w=1600&q=80',
  4: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  // Summer
  5: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
  6: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
  7: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80',
  // Autumn
  8: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  9: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  10: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80',
  // Late autumn / early winter
  11: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80',
};

interface HeroSectionProps {
  currentMonth: Date;
  heroImage: string | null;
  setHeroImage: (v: string | null) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ currentMonth, heroImage, setHeroImage }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const monthNum = currentMonth.getMonth();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setHeroImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const bgStyle = heroImage
    ? {
        backgroundImage: `linear-gradient(rgba(10, 14, 24, 0.2), rgba(10, 14, 24, 0.2)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        backgroundImage: `linear-gradient(rgba(10, 14, 24, 0.24), rgba(10, 14, 24, 0.24)), url(${DEFAULT_IMAGES[monthNum]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

  return (
    <div className="relative overflow-hidden rounded-t-xl" style={{ height: 140 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentMonth, 'yyyy-MM')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={bgStyle}
        />
      </AnimatePresence>

      {/* Geometric overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-2 -right-10 w-32 h-32 bg-card/20 rotate-45" />
        <div className="absolute -top-5 -left-5 w-20 h-20 bg-card/10 rotate-12 rounded-lg" />
        <div className="absolute bottom-3 left-6 w-12 h-12 border-2 border-card/20 rotate-45" />
      </div>

      {/* Month/Year overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={format(currentMonth, 'yyyy-MM')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-heading font-bold drop-shadow-lg" style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              {format(currentMonth, 'MMMM')}
            </h2>
            <p className="text-base font-body font-light tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {format(currentMonth, 'yyyy')}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Upload button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileRef.current?.click()}
        className="absolute bottom-2 right-2 z-20 p-1.5 rounded-full shadow-lg"
        style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', color: 'white' }}
        title="Upload cover image"
      >
        <Camera size={14} />
      </motion.button>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default React.memo(HeroSection);
