import { useState, useEffect, useRef } from 'react';
import { GameLayout } from '@/components/layout/GameLayout';
import { Dice } from '@/components/ui/dice';
import { Button } from '@/components/ui/button';
import { CharacterAvatar } from '@/components/ui/character-avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioManager } from '@/lib/audio';
import { useGameStore } from '@/lib/store';
import ReactConfetti from 'react-confetti';
import { cn } from '@/lib/utils';

export default function JumpPathGame() {
  const { selectedAvatar } = useGameStore();
  const [position, setPosition] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [target, setTarget] = useState(12);

  const rollDice = () => {
    if (isRolling || isJumping || position >= target) {
      if (position >= target) resetGame();
      return;
    }
    
    setIsRolling(true);
    AudioManager.playSfx('dice');

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 3) + 1; // 1-3 for easier jumping
      setDiceValue(roll);
      setIsRolling(false);
      AudioManager.speak(`Jump ${roll} times!`);
      startJumping(roll);
    }, 1000);
  };

  const startJumping = async (steps: number) => {
    setIsJumping(true);
    let currentPos = position;
    
    for (let i = 0; i < steps; i++) {
      if (currentPos >= target) break;
      
      await new Promise(r => setTimeout(r, 600));
      currentPos++;
      setPosition(currentPos);
      AudioManager.playSfx('pop');
    }

    setIsJumping(false);
    
    if (currentPos >= target) {
      AudioManager.playSfx('correct');
      AudioManager.speak("You made it!");
    }
  };

  const resetGame = () => {
    setPosition(0);
    AudioManager.playSfx('pop');
  };

  return (
    <GameLayout title="Jump Path" className="justify-center">
      {position >= target && <ReactConfetti recycle={false} numberOfPieces={200} />}
      
      <div className="flex flex-col items-center w-full gap-8">
        
        {/* Game Board / Number Line */}
        <div className="w-full bg-white/50 backdrop-blur-md rounded-3xl p-4 md:p-8 border-4 border-white shadow-xl overflow-x-auto">
          <div className="flex items-center gap-2 min-w-[800px] h-40 relative px-10">
            {/* The Line */}
            <div className="absolute top-1/2 left-0 w-full h-4 bg-slate-200 rounded-full -z-10" />
            
            {/* Steps */}
            {Array.from({ length: target + 1 }).map((_, i) => (
              <div key={i} className="relative flex-1 flex flex-col items-center justify-center h-full">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 z-0 transition-colors",
                  i <= position ? "bg-green-400 border-green-500 text-white" : "bg-white border-slate-300 text-slate-400"
                )}>
                  {i}
                </div>
                
                {/* Render Avatar if at position */}
                <AnimatePresence>
                  {i === position && (
                    <motion.div
                      layoutId="avatar"
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="absolute -top-4 z-10"
                    >
                      <CharacterAvatar id={selectedAvatar} size="md" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-slate-100 flex items-center gap-8">
            <Dice 
              value={diceValue} 
              rolling={isRolling} 
              size="md" 
              onClick={rollDice}
            />
            <div className="flex flex-col gap-2">
              <Button 
                onClick={position >= target ? resetGame : rollDice} 
                disabled={isRolling || isJumping}
                size="lg"
                className={cn(
                  "rounded-2xl text-xl h-16 px-8 shadow-button active:translate-y-1 active:shadow-none transition-all",
                  position >= target ? "bg-green-500 hover:bg-green-600" : "bg-purple-500 hover:bg-purple-600"
                )}
              >
                {position >= target ? 'Play Again' : isRolling ? 'Rolling...' : isJumping ? 'Jumping...' : 'Jump!'}
              </Button>
            </div>
          </div>
          <p className="text-slate-500 font-bold">
            {position >= target ? "Yay! You reached the end!" : "Roll the dice to move forward!"}
          </p>
        </div>

      </div>
    </GameLayout>
  );
}
