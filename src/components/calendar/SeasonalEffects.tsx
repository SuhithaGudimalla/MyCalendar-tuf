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
    const count = season === 'summer' ? 0 : 30;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 6,
      size: 4 + Math.random() * 8,
      swayAmount: 20 + Math.random() * 40,
    }));
  }, [season]);

  if (season === 'summer') {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255,200,50,0.08) 0%, transparent 50%)',
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => {
        if (season === 'winter') {
          return (
            <div
              key={p.id}
              className="seasonal-particle snow-particle"
              style={{
                left: `${p.left}%`,
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
        // spring
        const springColors = ['#f8c8dc', '#c8e6c9', '#fff9c4', '#bbdefb', '#f3e5f5', '#dcedc8'];
        return (
          <div
            key={p.id}
            className="seasonal-particle spring-particle"
            style={{
              left: `${p.left}%`,
              top: `${10 + Math.random() * 80}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${springColors[p.id % springColors.length]}, transparent)`,
              opacity: 0.5,
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
