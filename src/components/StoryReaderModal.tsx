import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bookmark,
  Share2,
  Printer,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Story, ReadingTheme, QuizQuestion } from '../types';
import { AudioNarrator } from '../utils/audioNarrator';

interface StoryReaderModalProps {
  story: Story | null;
  onClose: () => void;
  onToggleBookmark: (storyId: string) => void;
  isBookmarked: boolean;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({
  story,
  onClose,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('parchment');
  const [fontSize, setFontSize] = useState<number>(20); // in px
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioRate, setAudioRate] = useState<number>(0.95);
  const [copied, setCopied] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    // Reset chapter when a new story opens
    setActiveChapterIndex(0);
    setShowQuiz(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    AudioNarrator.stop();
    setIsAudioPlaying(false);

    // Escape key closes modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        AudioNarrator.stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      AudioNarrator.stop();
    };
  }, [story, onClose]);

  if (!story) return null;

  const currentChapter = story.chapters[activeChapterIndex] || story.chapters[0];

  // Audio Playback Handler
  const toggleAudio = () => {
    if (isAudioPlaying) {
      AudioNarrator.stop();
      setIsAudioPlaying(false);
    } else {
      const textToRead = `${currentChapter.title}. ${currentChapter.content}`;
      setIsAudioPlaying(true);
      AudioNarrator.speak({
        text: textToRead,
        rate: audioRate,
        onStart: () => setIsAudioPlaying(true),
        onEnd: () => setIsAudioPlaying(false),
        onError: () => setIsAudioPlaying(false),
      });
    }
  };

  // Copy full story text to clipboard
  const handleCopyStory = () => {
    const fullText = `${story.title}\n\n${story.summary}\n\n` +
      story.chapters.map((c) => `${c.title}\n${c.content}\n\n`).join('') +
      `العبر المستفادة:\n` +
      story.moralLessons.map((m) => `· ${m}`).join('\n');

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Print friendly view
  const handlePrint = () => {
    window.print();
  };

  // Color theme classes
  const themeStyles = {
    parchment: 'bg-[#FBF9F4] text-[#24211D]',
    light: 'bg-white text-[#1C1917]',
    night: 'bg-[#18181B] text-[#E4E4E7]',
  }[readingTheme];

  const contentBorderStyles = {
    parchment: 'border-[#E6DEC9]',
    light: 'border-stone-200',
    night: 'border-zinc-800',
  }[readingTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 md:p-6 backdrop-blur-sm">
      <div
        className={`relative flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl shadow-2xl transition-colors ${themeStyles}`}
      >
        {/* Top Control Bar */}
        <div
          className={`flex flex-wrap items-center justify-between border-b px-4 py-3 sm:px-6 ${contentBorderStyles}`}
        >
          {/* Story Title & Category Info */}
          <div className="text-right">
            <div className="text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
              {story.category === 'prophets'
                ? 'قصص الأنبياء عليهم السلام'
                : story.category === 'caliphs'
                ? 'سير وقصص الخلفاء الراشدين والدولة الإسلامية'
                : 'روائع القصص والتراث العربي'}
            </div>
            <h2 className="font-amiri text-lg font-bold sm:text-xl truncate max-w-md">
              {story.title}
            </h2>
          </div>

          {/* Controls: Audio, Font, Theme, Bookmarks, Close */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              aria-label={isAudioPlaying ? 'إيقاف الاستماع' : 'استمع للقصة'}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                isAudioPlaying
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-zinc-800 dark:text-zinc-200'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">إيقاف</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">استمع</span>
                </>
              )}
            </button>

            {/* Font Size Adjusters */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-stone-200 px-1 py-0.5 text-xs dark:border-zinc-700">
              <button
                onClick={() => setFontSize((s) => Math.max(16, s - 2))}
                className="px-1.5 py-0.5 font-bold hover:opacity-70"
                title="تصغير الخط"
              >
                A-
              </button>
              <span className="text-[10px] text-stone-400">|</span>
              <button
                onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                className="px-1.5 py-0.5 font-bold hover:opacity-70"
                title="تكبير الخط"
              >
                A+
              </button>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-stone-200 p-0.5 text-xs dark:border-zinc-700">
              <button
                onClick={() => setReadingTheme('parchment')}
                className={`h-5 w-5 rounded-full border border-stone-300 bg-[#FAF7F2] ${
                  readingTheme === 'parchment' ? 'ring-2 ring-[#8C6D46]' : ''
                }`}
                title="نمط الورق العتيق"
              />
              <button
                onClick={() => setReadingTheme('light')}
                className={`h-5 w-5 rounded-full border border-stone-300 bg-white ${
                  readingTheme === 'light' ? 'ring-2 ring-stone-900' : ''
                }`}
                title="نمط النهار الناصع"
              />
              <button
                onClick={() => setReadingTheme('night')}
                className={`h-5 w-5 rounded-full border border-zinc-700 bg-zinc-900 ${
                  readingTheme === 'night' ? 'ring-2 ring-zinc-400' : ''
                }`}
                title="نمط الليل الهادئ"
              />
            </div>

            {/* Bookmark Action */}
            <button
              onClick={() => onToggleBookmark(story.id)}
              aria-label="حفظ القصة"
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-amber-600 bg-amber-50 dark:bg-zinc-800 dark:text-amber-400'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyStory}
              aria-label="نسخ نص القصة"
              className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                AudioNarrator.stop();
                onClose();
              }}
              aria-label="إغلاق"
              className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chapters Navigation Rail */}
        <div className={`flex overflow-x-auto border-b px-4 py-2 gap-2 text-xs ${contentBorderStyles}`}>
          {story.chapters.map((ch, idx) => (
            <button
              key={ch.number}
              onClick={() => {
                AudioNarrator.stop();
                setIsAudioPlaying(false);
                setActiveChapterIndex(idx);
                setShowQuiz(false);
              }}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
                activeChapterIndex === idx && !showQuiz
                  ? 'bg-[#24211D] text-white font-bold dark:bg-white dark:text-zinc-900'
                  : 'text-stone-600 hover:bg-stone-200/50 dark:text-zinc-400'
              }`}
            >
              {ch.title}
            </button>
          ))}

          {/* Quiz Tab Button if quiz questions exist */}
          {story.quiz && story.quiz.length > 0 && (
            <button
              onClick={() => {
                AudioNarrator.stop();
                setIsAudioPlaying(false);
                setShowQuiz(true);
              }}
              className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-colors ${
                showQuiz
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-zinc-800 dark:text-amber-400'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>اختبر فهمك ({story.quiz.length})</span>
            </button>
          )}
        </div>

        {/* Main Reading Viewport */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12">
          {!showQuiz ? (
            <div className="mx-auto max-w-2xl text-right">
              {/* Chapter Header */}
              <div className="mb-6 border-b border-stone-200/60 pb-4 dark:border-zinc-800">
                <span className="text-xs font-bold text-[#8C6D46] dark:text-[#D4A373]">
                  الفصل {currentChapter.number} من {story.chapters.length}
                </span>
                <h3 className="font-amiri text-2xl font-bold tracking-tight sm:text-3xl mt-1">
                  {currentChapter.title}
                </h3>
              </div>

              {/* Quranic Verse Box if present */}
              {currentChapter.quranVerse && (
                <div className="my-6 rounded-xl border border-amber-300/80 bg-amber-50/60 p-4 text-center font-amiri text-lg text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
                  {currentChapter.quranVerse}
                </div>
              )}

              {/* Chapter Prose Text */}
              <div
                style={{ fontSize: `${fontSize}px` }}
                className="font-amiri leading-loose whitespace-pre-line tracking-wide"
              >
                {currentChapter.content}
              </div>

              {/* Moral Lessons Footer on the last chapter */}
              {activeChapterIndex === story.chapters.length - 1 &&
                story.moralLessons &&
                story.moralLessons.length > 0 && (
                  <div className="mt-12 rounded-2xl border border-stone-200 bg-[#EFE9DD]/50 p-6 text-right dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h4 className="font-amiri text-xl font-bold text-[#1F1C18] dark:text-white">
                      العبر والدروس المستفادة:
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#575147] dark:text-zinc-300">
                      {story.moralLessons.map((lesson, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#8C6D46] dark:text-[#D4A373] font-bold">·</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ) : (
            /* Interactive Quiz Mode */
            <div className="mx-auto max-w-2xl text-right">
              <div className="mb-6 border-b border-stone-200/60 pb-4 dark:border-zinc-800">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  اختبار استيعاب الفهم
                </span>
                <h3 className="font-amiri text-2xl font-bold tracking-tight sm:text-3xl mt-1">
                  أسئلة حول حكاية: {story.title}
                </h3>
              </div>

              <div className="space-y-6">
                {story.quiz?.map((q) => {
                  const selectedOption = quizAnswers[q.id];
                  const isCorrect = selectedOption === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-stone-200 p-5 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    >
                      <h4 className="font-amiri text-lg font-bold">
                        {q.id}. {q.question}
                      </h4>

                      <div className="mt-4 space-y-2">
                        {q.options.map((opt, optIdx) => {
                          let optStyle = 'border-stone-200 hover:bg-stone-50 dark:border-zinc-700';

                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950/40 dark:text-emerald-200';
                            } else if (selectedOption === optIdx && !isCorrect) {
                              optStyle = 'border-red-400 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200';
                            }
                          } else if (selectedOption === optIdx) {
                            optStyle = 'border-stone-900 bg-stone-100 font-semibold dark:border-white dark:bg-zinc-800';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                if (!quizSubmitted) {
                                  setQuizAnswers({ ...quizAnswers, [q.id]: optIdx });
                                }
                              }}
                              className={`w-full rounded-lg border p-3 text-right text-xs transition-colors flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === q.correctIndex && (
                                <Check className="h-4 w-4 text-emerald-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="mt-3 rounded-lg bg-stone-100 p-3 text-xs leading-relaxed text-stone-700 dark:bg-zinc-800 dark:text-zinc-300">
                          <span className="font-bold">التفسير: </span>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end pt-4">
                  {!quizSubmitted ? (
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      className="rounded-lg bg-[#24211D] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#3D3730] dark:bg-white dark:text-zinc-900"
                    >
                      تحقق من الإجابات
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="rounded-lg border border-stone-300 px-6 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-zinc-700 dark:text-zinc-200"
                    >
                      إعادة الاختبار
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Chapter Navigation Footer */}
        {!showQuiz && (
          <div
            className={`flex items-center justify-between border-t px-6 py-3 text-xs ${contentBorderStyles}`}
          >
            <button
              disabled={activeChapterIndex === 0}
              onClick={() => {
                AudioNarrator.stop();
                setIsAudioPlaying(false);
                setActiveChapterIndex((prev) => Math.max(0, prev - 1));
              }}
              className="flex items-center gap-1.5 font-semibold disabled:opacity-30 hover:text-[#8C6D46]"
            >
              <ChevronRight className="h-4 w-4" />
              <span>الفصل السابق</span>
            </button>

            <span className="text-stone-400">
              {activeChapterIndex + 1} / {story.chapters.length}
            </span>

            <button
              disabled={activeChapterIndex === story.chapters.length - 1}
              onClick={() => {
                AudioNarrator.stop();
                setIsAudioPlaying(false);
                setActiveChapterIndex((prev) =>
                  Math.min(story.chapters.length - 1, prev + 1)
                );
              }}
              className="flex items-center gap-1.5 font-semibold disabled:opacity-30 hover:text-[#8C6D46]"
            >
              <span>الفصل التالي</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
