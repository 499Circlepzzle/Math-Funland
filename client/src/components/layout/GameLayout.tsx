import { Link, useLocation } from 'wouter';
import { Home, Music, Volume2, ArrowLeft, VolumeX, Music4, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AudioManager } from '@/lib/audio';

interface GameLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  className?: string;
}

export function GameLayout({ children, title, showBack = true, className }: GameLayoutProps) {
  const [location] = useLocation();
  const { settings, toggleMusic, toggleSfx } = useGameStore();

  const handleBack = () => {
    AudioManager.playSfx('pop');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="p-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          {showBack && (
            <Link href="/" onClick={handleBack}>
               <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-12 h-12 border-4 border-white bg-orange-400 hover:bg-orange-500 text-white shadow-button active:translate-y-1 active:shadow-none"
              >
                <ArrowLeft className="w-8 h-8 font-bold" strokeWidth={3} />
              </Button>
            </Link>
          )}
          {title && (
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-4xl font-black text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.2)] tracking-wide uppercase"
              style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}
            >
              {title}
            </motion.h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMusic}
            className="rounded-full hover:bg-white/20 text-slate-700"
          >
            {settings.music ? <Music className="w-6 h-6" /> : <Music4 className="w-6 h-6 opacity-50" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSfx}
            className="rounded-full hover:bg-white/20 text-slate-700"
          >
            {settings.sfx ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6 opacity-50" />}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={cn("flex-1 p-4 md:p-6 flex flex-col max-w-5xl mx-auto w-full", className)}>
        {children}
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.4)_100%)]" />
      </div>
    </div>
  );
}
