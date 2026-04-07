import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Camera } from 'lucide-react';

const DEFAULT_IMAGES: Record<number, string> = {
  0: 'linear-gradient(135deg, #667eea, #764ba2)',
  1: 'linear-gradient(135deg, #f093fb, #f5576c)',
  2: 'linear-gradient(135deg, #4facfe, #00f2fe)',
  3: 'linear-gradient(135deg, #43e97b, #38f9d7)',
  4: 'linear-gradient(135deg, #fa709a, #fee140)',
  5: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  6: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
  7: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
  8: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  9: 'linear-gradient(135deg, #d4fc79, #96e6a1)',
  10: 'linear-gradient(135deg, #84fab0, #8fd3f4)',
  11: 'linear-gradient(135deg, #a6c0fe, #f68084)',
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
    ? { backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: DEFAULT_IMAGES[monthNum] };

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
