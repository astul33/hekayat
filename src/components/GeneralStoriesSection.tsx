import React, { useState } from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { Story } from '../types';

interface GeneralStoriesSectionProps {
  stories: Story[];
  searchQuery: string;
  onSelectStory: (story: Story) => void;
  onToggleBookmark: (storyId: string) => void;
  isBookmarked: (storyId: string) => boolean;
}

export const GeneralStoriesSection: React.FC<GeneralStoriesSectionProps> = ({
  stories,
  searchQuery,
  onSelectStory,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('الكل');

  const categories = ['الكل', 'كليلة ودمنة', 'كرم ومروءة', 'نوادر وذكاء', 'حكم وأمثال'];

  const filteredStories = stories.filter((story) => {
    const matchesTag = selectedTag === 'الكل' || story.subCategory === selectedTag;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      story.title.toLowerCase().includes(q) ||
      story.summary.toLowerCase().includes(q) ||
      story.location?.toLowerCase().includes(q) ||
      story.characters.some((c) => c.name.toLowerCase().includes(q));
    return matchesTag && matchesSearch;
  });

  return (
    <section className="py-12 bg-[#F6F2EA]/60 transition-colors dark:bg-stone-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#E6DEC9] pb-6 dark:border-stone-800">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
              كنوز التراث العربي
            </div>
            <h2 className="mt-1 font-amiri text-3xl font-bold tracking-tight text-[#1F1C18] sm:text-4xl dark:text-[#FAF7F2]">
              روائع القصص العامة والعِبر
            </h2>
            <p className="mt-2 text-sm text-[#575147] dark:text-stone-300">
              حكايات حكيمة من كليلة ودمنة، ومواقف الفطنة والذكاء، وروائع الكرم والوفاء التي تجسد أصالة الفضائل.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFE9DD] rounded-xl dark:bg-stone-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedTag === cat
                    ? 'bg-white text-[#1F1C18] shadow-sm font-bold dark:bg-stone-700 dark:text-white'
                    : 'text-[#6B6355] hover:text-[#1F1C18] dark:text-stone-300 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="my-16 text-center">
            <p className="text-sm text-[#706859] dark:text-stone-400">
              لا توجد قصص مطابقة لكلمة البحث الحالية.
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
                    {/* Unboxed Metadata (Zero-Pill Discipline) */}
                    <div className="flex items-center justify-between text-xs text-[#706859] dark:text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <span>{story.location || 'التراث العربي'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{story.readingTimeMinutes} دقيقة</span>
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

                    {/* Summary Deck */}
                    <p className="mt-2 text-sm leading-relaxed text-[#575147] line-clamp-3 dark:text-stone-300">
                      {story.summary}
                    </p>

                    {/* Characters List preview */}
                    {story.characters && story.characters.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#706859] dark:text-stone-400">
                        <span className="font-semibold text-[#1F1C18] dark:text-stone-200">الشخصيات:</span>
                        <span>{story.characters.map((c) => c.name).join(' · ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#EFE9DD] pt-4 dark:border-stone-800">
                    <span className="text-xs text-[#8F8778] dark:text-stone-400">
                      {story.chapters.length} فصول
                    </span>

                    <button
                      onClick={() => onSelectStory(story)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1C18] transition-all hover:text-[#8C6D46] group-hover:translate-x-[-2px] dark:text-white dark:hover:text-[#D4A373]"
                    >
                      <span>مطالعة الحكاية</span>
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
