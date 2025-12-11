import { useState, useEffect } from 'react';
import { GameLayout } from '@/components/layout/GameLayout';
import { Dice } from '@/components/ui/dice';
import { Button } from '@/components/ui/button';
import { CharacterAvatar } from '@/components/ui/character-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioManager } from '@/lib/audio';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { cn } from '@/lib/utils';

export default function DiceCountGame() {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [counted, setCounted] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const { width, height } = useWindowSize();

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    AudioManager.playSfx('dice');
    setCounted(0);
    setShowCelebration(false);

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      setIsRolling(false);
      AudioManager.speak(`You rolled a ${newValue}! Let's count.`);
    }, 1000);
  };

  const handleItemClick = (index: number) => {
    if (index === counted) {
      const newCount = counted + 1;
      setCounted(newCount);
      AudioManager.playSfx('pop');
      AudioManager.speak(`${newCount}`);
      
      if (newCount === diceValue) {
        setTimeout(() => {
          AudioManager.playSfx('correct');
          AudioManager.speak("Great job!");
          setShowCelebration(true);
        }, 500);
      }
    }
  };

  return (
    <GameLayout title="Roll & Count" className="items-center">
      {showCelebration && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      
      <div className="flex flex-col items-center gap-10 w-full max-w-4xl flex-1 justify-center">
        
        {/* Dice Section */}
        <div className="relative">
          <Dice 
            value={diceValue} 
            rolling={isRolling} 
            size="lg" 
            onClick={rollDice} 
            className="shadow-xl"
          />
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
             <Button 
              onClick={rollDice} 
              disabled={isRolling}
              className="rounded-full px-8 py-6 text-xl font-bold bg-blue-500 hover:bg-blue-600 shadow-button active:translate-y-1 active:shadow-none text-white border-b-4 border-blue-700"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice!'}
            </Button>
          </div>
        </div>

        {/* Counting Area */}
        <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-8 w-full min-h-[300px] border-4 border-white shadow-inner flex flex-col items-center justify-center mt-8">
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: diceValue }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleItemClick(i)}
                className="cursor-pointer relative"
              >
                <motion.div
                  animate={i < counted ? { scale: [1, 1.2, 1], filter: "brightness(1.2)" } : {}}
                  className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md border-4 transition-all",
                    i < counted 
                      ? "bg-green-400 border-green-500 text-white" 
                      : "bg-white border-slate-200 text-slate-300 hover:border-blue-300"
                  )}
                >
                   {i < counted ? (i + 1) : '🍎'}
                </motion.div>
                {i === counted && !showCelebration && (
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-blue-500"
                  >
                    👇
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-4xl font-black text-slate-700 h-12">
            {counted > 0 ? `${counted}` : "Tap to count!"}
          </div>
        </div>

      </div>
    </GameLayout>
  );
}
