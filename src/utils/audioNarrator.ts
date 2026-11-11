// Browser SpeechSynthesis utility for Arabic narration

export interface NarratorState {
  isPlaying: boolean;
  isPaused: boolean;
  rate: number;
  availableVoices: SpeechSynthesisVoice[];
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export const AudioNarrator = {
  getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const all = window.speechSynthesis.getVoices();
    // Prioritize Arabic voices
    const arVoices = all.filter((v) => v.lang.startsWith('ar'));
    return arVoices.length > 0 ? arVoices : all;
  },

  speak({
    text,
    rate = 0.95,
    onStart,
    onEnd,
    onError,
  }: {
    text: string;
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError('المتصفح لا يدعم القراءة الصوتية المباشرة');
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean markdown, brackets, Quran marks for smooth speech
      const cleanText = text
        .replace(/[«»﴿﴾]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/[*_#]/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;

      const voices = this.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arVoice) {
        utterance.voice = arVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        activeUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        activeUtterance = null;
        if (onError) onError(e);
      };

      activeUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      if (onError) onError(e);
    }
  },

  pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  },

  resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  },

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    }
  },

  isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  },
};
