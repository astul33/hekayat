import React from 'react';
import { Feather, Bookmark, Moon, Sun, Sparkles } from 'lucide-react';
import { StoryCategory } from '../types';

interface HeaderProps {
  activeTab: StoryCategory;
  onSelectTab: (tab: StoryCategory) => void;
  onOpenCreator: () => void;
  savedCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreator,
  savedCount,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E6DEC9] bg-[#FAF7F2]/95 backdrop-blur-md transition-colors dark:border-stone-800 dark:bg-stone-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single Element) */}
        <button
          onClick={() => onSelectTab('prophets')}
          className="group flex items-center gap-2.5 text-right whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
          aria-label="الصفحة الرئيسية لمنصة راوي"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#24211D] text-[#FAF7F2] shadow-sm transition-transform group-hover:scale-105 dark:bg-[#E6DEC9] dark:text-stone-900">
            <Feather className="h-5 w-5" />
          </span>
          <span className="font-amiri text-2xl font-bold tracking-tight text-[#24211D] dark:text-[#FAF7F2]">
            راوي
          </span>
        </button>

        {/* Zone 2: Concise Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#575147] dark:text-stone-300">
          <button
            onClick={() => onSelectTab('prophets')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#1F1C18] dark:hover:text-white ${
              activeTab === 'prophets'
                ? 'font-bold text-[#1F1C18] border-b-2 border-[#8C6D46] dark:text-white dark:border-[#D4A373]'
                : ''
            }`}
          >
            قصص الأنبياء
          </button>

          <button
            onClick={() => onSelectTab('caliphs')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#1F1C18] dark:hover:text-white ${
              activeTab === 'caliphs'
                ? 'font-bold text-[#1F1C18] border-b-2 border-[#8C6D46] dark:text-white dark:border-[#D4A373]'
                : ''
            }`}
          >
            قصص الخلفاء
          </button>

          <button
            onClick={() => onSelectTab('general')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#1F1C18] dark:hover:text-white ${
              activeTab === 'general'
                ? 'font-bold text-[#1F1C18] border-b-2 border-[#8C6D46] dark:text-white dark:border-[#D4A373]'
                : ''
            }`}
          >
            روائع القصص
          </button>

          <button
            onClick={() => onSelectTab('creator')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#1F1C18] dark:hover:text-white ${
              activeTab === 'creator'
                ? 'font-bold text-[#1F1C18] border-b-2 border-[#8C6D46] dark:text-white dark:border-[#D4A373]'
                : ''
            }`}
          >
            اصنع قصتك
          </button>

          <button
            onClick={() => onSelectTab('adventure')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#1F1C18] dark:hover:text-white ${
              activeTab === 'adventure'
                ? 'font-bold text-[#1F1C18] border-b-2 border-[#8C6D46] dark:text-white dark:border-[#D4A373]'
                : ''
            }`}
          >
            مسارات المغامرة
          </button>

          <button
            onClick={() => onSelectTab('my-library')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#1F1C18] dark:hover:text-white ${
              activeTab === 'my-library'
                ? 'font-bold text-[#1F1C18] border-b-2 border-[#8C6D46] dark:text-white dark:border-[#D4A373]'
                : ''
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>مكتبتي</span>
            {savedCount > 0 && (
              <span className="text-xs font-mono text-[#8C6D46] dark:text-[#D4A373]">
                ({savedCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            aria-label="تبديل المظهر"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6DEC9] text-[#575147] transition-colors hover:bg-[#EFE8DA] hover:text-[#1F1C18] dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onOpenCreator}
            className="flex items-center gap-2 rounded-lg bg-[#24211D] px-4 py-2 text-xs font-semibold text-[#FAF7F2] shadow-sm transition-all hover:bg-[#3D3730] active:scale-95 whitespace-nowrap shrink-0 dark:bg-[#E6DEC9] dark:text-stone-900 dark:hover:bg-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>ألّف قصة جديدة</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Rail */}
      <div className="flex lg:hidden overflow-x-auto items-center justify-around border-t border-[#E6DEC9] px-2 py-2 text-xs text-[#575147] dark:border-stone-800 dark:text-stone-300 gap-1">
        <button
          onClick={() => onSelectTab('prophets')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'prophets' ? 'font-bold text-[#1F1C18] dark:text-white' : ''}`}
        >
          الأنبياء
        </button>
        <button
          onClick={() => onSelectTab('caliphs')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'caliphs' ? 'font-bold text-[#1F1C18] dark:text-white' : ''}`}
        >
          الخلفاء
        </button>
        <button
          onClick={() => onSelectTab('general')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'general' ? 'font-bold text-[#1F1C18] dark:text-white' : ''}`}
        >
          قصص عامة
        </button>
        <button
          onClick={() => onSelectTab('creator')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'creator' ? 'font-bold text-[#1F1C18] dark:text-white' : ''}`}
        >
          صانع القصص
        </button>
        <button
          onClick={() => onSelectTab('adventure')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'adventure' ? 'font-bold text-[#1F1C18] dark:text-white' : ''}`}
        >
          المغامرة
        </button>
        <button
          onClick={() => onSelectTab('my-library')}
          className={`whitespace-nowrap px-2 py-1 ${activeTab === 'my-library' ? 'font-bold text-[#1F1C18] dark:text-white' : ''}`}
        >
          مكتبتي
        </button>
      </div>
    </header>
  );
};
