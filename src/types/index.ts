export type StoryCategory = 'prophets' | 'caliphs' | 'general' | 'creator' | 'adventure' | 'my-library';

export interface Character {
  name: string;
  role: string;
}

export interface Chapter {
  number: number;
  title: string;
  content: string;
  quranVerse?: string;
  hadithRef?: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  consequenceHint?: string;
  nextSceneId?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Story {
  id: string;
  title: string;
  category: 'prophets' | 'caliphs' | 'general' | 'user_created';
  subCategory?: string; // e.g. "الخلفاء الراشدون", "العصر الأموي", "العصر العباسي", "الأندلس"
  summary: string;
  image?: string;
  readingTimeMinutes: number;
  periodOrEra?: string; // e.g. "الخلافة الراشدة", "العصر العباسي", "الأندلس"
  location?: string; // e.g. "المدينة المنورة", "دمشق", "بغداد", "قرطبة"
  characters: Character[];
  chapters: Chapter[];
  moralLessons: string[];
  quote?: string;
  choices?: ChoiceOption[];
  quiz?: QuizQuestion[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface InteractiveAdventureNode {
  id: string;
  title: string;
  sceneText: string;
  imageHint?: string;
  choices: {
    text: string;
    targetNodeId: string;
    moralTrait: string;
  }[];
  isEnding?: boolean;
  endingType?: 'triumph' | 'lesson' | 'mysterious';
  moralSummary?: string;
}

export interface AdventureStory {
  id: string;
  title: string;
  summary: string;
  theme: string;
  coverImage: string;
  startNodeId: string;
  nodes: Record<string, InteractiveAdventureNode>;
}

export type ReadingTheme = 'parchment' | 'light' | 'night';
