import React, { useMemo } from 'react';

const COLORS = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#4caf50', '#ff9800', '#ffeb3b', '#00bcd4', '#ff5722'];

const BirthdayConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  const pieces = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 3,
      duration: 2.5 + Math.random() * 3,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
      shape: i % 3, // 0=rect, 1=circle, 2=triangle
    }))
  , []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.shape === 1 ? p.size : p.size * 0.6,
            background: p.shape === 2 ? 'transparent' : p.color,
            borderRadius: p.shape === 1 ? '50%' : 2,
            borderLeft: p.shape === 2 ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === 2 ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === 2 ? `${p.size}px solid ${p.color}` : undefined,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(BirthdayConfetti);
