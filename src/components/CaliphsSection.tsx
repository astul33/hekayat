import React, { useState } from 'react';
import { Bookmark, ArrowLeft, Crown } from 'lucide-react';
import { Story } from '../types';

interface CaliphsSectionProps {
  stories: Story[];
  searchQuery: string;
  onSelectStory: (story: Story) => void;
  onToggleBookmark: (storyId: string) => void;
  isBookmarked: (storyId: string) => boolean;
}

export const CaliphsSection: React.FC<CaliphsSectionProps> = ({
  stories,
  searchQuery,
  onSelectStory,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [selectedEra, setSelectedEra] = useState<string>('الكل');

  const eras = ['الكل', 'الخلفاء الراشدون', 'العصر الأموي', 'العصر العباسي', 'الأندلس'];

  const filteredStories = stories.filter((story) => {
    const matchesEra = selectedEra === 'الكل' || story.subCategory === selectedEra;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      story.title.toLowerCase().includes(q) ||
      story.summary.toLowerCase().includes(q) ||
      story.location?.toLowerCase().includes(q) ||
      story.periodOrEra?.toLowerCase().includes(q) ||
      story.characters.some((c) => c.name.toLowerCase().includes(q));
    return matchesEra && matchesSearch;
  });

  return (
    <section className="py-12 bg-[#FAF7F2] transition-colors dark:bg-[#121214]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Caliphs Feature Showcase Banner */}
        <div className="relative mb-12 overflow-hidden rounded-2xl border border-[#E6DEC9] bg-[#F4EFE6] shadow-sm dark:border-stone-800 dark:bg-stone-900">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="p-6 sm:p-10 lg:col-span-7 text-right">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
                <Crown className="h-4 w-4" />
                <span>ركن أئمة العدل وحضارة الإسلام</span>
                <span aria-hidden="true">·</span>
                <span>سير وقضاء ومواقف خالدة</span>
              </div>
              <h2 className="mt-2 font-amiri text-3xl font-bold tracking-tight text-[#1F1C18] sm:text-4xl lg:text-5xl dark:text-[#FAF7F2] [text-wrap:balance]">
                قصص وسير الخلفاء العظماء
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#575147] sm:text-base dark:text-stone-300">
                من تواضع أبي بكر وعدل الفاروق عمر، إلى حياء عثمان وعلم علي، وزهد عمر بن عبد العزيز، ونهضة الرشيد ونخوة المعتصم، ومجد صقر قريش في الأندلس. مواقف سطرها التاريخ بميزان القسط والكرامة.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#706859] dark:text-stone-400">
                <span>{stories.length} قصص ومواقف تاريخية موثقة</span>
                <span aria-hidden="true">·</span>
                <span>٤ عصور تاريخية عريقة</span>
                <span aria-hidden="true">·</span>
                <span>سرد صوتي كامل</span>
              </div>
            </div>

            <div className="relative h-64 w-full overflow-hidden lg:col-span-5 lg:h-80">
              <img
                src="/src/assets/images/caliphs_historic_court_1794395329911.jpg"
                alt="مجلس القضاء والشورى في عصر الخلفاء"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#F4EFE6] lg:via-transparent lg:to-transparent dark:lg:from-stone-900" />
            </div>
          </div>
        </div>

        {/* Section Filters Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#E6DEC9] pb-6 dark:border-stone-800">
          <div className="text-right">
            <h3 className="font-amiri text-2xl font-bold text-[#1F1C18] dark:text-[#FAF7F2]">
              تصفح القصص حسب العصر والدولة
            </h3>
            <p className="mt-1 text-xs text-[#706859] dark:text-stone-400">
              اختر الحقبة التاريخية لاستعراض مآثر الخلفاء وأحكامهم
            </p>
          </div>

          {/* Era Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFE9DD] rounded-xl dark:bg-stone-800">
            {eras.map((era) => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedEra === era
                    ? 'bg-white text-[#1F1C18] shadow-sm font-bold dark:bg-stone-700 dark:text-white'
                    : 'text-[#6B6355] hover:text-[#1F1C18] dark:text-stone-300 dark:hover:text-white'
                }`}
              >
                {era}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Cards Grid */}
        {filteredStories.length === 0 ? (
          <div className="my-16 text-center">
            <p className="text-sm text-[#706859] dark:text-stone-400">
              لم نعثر على قصص تطابق بحثك في هذا القسم. جرب اسماً آخر كالراشدين، عمر، أو قرطبة.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => {
              const bookmarked = isBookmarked(story.id);

              return (
                <article
                  key={story.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E6DEC9] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
                >
                  <div>
                    {/* Unboxed Metadata (Zero-Pill) */}
                    <div className="flex items-center justify-between text-xs text-[#706859] dark:text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <span>{story.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{story.readingTimeMinutes} دقائق قراءة</span>
                        {story.subCategory && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-[#8C6D46] dark:text-[#D4A373]">
                              {story.subCategory}
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(story.id);
                        }}
                        aria-label={bookmarked ? 'إزالة من المحفوظات' : 'حفظ القصة'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          bookmarked
                            ? 'text-amber-600 bg-amber-50 dark:bg-stone-800 dark:text-amber-400'
                            : 'text-[#8F8778] hover:text-[#1F1C18] dark:text-stone-400 dark:hover:text-white'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Story Title */}
                    <h3 className="mt-3 font-amiri text-xl font-bold text-[#1F1C18] transition-colors group-hover:text-[#8C6D46] dark:text-[#FAF7F2] dark:group-hover:text-[#D4A373]">
                      {story.title}
                    </h3>

                    {/* Era Tag Subtitle */}
                    {story.periodOrEra && (
                      <div className="mt-1 text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
                        {story.periodOrEra}
                      </div>
                    )}

                    {/* Summary Deck */}
                    <p className="mt-2 text-sm leading-relaxed text-[#575147] line-clamp-3 dark:text-stone-300">
                      {story.summary}
                    </p>

                    {/* Historical Quote Callout */}
                    {story.quote && (
                      <div className="mt-4 border-r-2 border-[#8C6D46] pr-3 text-xs italic text-[#706859] dark:border-[#D4A373] dark:text-stone-300 font-amiri leading-relaxed">
                        {story.quote}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#EFE9DD] pt-4 dark:border-stone-800">
                    <span className="text-xs text-[#8F8778] dark:text-stone-400">
                      {story.chapters.length} فصول كاملة
                    </span>

                    <button
                      onClick={() => onSelectStory(story)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1C18] transition-all hover:text-[#8C6D46] group-hover:translate-x-[-2px] dark:text-white dark:hover:text-[#D4A373]"
                    >
                      <span>اقرأ القصة كاملة</span>
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
