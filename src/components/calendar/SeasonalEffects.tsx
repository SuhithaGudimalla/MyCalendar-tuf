import React, { useMemo } from 'react';

type Season = 'winter' | 'spring' | 'summer' | 'autumn';

function getSeason(month: number): Season {
  if ([11, 0, 1].includes(month)) return 'winter';
  if ([2, 3, 4].includes(month)) return 'spring';
  if ([5, 6, 7].includes(month)) return 'summer';
  return 'autumn';
}

const SeasonalEffects: React.FC<{ month: number }> = ({ month }) => {
  const season = getSeason(month);

  const particles = useMemo(() => {
    const count = season === 'summer' ? 26 : 30;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      // negative delay makes particles appear already in motion on mount
      delay: -(Math.random() * 12),
      duration: 5 + Math.random() * 6,
      size: 4 + Math.random() * 8,
      swayAmount: 20 + Math.random() * 40,
      startTop: -(8 + Math.random() * 92),
    }));
  }, [season]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {season === 'summer' && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(255,200,50,0.08) 0%, transparent 50%)',
          }}
        />
      )}
      {particles.map(p => {
        if (season === 'winter') {
          return (
            <div
              key={p.id}
              className="seasonal-particle snow-particle"
              style={{
                left: `${p.left}%`,
                top: `${p.startTop}vh`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(200,220,255,0.4))',
                boxShadow: '0 0 6px rgba(255,255,255,0.5)',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          );
        }
        if (season === 'autumn') {
          const colors = ['#e67e22', '#d35400', '#c0392b', '#f39c12', '#e74c3c', '#f1c40f'];
          return (
            <div
              key={p.id}
              className="seasonal-particle leaf-particle"
              style={{
                left: `${p.left}%`,
                top: `${p.startTop}vh`,
                width: p.size + 4,
                height: p.size + 2,
                borderRadius: '50% 0 50% 0',
                background: `linear-gradient(135deg, ${colors[p.id % colors.length]}, ${colors[(p.id + 1) % colors.length]})`,
                opacity: 0.7,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          );
        }
        // spring + summer flowers
        const flowerColors = season === 'summer'
          ? ['#ffd6e7', '#ffe7b3', '#ffd9f6', '#fff2cc', '#ffc9de', '#ffe2a8']
          : ['#f8c8dc', '#ffdff0', '#f3e5f5', '#ffe4f2', '#f9d4e8', '#fce4ec'];
        return (
          <div
            key={p.id}
            className="seasonal-particle flower-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.startTop}vh`,
              width: p.size + 3,
              height: p.size + 3,
              borderRadius: '50% 40% 55% 45%',
              background: `radial-gradient(circle, ${flowerColors[p.id % flowerColors.length]}, rgba(255,255,255,0.25))`,
              opacity: season === 'summer' ? 0.65 : 0.55,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default React.memo(SeasonalEffects);
