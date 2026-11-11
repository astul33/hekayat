import React, { useState } from 'react';
import { Bookmark, Sparkles, BookOpen, Trash2, Download, ArrowLeft, Plus } from 'lucide-react';
import { Story } from '../types';

interface MyStoriesSectionProps {
  userStories: Story[];
  bookmarkedStories: Story[];
  onSelectStory: (story: Story) => void;
  onDeleteUserStory: (storyId: string) => void;
  onToggleBookmark: (storyId: string) => void;
  onOpenCreator: () => void;
}

export const MyStoriesSection: React.FC<MyStoriesSectionProps> = ({
  userStories,
  bookmarkedStories,
  onSelectStory,
  onDeleteUserStory,
  onToggleBookmark,
  onOpenCreator,
}) => {
  const [subTab, setSubTab] = useState<'created' | 'bookmarks'>('created');

  const handleExportStory = (story: Story) => {
    const textContent = `${story.title}\n` +
      `التصنيف: ${story.subCategory || 'تأليف خاص'}\n` +
      `الملخص: ${story.summary}\n\n` +
      story.chapters.map((c) => `=== ${c.title} ===\n${c.content}\n\n`).join('') +
      `العبر المستفادة:\n` +
      story.moralLessons.map((m) => `- ${m}`).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${story.title.replace(/[^\w\u0621-\u064A]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const storiesToShow = subTab === 'created' ? userStories : bookmarkedStories;

  return (
    <div className="py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#E6DEC9] pb-6 dark:border-stone-800">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
              خزانتك الخاصة
            </div>
            <h2 className="mt-1 font-amiri text-3xl font-bold tracking-tight text-[#1F1C18] sm:text-4xl dark:text-[#FAF7F2]">
              مكتبتي المحفوظة والقصص المؤلفة
            </h2>
            <p className="mt-2 text-sm text-[#575147] dark:text-stone-300">
              جميع القصص التي ألفتها بيدك أو استلهمتها بالذكاء الاصطناعي، إلى جانب روائعك المفضلة المحفوظة للمطالعة لاحقاً.
            </p>
          </div>

          {/* Sub-tab pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EFE9DD] rounded-xl dark:bg-stone-800">
            <button
              onClick={() => setSubTab('created')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                subTab === 'created'
                  ? 'bg-white text-[#1F1C18] shadow-sm font-bold dark:bg-stone-700 dark:text-white'
                  : 'text-[#6B6355] hover:text-[#1F1C18] dark:text-stone-300 dark:hover:text-white'
              }`}
            >
              القصص المؤلفة ({userStories.length})
            </button>

            <button
              onClick={() => setSubTab('bookmarks')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                subTab === 'bookmarks'
                  ? 'bg-white text-[#1F1C18] shadow-sm font-bold dark:bg-stone-700 dark:text-white'
                  : 'text-[#6B6355] hover:text-[#1F1C18] dark:text-stone-300 dark:hover:text-white'
              }`}
            >
              المحفوظات للمطالعة ({bookmarkedStories.length})
            </button>
          </div>
        </div>

        {/* Stories Listing */}
        {storiesToShow.length === 0 ? (
          <div className="my-16 rounded-2xl border border-dashed border-[#D9CDB8] bg-white/50 p-12 text-center dark:border-stone-800 dark:bg-stone-900/30">
            {subTab === 'created' ? (
              <>
                <Sparkles className="mx-auto h-10 w-10 text-[#8C6D46] dark:text-[#D4A373]" />
                <h3 className="mt-4 font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
                  لم تقم بتأليف قصة بعد
                </h3>
                <p className="mt-2 text-xs text-[#706859] dark:text-stone-400 max-w-md mx-auto">
                  ادخل إلى صانع القصص لتولد حكايات ملحمية بعناصرك الخاصة، أو دون فصولك يدويًا لتظهر هنا.
                </p>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={onOpenCreator}
                    className="flex items-center gap-2 rounded-lg bg-[#24211D] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#3D3730] dark:bg-[#E6DEC9] dark:text-stone-900"
                  >
                    <Plus className="h-4 w-4" />
                    <span>ابدأ بصنع قصة جديدة</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Bookmark className="mx-auto h-10 w-10 text-stone-400" />
                <h3 className="mt-4 font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
                  لا توجد قصص محفوظة في المفضلة
                </h3>
                <p className="mt-2 text-xs text-[#706859] dark:text-stone-400">
                  انقر على أيقونة الإشارة المرجعية بجانب أي قصة من قصص الأنبياء أو الحكايات لحفظها هنا.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {storiesToShow.map((story) => (
              <article
                key={story.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E6DEC9] bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
              >
                <div>
                  {/* Metadata Header */}
                  <div className="flex items-center justify-between text-xs text-[#706859] dark:text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <span>{story.location || 'تأليف خاص'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{story.readingTimeMinutes} دقيقة</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {subTab === 'created' && (
                        <>
                          <button
                            onClick={() => handleExportStory(story)}
                            title="تصدير كملف نصي"
                            className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-white"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteUserStory(story.id)}
                            title="حذف القصة"
                            className="p-1 text-stone-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {subTab === 'bookmarks' && (
                        <button
                          onClick={() => onToggleBookmark(story.id)}
                          className="p-1 text-amber-600 hover:text-stone-400"
                        >
                          <Bookmark className="h-4 w-4 fill-current" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 font-amiri text-xl font-bold text-[#1F1C18] dark:text-[#FAF7F2]">
                    {story.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-2 text-sm leading-relaxed text-[#575147] line-clamp-3 dark:text-stone-300">
                    {story.summary}
                  </p>

                  {story.createdAt && (
                    <div className="mt-3 text-[11px] text-[#8F8778] dark:text-stone-400">
                      تاريخ الإنشاء: {story.createdAt}
                    </div>
                  )}
                </div>

                {/* Bottom Trigger */}
                <div className="mt-6 flex items-center justify-between border-t border-[#EFE9DD] pt-4 dark:border-stone-800">
                  <span className="text-xs text-[#8F8778] dark:text-stone-400">
                    {story.chapters.length} فصول
                  </span>

                  <button
                    onClick={() => onSelectStory(story)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1C18] transition-all hover:text-[#8C6D46] group-hover:translate-x-[-2px] dark:text-white dark:hover:text-[#D4A373]"
                  >
                    <span>فتح القصة</span>
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
