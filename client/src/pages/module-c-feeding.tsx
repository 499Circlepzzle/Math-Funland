import { useState, useEffect } from 'react';
import { GameLayout } from '@/components/layout/GameLayout';
import { Dice } from '@/components/ui/dice';
import { Button } from '@/components/ui/button';
import { CharacterAvatar } from '@/components/ui/character-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioManager } from '@/lib/audio';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function FeedingGame() {
  const { selectedAvatar } = useGameStore();
  const [initialCount, setInitialCount] = useState(6);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [phase, setPhase] = useState<'start' | 'roll' | 'eat' | 'end'>('start');
  const [eatenCount, setEatenCount] = useState(0);

  const startRound = () => {
    const start = Math.floor(Math.random() * 5) + 5; // 5-10 items
    setInitialCount(start);
    setEatenCount(0);
    setPhase('roll');
    AudioManager.speak(`Here are ${start} apples! Roll to see how many to eat.`);
  };

  useEffect(() => {
    startRound();
  }, []);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    AudioManager.playSfx('dice');

    setTimeout(() => {
      // Ensure we don't roll more than available
      let roll = Math.floor(Math.random() * 4) + 1;
      if (roll > initialCount) roll = initialCount - 1; // Leave at least 1
      
      setDiceValue(roll);
      setIsRolling(false);
      setPhase('eat');
      AudioManager.speak(`Feed ${roll} apples to ${selectedAvatar}! Tap them.`);
    }, 1000);
  };

  const handleAppleClick = (index: number) => {
    if (phase !== 'eat') return;
    // We don't track specific indices, just count. 
    // Actually, let's just use a simple counter for simplicity in MVP
    if (eatenCount < diceValue) {
      setEatenCount(prev => prev + 1);
      AudioManager.playSfx('pop'); // Crunch sound ideally
      
      if (eatenCount + 1 >= diceValue) {
        setTimeout(() => {
            setPhase('end');
            AudioManager.playSfx('correct');
            AudioManager.speak(`Yum! ${initialCount - diceValue} apples left.`);
        }, 500);
      }
    }
  };

  return (
    <GameLayout title="Feeding Time" className="justify-center">
      <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
        
        {/* Story Text */}
        <div className="bg-white/80 p-4 rounded-2xl shadow-sm text-center">
             <h2 className="text-2xl font-bold text-slate-700">
                {phase === 'roll' && `How many will ${selectedAvatar} eat?`}
                {phase === 'eat' && `Tap ${diceValue - eatenCount} more apples!`}
                {phase === 'end' && `${initialCount} - ${diceValue} = ${initialCount - diceValue} left!`}
             </h2>
        </div>

        {/* Scene */}
        <div className="relative w-full h-[400px] bg-sky-100 rounded-[3rem] border-8 border-white shadow-xl overflow-hidden flex items-center justify-center">
          {/* Background Elements */}
          <div className="absolute bottom-0 w-full h-1/3 bg-green-200 rounded-b-[2.5rem]" />
          
          {/* Avatar */}
          <div className="absolute bottom-10 left-10 z-10">
             <CharacterAvatar id={selectedAvatar} size="xl" className={phase === 'eat' ? "animate-bounce" : ""} />
          </div>

          {/* Apples Grid */}
          <div className="absolute top-10 right-10 w-2/3 h-full p-8 flex flex-wrap content-start gap-4">
            {Array.from({ length: initialCount }).map((_, i) => {
                // Determine if this specific apple is eaten. 
                // Simple logic: first N apples are eaten for visual simplicity? 
                // Or just remove them as clicked?
                // Let's make them disappear when clicked.
                // We need to track WHICH ones are eaten for the specific click.
                // For MVP, just track count. We'll hide the last N clicked? 
                // Better: Track an array of eaten indices.
                return (
                    <Apple 
                        key={i} 
                        index={i} 
                        isEaten={i < eatenCount && phase !== 'start'} // Simple sequential eating for MVP logic simplicity
                        onClick={() => handleAppleClick(i)}
                        clickable={phase === 'eat' && i >= eatenCount}
                    />
                )
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
            {phase === 'roll' && (
                <div className="flex flex-col items-center gap-2">
                     <Dice value={diceValue} rolling={isRolling} onClick={rollDice} />
                     <Button onClick={rollDice} disabled={isRolling} className="mt-4 text-xl py-6 px-8 rounded-xl bg-orange-500 hover:bg-orange-600">Roll Dice</Button>
                </div>
            )}
             {phase === 'end' && (
                 <Button onClick={startRound} size="lg" className="text-xl py-6 px-10 rounded-2xl bg-green-500 hover:bg-green-600 shadow-button active:translate-y-1">
                    Next Round
                 </Button>
            )}
        </div>

      </div>
    </GameLayout>
  );
}

function Apple({ index, isEaten, onClick, clickable }: { index: number, isEaten: boolean, onClick: () => void, clickable: boolean }) {
    return (
        <AnimatePresence>
            {!isEaten && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, opacity: 0, y: 50 }}
                    whileHover={clickable ? { scale: 1.1 } : {}}
                    onClick={clickable ? onClick : undefined}
                    className={cn(
                        "w-16 h-16 text-5xl flex items-center justify-center filter drop-shadow-md transition-all",
                        clickable ? "cursor-pointer" : "cursor-default"
                    )}
                >
                    🍎
                </motion.button>
            )}
        </AnimatePresence>
    )
}
