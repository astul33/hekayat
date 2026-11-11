import React from 'react';
import { Search, Sparkles, BookOpen, Compass, ArrowLeft, Crown } from 'lucide-react';
import { StoryCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTab: (tab: StoryCategory) => void;
  onOpenCreator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTab,
  onOpenCreator,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-[#E6DEC9] bg-[#F7F3EB] py-12 lg:py-16 transition-colors dark:border-stone-800 dark:bg-stone-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          {/* Text Editorial Column (7 cols) */}
          <div className="flex flex-col justify-center lg:col-span-7 text-right">
            {/* Quiet Top Kicker (No pill box) */}
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
              <span>مخطوطات وبلاغة السرد العربي</span>
              <span aria-hidden="true">·</span>
              <span>قصص الأنبياء والخلفاء</span>
              <span aria-hidden="true">·</span>
              <span>صانع القصص التفاعلي</span>
            </div>

            {/* Display Headline with text-wrap: balance */}
            <h1 className="font-amiri text-4xl font-bold leading-tight tracking-tight text-[#1F1C18] sm:text-5xl lg:text-6xl dark:text-[#FAF7F2] [text-wrap:balance]">
              واحة الحكمة، سير الخلفاء، وسحر الحكايا
            </h1>

            {/* Deck / Subtitle */}
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#575147] sm:text-lg dark:text-stone-300">
              استكشف نفحات قصص الأنبياء العطرة، وسير ومواقف الخلفاء الراشدين وملوك العدل، وتأمل في روائع الحِكَم وتراث كليلة ودمنة، أو ألّف روايتك الخاصة في صانع القصص الذكي.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute right-4 h-5 w-5 text-[#8C6D46] dark:text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="ابحث عن نبي، خليفة، حكاية، أو خلق (مثل: عمر بن الخطاب، يوسف، الأمانة، كليلة ودمنة)..."
                  className="w-full rounded-xl border border-[#D9CDB8] bg-white pr-12 pl-4 py-3.5 text-sm text-[#1F1C18] placeholder-[#8F8778] shadow-sm transition-all focus:border-[#8C6D46] focus:outline-none focus:ring-1 focus:ring-[#8C6D46] dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:placeholder-stone-400"
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectTab('prophets')}
                className="flex items-center gap-2 rounded-lg bg-[#24211D] px-4 py-2.5 text-xs font-semibold text-[#FAF7F2] shadow-sm transition-all hover:bg-[#3D3730] active:scale-95 whitespace-nowrap shrink-0 dark:bg-[#E6DEC9] dark:text-stone-900 dark:hover:bg-white"
              >
                <BookOpen className="h-4 w-4" />
                <span>قصص الأنبياء</span>
              </button>

              <button
                onClick={() => onSelectTab('caliphs')}
                className="flex items-center gap-2 rounded-lg bg-[#8C6D46] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#735735] active:scale-95 whitespace-nowrap shrink-0"
              >
                <Crown className="h-4 w-4" />
                <span>ركن قصص الخلفاء</span>
              </button>

              <button
                onClick={onOpenCreator}
                className="flex items-center gap-2 rounded-lg border border-[#8C6D46] bg-transparent px-4 py-2.5 text-xs font-semibold text-[#8C6D46] transition-all hover:bg-[#8C6D46]/10 active:scale-95 whitespace-nowrap shrink-0 dark:border-[#D4A373] dark:text-[#D4A373] dark:hover:bg-[#D4A373]/10"
              >
                <Sparkles className="h-4 w-4" />
                <span>اصنع قصتك بالذكاء الاصطناعي</span>
              </button>

              <button
                onClick={() => onSelectTab('adventure')}
                className="flex items-center gap-1.5 text-xs font-medium text-[#575147] transition-colors hover:text-[#1F1C18] whitespace-nowrap shrink-0 dark:text-stone-300 dark:hover:text-white"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>مغامرة تفاعلية</span>
                <ArrowLeft className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Media Visual Column (5 cols) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="group relative w-full overflow-hidden rounded-2xl border border-[#E6DEC9] bg-[#EFE9DD] shadow-lg dark:border-stone-700 dark:bg-stone-800">
              <img
                src="/src/assets/images/story_hero_oasis_1794394053774.jpg"
                alt="واحة الحكمة والمخطوطات العتيقة في الصحراء"
                referrerPolicy="no-referrer"
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-80 lg:h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-6 text-right text-white">
                <span className="text-xs font-medium text-amber-200">
                  نفحة أدبية
                </span>
                <blockquote className="mt-1 font-amiri text-lg font-normal italic text-stone-100 sm:text-xl">
                  «نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ بِمَا أَوْحَيْنَا إِلَيْكَ هَٰذَا الْقُرْآنَ»
                </blockquote>
                <p className="mt-2 text-xs text-stone-300">
                  سورة يوسف · الآية ٣
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Adjacency Proof Strip (Clean, unboxed) */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[#E6DEC9]/80 pt-6 sm:grid-cols-4 dark:border-stone-800">
          <div>
            <div className="font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
              ٩ قصص نبوية
            </div>
            <div className="text-xs text-[#706859] dark:text-stone-400">
              موثقة بالآيات والعبر القرآنية
            </div>
          </div>
          <div>
            <div className="font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
              ١٠+ قصص للخلفاء
            </div>
            <div className="text-xs text-[#706859] dark:text-stone-400">
              مواقف العدل، الراشدون، والأندلس
            </div>
          </div>
          <div>
            <div className="font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
              صانع القصص
            </div>
            <div className="text-xs text-[#706859] dark:text-stone-400">
              توليد ذكي أو تدوين حر خطوة بخطوة
            </div>
          </div>
          <div>
            <div className="font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
              سرد صوتي
            </div>
            <div className="text-xs text-[#706859] dark:text-stone-400">
              قارئ صوتي عربي تفاعلي واختبارات فهم
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
