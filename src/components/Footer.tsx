import React from 'react';
import { Feather, Heart } from 'lucide-react';
import { StoryCategory } from '../types';

interface FooterProps {
  onSelectTab: (tab: StoryCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-[#E6DEC9] bg-[#F7F3EB] py-12 transition-colors dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-right">
          {/* Brand & Mission Statement */}
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#24211D] text-[#FAF7F2] dark:bg-[#E6DEC9] dark:text-stone-900">
              <Feather className="h-4 w-4" />
            </span>
            <div>
              <span className="font-amiri text-xl font-bold text-[#1F1C18] dark:text-white">
                منصة راوي
              </span>
              <p className="text-xs text-[#706859] dark:text-stone-400">
                قصص الأنبياء العطرة · روائع التراث العربي والحِكَم · صانع القصص التفاعلي
              </p>
            </div>
          </div>

          {/* Quiet Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#575147] dark:text-stone-300">
            <button
              onClick={() => onSelectTab('prophets')}
              className="hover:text-[#1F1C18] dark:hover:text-white"
            >
              قصص الأنبياء
            </button>
            <button
              onClick={() => onSelectTab('caliphs')}
              className="hover:text-[#1F1C18] dark:hover:text-white"
            >
              قصص الخلفاء
            </button>
            <button
              onClick={() => onSelectTab('general')}
              className="hover:text-[#1F1C18] dark:hover:text-white"
            >
              روائع القصص
            </button>
            <button
              onClick={() => onSelectTab('creator')}
              className="hover:text-[#1F1C18] dark:hover:text-white"
            >
              صانع القصص
            </button>
            <button
              onClick={() => onSelectTab('adventure')}
              className="hover:text-[#1F1C18] dark:hover:text-white"
            >
              مغامرة تفاعلية
            </button>
            <button
              onClick={() => onSelectTab('my-library')}
              className="hover:text-[#1F1C18] dark:hover:text-white"
            >
              مكتبتي
            </button>
          </nav>
        </div>

        {/* Hairline Divider & Copyright */}
        <div className="mt-8 border-t border-[#E6DEC9]/70 pt-6 text-center text-xs text-[#8F8778] dark:border-stone-800 dark:text-stone-500">
          <p>
            راوي © {new Date().getFullYear()} — منصة عربية مكرسة لبث روح الحكمة وتوثيق القصص الهادفة وإحياء فن السرد.
          </p>
        </div>
      </div>
    </footer>
  );
};
