import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useGameStore, AvatarId } from '@/lib/store';

interface AvatarProps {
  id?: AvatarId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const avatars = {
  dino: { emoji: '🦖', color: 'bg-green-100 border-green-400', name: 'Dino' },
  mimi: { emoji: '🐰', color: 'bg-pink-100 border-pink-400', name: 'Mimi' },
  hugo: { emoji: '🐻', color: 'bg-blue-100 border-blue-400', name: 'Hugo' },
  pip: { emoji: '🐦', color: 'bg-yellow-100 border-yellow-400', name: 'Pip' },
};

export function CharacterAvatar({ id, size = 'md', className, animate = false }: AvatarProps) {
  const currentId = id || useGameStore((state) => state.selectedAvatar);
  const avatar = avatars[currentId];

  const sizes = {
    sm: 'w-10 h-10 text-2xl border-2',
    md: 'w-16 h-16 text-4xl border-4',
    lg: 'w-24 h-24 text-6xl border-4',
    xl: 'w-32 h-32 text-7xl border-8',
  };

  return (
    <motion.div
      whileHover={animate ? { scale: 1.1, rotate: 5 } : {}}
      whileTap={animate ? { scale: 0.9 } : {}}
      className={cn(
        'rounded-full flex items-center justify-center shadow-sm select-none bg-white',
        avatar.color,
        sizes[size],
        className
      )}
      data-testid={`avatar-${currentId}`}
    >
      <span role="img" aria-label={avatar.name}>{avatar.emoji}</span>
    </motion.div>
  );
}
