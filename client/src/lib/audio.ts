import { useGameStore } from './store';

// Simple audio manager wrapper
export const AudioManager = {
  playSfx: (type: 'pop' | 'cheer' | 'correct' | 'wrong' | 'dice') => {
    const { sfx } = useGameStore.getState().settings;
    if (!sfx) return;

    // In a real app, these would be real audio files. 
    // For this prototype, we'll use simple synthesized sounds or just log
    // Adding real Audio objects here would be the next step
    
    // Quick and dirty synth for feedback
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'correct') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'wrong') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'pop') {
           osc.type = 'triangle';
           osc.frequency.setValueAtTime(600, ctx.currentTime);
           gain.gain.setValueAtTime(0.05, ctx.currentTime);
           gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
           osc.start();
           osc.stop(ctx.currentTime + 0.1);
        }
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  },

  speak: (text: string) => {
    // const { sfx } = useGameStore.getState().settings; // Using SFX setting for voice too for now
    // if (!sfx) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for kids
      utterance.pitch = 1.1; // Slightly higher/friendly
      window.speechSynthesis.speak(utterance);
    }
  }
};
