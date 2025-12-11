import { GameLayout } from '@/components/layout/GameLayout';
import { CharacterAvatar } from '@/components/ui/character-avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useGameStore, AvatarId } from '@/lib/store';
import { AudioManager } from '@/lib/audio';
import { Play, Calculator, ArrowRight, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const { selectedAvatar, setAvatar } = useGameStore();

  const handleAvatarSelect = (id: AvatarId) => {
    setAvatar(id);
    AudioManager.playSfx('pop');
    AudioManager.speak(`Hi ${id}!`);
  };

  const menuItems = [
    { 
      title: 'Count', 
      icon: '🎲', 
      color: 'bg-blue-400 border-blue-600', 
      link: '/count',
      desc: 'Roll & Count'
    },
    { 
      title: 'Jump', 
      icon: '🐸', 
      color: 'bg-green-400 border-green-600', 
      link: '/jump',
      desc: 'Number Line'
    },
    { 
      title: 'Feed', 
      icon: '🍎', 
      color: 'bg-orange-400 border-orange-600', 
      link: '/feed',
      desc: 'Subtraction'
    },
  ];

  return (
    <GameLayout showBack={false} className="justify-center">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
        
        {/* Title Logo Area */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-2"
        >
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-sm font-[Fredoka]">
            Funland
          </h1>
          <p className="text-xl text-slate-600 font-bold">Math Adventures</p>
        </motion.div>

        {/* Character Selection */}
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border-4 border-white shadow-xl w-full">
          <h2 className="text-center text-xl font-bold text-slate-500 mb-4 uppercase tracking-wider">Choose your friend</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {(['dino', 'mimi', 'hugo', 'pip'] as AvatarId[]).map((id) => (
              <div key={id} className="relative group cursor-pointer" onClick={() => handleAvatarSelect(id)}>
                <CharacterAvatar 
                  id={id} 
                  size="lg" 
                  animate 
                  className={cn(
                    "transition-all duration-300", 
                    selectedAvatar === id ? "scale-110 ring-4 ring-offset-4 ring-yellow-400 z-10" : "opacity-70 hover:opacity-100 hover:scale-105"
                  )} 
                />
                {selectedAvatar === id && (
                  <motion.div 
                    layoutId="check"
                    className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md"
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Game Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {menuItems.map((item, idx) => (
            <Link key={idx} href={item.link} onClick={() => AudioManager.playSfx('pop')}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "h-48 rounded-3xl p-6 flex flex-col items-center justify-between text-white shadow-button cursor-pointer border-b-8 border-r-4 relative overflow-hidden group",
                  item.color
                )}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-6xl drop-shadow-md">{item.icon}</span>
                <div className="text-center">
                  <h3 className="text-2xl font-black uppercase tracking-wide">{item.title}</h3>
                  <p className="font-bold opacity-90 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </GameLayout>
  );
}
