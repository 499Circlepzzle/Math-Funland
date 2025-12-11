import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AvatarId = 'dino' | 'mimi' | 'hugo' | 'pip';

interface GameState {
  selectedAvatar: AvatarId;
  badges: string[];
  settings: {
    music: boolean;
    sfx: boolean;
    difficulty: 'easy' | 'hard'; // easy = 1 die, hard = 2 dice
  };
  setAvatar: (id: AvatarId) => void;
  addBadge: (badge: string) => void;
  toggleMusic: () => void;
  toggleSfx: () => void;
  setDifficulty: (level: 'easy' | 'hard') => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      selectedAvatar: 'dino',
      badges: [],
      settings: {
        music: true,
        sfx: true,
        difficulty: 'easy',
      },
      setAvatar: (id) => set({ selectedAvatar: id }),
      addBadge: (badge) => set((state) => {
        if (state.badges.includes(badge)) return state;
        return { badges: [...state.badges, badge] };
      }),
      toggleMusic: () => set((state) => ({ settings: { ...state.settings, music: !state.settings.music } })),
      toggleSfx: () => set((state) => ({ settings: { ...state.settings, sfx: !state.settings.sfx } })),
      setDifficulty: (level) => set((state) => ({ settings: { ...state.settings, difficulty: level } })),
    }),
    {
      name: 'funland-storage',
    }
  )
);
