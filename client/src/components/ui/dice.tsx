import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { AudioManager } from '@/lib/audio';

interface DiceProps {
  value: number;
  rolling: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Dice({ value, rolling, size = 'md', className, onClick }: DiceProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (rolling) {
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [rolling, value]);

  const sizeClasses = {
    sm: 'w-16 h-16 p-2 rounded-xl',
    md: 'w-24 h-24 p-3 rounded-2xl',
    lg: 'w-32 h-32 p-4 rounded-3xl',
  };

  const dotSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const dots = {
    1: ['justify-center items-center'],
    2: ['justify-between items-start'], // Special case handled manually
    3: ['justify-between items-start'], // Special case handled manually
    4: ['justify-between'],
    5: ['justify-between'],
    6: ['justify-between'],
  };

  // Helper to render dots based on value
  const renderDots = (val: number) => {
    const dSize = dotSizes[size];
    const dotClass = `rounded-full bg-slate-800 ${dSize} shadow-inner`;

    if (val === 1) return <div className={dotClass} />;
    
    if (val === 2) return (
      <>
        <div className={dotClass} />
        <div className={dotClass} style={{ alignSelf: 'flex-end' }} />
      </>
    );

    if (val === 3) return (
      <>
        <div className={dotClass} />
        <div className={dotClass} style={{ alignSelf: 'center' }} />
        <div className={dotClass} style={{ alignSelf: 'flex-end' }} />
      </>
    );

    if (val === 4) return (
      <>
        <div className="flex flex-col justify-between h-full">
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
      </>
    );

    if (val === 5) return (
      <>
        <div className="flex flex-col justify-between h-full">
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
        <div className="flex flex-col justify-center h-full">
           <div className={dotClass} />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
      </>
    );

    if (val === 6) return (
      <>
        <div className="flex flex-col justify-between h-full">
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
      </>
    );
  };

  return (
    <motion.div
      onClick={() => {
        if (!rolling && onClick) {
          AudioManager.playSfx('pop');
          onClick();
        }
      }}
      animate={rolling ? { 
        rotate: [0, 15, -15, 10, -10, 0],
        scale: [1, 1.1, 0.9, 1.05, 1],
        y: [0, -20, 0, -10, 0]
      } : { rotate: 0, scale: 1, y: 0 }}
      transition={rolling ? { duration: 0.5, repeat: Infinity } : { type: "spring", stiffness: 300, damping: 15 }}
      className={cn(
        'bg-white border-4 border-slate-200 shadow-[0_8px_0_rgba(0,0,0,0.1)] flex justify-between p-4 cursor-pointer select-none active:translate-y-1 active:shadow-none transition-shadow',
        sizeClasses[size],
        className
      )}
      data-testid="dice"
    >
      {renderDots(displayValue)}
    </motion.div>
  );
}
