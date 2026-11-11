import React, { useState } from 'react';
import { Sparkles, PenTool, Plus, Trash2, CheckCircle2, RefreshCw, BookOpen, Volume2, Bookmark } from 'lucide-react';
import { Story, Chapter, Character } from '../types';

interface StoryCreatorStudioProps {
  onStoryCreated: (story: Story) => void;
  onOpenStory: (story: Story) => void;
}

export const StoryCreatorStudio: React.FC<StoryCreatorStudioProps> = ({
  onStoryCreated,
  onOpenStory,
}) => {
  const [activeMode, setActiveMode] = useState<'ai' | 'manual'>('ai');

  // AI Form States
  const [theme, setTheme] = useState('حكمة وتراث');
  const [protagonist, setProtagonist] = useState('تاجر شاب أمين');
  const [moral, setMoral] = useState('الصدق ينجي والأمانة أثمن من الذهب');
  const [setting, setSetting] = useState('أسواق بغداد العتيقة وقافلة الشام');
  const [tone, setTone] = useState('أدبي بليغ ومشوق');
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual Form States
  const [manualTitle, setManualTitle] = useState('');
  const [manualSummary, setManualSummary] = useState('');
  const [manualCategory, setManualCategory] = useState('حكمة وعبرة');
  const [manualMoral, setManualMoral] = useState('');
  const [manualSetting, setManualSetting] = useState('');
  const [characters, setCharacters] = useState<Character[]>([
    { name: 'البطل', role: 'الشخصية الرئيسية الساعية للخير' },
  ]);
  const [chapters, setChapters] = useState<Chapter[]>([
    { number: 1, title: 'الفصل الأول: البداية', content: '' },
  ]);
  const [manualSuccess, setManualSuccess] = useState(false);

  // AI Preset Suggestions
  const themesList = [
    'حكمة وتراث',
    'مغامرة في الصحراء',
    'فطنة وذكاء',
    'كرم ومروءة',
    'وفاء بالعهد',
    'خيال أسطوري هادف',
  ];

  const protagonistsList = [
    'تاجر شاب أمين',
    'فارس شجاع ذو مروءة',
    'فتاة ذكية شغوفة بالحكمة',
    'شيخ حكيم صاحب سراج',
    'صياد صبور في قرية ساحلية',
  ];

  const moralsList = [
    'الصدق ينجي والأمانة أثمن من الذهب',
    'الصبر مفتاح الفرج بعد العسر',
    'إعانة الملهوف تفتح أبواب الرحمة',
    'العفو عند المقدرة سمة النبلاء',
    'التعاون يهزم الصعاب المستحيلة',
  ];

  const settingsList = [
    'أسواق بغداد العتيقة وقافلة الشام',
    'واحة نخيل نائية في عمق الصحراء',
    'قصر أندلسي عريق في قرطبة',
    'ميناء بحري وسفينة أشرعتها فضية',
    'قلعة جبلية محاطة بأشجار الزيتون',
  ];

  // Handle AI Story Generation
  const handleGenerateStory = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedStory(null);

    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          protagonist,
          moral,
          setting,
          tone,
          userPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('حدث خطأ أثناء التواصل مع خادم التأليف');
      }

      const data = await response.json();
      if (!data.story) {
        throw new Error('لم يتم استلام محتوى صالح');
      }

      const newStory: Story = {
        id: `created-${Date.now()}`,
        title: data.story.title || 'قصة جديدة',
        category: 'user_created',
        subCategory: data.story.genre || theme,
        summary: data.story.summary || '',
        image: '/src/assets/images/creator_enchanted_quill_1794394055671.jpg',
        readingTimeMinutes: Math.max(3, Math.ceil((data.story.chapters?.length || 1) * 2)),
        periodOrEra: 'تأليف خاص',
        location: data.story.setting || setting,
        characters: data.story.characters || [{ name: protagonist, role: 'البطل' }],
        chapters: data.story.chapters || [],
        moralLessons: data.story.moralLessons || [moral],
        quote: data.story.quote || '',
        choices: data.story.choices || [],
        isCustom: true,
        createdAt: new Date().toLocaleDateString('ar-SA'),
      };

      setGeneratedStory(newStory);
      onStoryCreated(newStory);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Manual Story Save
  const handleSaveManualStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const newStory: Story = {
      id: `manual-${Date.now()}`,
      title: manualTitle.trim(),
      category: 'user_created',
      subCategory: manualCategory,
      summary: manualSummary.trim() || 'قصة مؤلفة من إبداع الكاتب.',
      image: '/src/assets/images/creator_enchanted_quill_1794394055671.jpg',
      readingTimeMinutes: Math.max(2, Math.ceil(chapters.length * 2)),
      location: manualSetting || 'عالم الخيال والتراث',
      characters: characters.filter((c) => c.name.trim() !== ''),
      chapters: chapters.filter((ch) => ch.content.trim() !== ''),
      moralLessons: manualMoral ? [manualMoral] : ['العبرة في العمل الصالح'],
      isCustom: true,
      createdAt: new Date().toLocaleDateString('ar-SA'),
    };

    onStoryCreated(newStory);
    setManualSuccess(true);
    setTimeout(() => setManualSuccess(false), 4000);
  };

  return (
    <div className="py-12 transition-colors">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Studio Header */}
        <div className="text-right border-b border-[#E6DEC9] pb-6 dark:border-stone-800">
          <div className="text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
            محراب الكاتب والإبداع
          </div>
          <h2 className="mt-1 font-amiri text-3xl font-bold tracking-tight text-[#1F1C18] sm:text-4xl dark:text-[#FAF7F2]">
            صانع القصص ومحراب التأليف
          </h2>
          <p className="mt-2 text-sm text-[#575147] dark:text-stone-300">
            هنا تصنع قصتك بيدك؛ اختر عناصر الحكاية ليدبجها لك الذكاء الاصطناعي ببلاغة عربية، أو اكتب فصولك الخاصة بحرية تامة.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-6 flex items-center gap-2 p-1 bg-[#EFE9DD] rounded-xl w-fit dark:bg-stone-800">
            <button
              onClick={() => setActiveMode('ai')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeMode === 'ai'
                  ? 'bg-white text-[#1F1C18] shadow-sm dark:bg-stone-700 dark:text-white'
                  : 'text-[#6B6355] hover:text-[#1F1C18] dark:text-stone-300 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>الصانع الذكي (الموجّه بالذكاء الاصطناعي)</span>
            </button>

            <button
              onClick={() => setActiveMode('manual')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeMode === 'manual'
                  ? 'bg-white text-[#1F1C18] shadow-sm dark:bg-stone-700 dark:text-white'
                  : 'text-[#6B6355] hover:text-[#1F1C18] dark:text-stone-300 dark:hover:text-white'
              }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>التدوين والتأليف الحر</span>
            </button>
          </div>
        </div>

        {/* MODE A: AI GENERATOR */}
        {activeMode === 'ai' && (
          <div className="mt-8 space-y-8">
            <div className="rounded-2xl border border-[#E6DEC9] bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-amiri text-xl font-bold text-[#1F1C18] dark:text-[#FAF7F2]">
                ركائز وبناء الحكاية
              </h3>
              <p className="mt-1 text-xs text-[#706859] dark:text-stone-400">
                حدد ملامح القصة التي ترغب في صياغتها، وسيقوم الراوي بتأليف فصولها وعبرها وشخصياتها.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Theme Field */}
                <div>
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    نوع القصة والنمط العام
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white px-3.5 py-2.5 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  >
                    {themesList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Protagonist Field */}
                <div>
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    بطل القصة
                  </label>
                  <input
                    type="text"
                    value={protagonist}
                    onChange={(e) => setProtagonist(e.target.value)}
                    placeholder="مثال: فارس شجاع، تاجر أمين..."
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white px-3.5 py-2.5 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-[#8C6D46] dark:text-[#D4A373]">
                    {protagonistsList.slice(0, 3).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProtagonist(p)}
                        className="hover:underline"
                      >
                        {p} ·
                      </button>
                    ))}
                  </div>
                </div>

                {/* Moral Lesson Field */}
                <div>
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    العبرة الأخلاقية والهدف
                  </label>
                  <input
                    type="text"
                    value={moral}
                    onChange={(e) => setMoral(e.target.value)}
                    placeholder="مثال: الصدق ينجي، الصبر مفتاح الفرج..."
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white px-3.5 py-2.5 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-[#8C6D46] dark:text-[#D4A373]">
                    {moralsList.slice(0, 2).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMoral(m)}
                        className="hover:underline"
                      >
                        {m} ·
                      </button>
                    ))}
                  </div>
                </div>

                {/* Setting Field */}
                <div>
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    مكان وزمان الحكاية (البيئة)
                  </label>
                  <input
                    type="text"
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    placeholder="مثال: أسواق بغداد، واحة في الصحراء..."
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white px-3.5 py-2.5 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-[#8C6D46] dark:text-[#D4A373]">
                    {settingsList.slice(0, 2).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSetting(s)}
                        className="hover:underline"
                      >
                        {s} ·
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional notes / creative prompt */}
              <div className="mt-6">
                <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                  تفاصيل إضافية خاصة ترغب في تضمينها (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="مثال: أريد أن يواجه البطل لغزاً قديماً في بئر مهجورة برفقة صقر دربته عائلته..."
                  className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white p-3 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                />
              </div>

              {/* Generate Trigger */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-[#706859] dark:text-stone-400">
                  سيتم إنشاء قصة متعددة الفصول مع الشخصيات والعبر المستفادة
                </div>

                <button
                  onClick={handleGenerateStory}
                  disabled={isGenerating}
                  className="flex items-center gap-2 rounded-lg bg-[#24211D] px-6 py-2.5 text-xs font-bold text-[#FAF7F2] shadow-sm transition-all hover:bg-[#3D3730] disabled:opacity-60 whitespace-nowrap shrink-0 dark:bg-[#E6DEC9] dark:text-stone-900 dark:hover:bg-white"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>جاري صياغة القصة وبث الروح في الحكاية...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>ابدأ تأليف القصة الآن</span>
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Generated Story Presentation Box */}
            {generatedStory && (
              <div className="rounded-2xl border border-[#D4A373] bg-[#FCFBF7] p-6 shadow-md dark:border-[#8C6D46] dark:bg-stone-900">
                <div className="flex items-center justify-between border-b border-[#E6DEC9] pb-4 dark:border-stone-800">
                  <div>
                    <span className="text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
                      تم إتمام التأليف وحفظ القصة في مكتبتك بنجاح
                    </span>
                    <h3 className="mt-1 font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
                      {generatedStory.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onOpenStory(generatedStory)}
                    className="flex items-center gap-2 rounded-lg bg-[#8C6D46] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#735735] whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>فتح القصة في صالة القراءة</span>
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#575147] dark:text-stone-300">
                  {generatedStory.summary}
                </p>

                {/* Chapters Quick Preview */}
                <div className="mt-6 space-y-4">
                  {generatedStory.chapters.map((ch) => (
                    <div
                      key={ch.number}
                      className="rounded-xl border border-[#E6DEC9] bg-white p-4 dark:border-stone-800 dark:bg-stone-800/80"
                    >
                      <h4 className="font-amiri text-base font-bold text-[#1F1C18] dark:text-white">
                        {ch.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-[#575147] line-clamp-3 dark:text-stone-300">
                        {ch.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Moral lessons */}
                {generatedStory.moralLessons && (
                  <div className="mt-6 rounded-xl bg-[#EFE9DD] p-4 text-xs dark:bg-stone-800">
                    <span className="font-bold text-[#1F1C18] dark:text-white">
                      العبر المستفادة:
                    </span>
                    <ul className="mt-1.5 list-disc list-inside space-y-1 text-[#575147] dark:text-stone-300">
                      {generatedStory.moralLessons.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE B: MANUAL AUTHOR STUDIO */}
        {activeMode === 'manual' && (
          <form onSubmit={handleSaveManualStory} className="mt-8 space-y-8">
            <div className="rounded-2xl border border-[#E6DEC9] bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-amiri text-xl font-bold text-[#1F1C18] dark:text-[#FAF7F2]">
                بيانات ومخطط القصة
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    عنوان القصة
                  </label>
                  <input
                    type="text"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="مثال: سر الكهف المضيء في جبل الريحان"
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white px-3.5 py-2.5 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    التصنيف
                  </label>
                  <input
                    type="text"
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    placeholder="مثال: حكمة، مغامرة، خيال، تراث..."
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white px-3.5 py-2.5 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    ملخص موجز للقصة
                  </label>
                  <textarea
                    rows={2}
                    value={manualSummary}
                    onChange={(e) => setManualSummary(e.target.value)}
                    placeholder="اكتب فكرة الحكاية بإيجاز..."
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white p-3 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    البيئة أو المكان
                  </label>
                  <input
                    type="text"
                    value={manualSetting}
                    onChange={(e) => setManualSetting(e.target.value)}
                    placeholder="مثال: قرية وادعة، قصر قديم، صحراء..."
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white px-3.5 py-2.5 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D3730] dark:text-stone-300">
                    العبرة الأخلاقية
                  </label>
                  <input
                    type="text"
                    value={manualMoral}
                    onChange={(e) => setManualMoral(e.target.value)}
                    placeholder="مثال: من حفر حفرة لأخيه وقع فيها..."
                    className="mt-2 w-full rounded-xl border border-[#D9CDB8] bg-white px-3.5 py-2.5 text-xs text-[#1F1C18] shadow-sm focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Characters Section */}
              <div className="mt-8 border-t border-[#E6DEC9] pt-6 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-amiri text-lg font-bold text-[#1F1C18] dark:text-white">
                    شخصيات القصة
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setCharacters([...characters, { name: '', role: '' }])
                    }
                    className="flex items-center gap-1 text-xs font-bold text-[#8C6D46] hover:underline dark:text-[#D4A373]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>إضافة شخصية</span>
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {characters.map((char, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={char.name}
                        onChange={(e) => {
                          const updated = [...characters];
                          updated[idx].name = e.target.value;
                          setCharacters(updated);
                        }}
                        placeholder="اسم الشخصية"
                        className="w-1/3 rounded-xl border border-[#D9CDB8] bg-white px-3 py-2 text-xs text-[#1F1C18] dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                      />
                      <input
                        type="text"
                        value={char.role}
                        onChange={(e) => {
                          const updated = [...characters];
                          updated[idx].role = e.target.value;
                          setCharacters(updated);
                        }}
                        placeholder="دورها وصفاتها (مثال: رفيق الدرب الأمين)"
                        className="w-2/3 rounded-xl border border-[#D9CDB8] bg-white px-3 py-2 text-xs text-[#1F1C18] dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                      />
                      {characters.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setCharacters(characters.filter((_, i) => i !== idx))
                          }
                          className="p-1.5 text-stone-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chapters Section */}
              <div className="mt-8 border-t border-[#E6DEC9] pt-6 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-amiri text-lg font-bold text-[#1F1C18] dark:text-white">
                    فصول القصة
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setChapters([
                        ...chapters,
                        {
                          number: chapters.length + 1,
                          title: `الفصل ${chapters.length + 1}`,
                          content: '',
                        },
                      ])
                    }
                    className="flex items-center gap-1 text-xs font-bold text-[#8C6D46] hover:underline dark:text-[#D4A373]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>إضافة فصل جديد</span>
                  </button>
                </div>

                <div className="mt-4 space-y-6">
                  {chapters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E6DEC9] bg-[#FAF7F2] p-4 dark:border-stone-800 dark:bg-stone-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => {
                            const updated = [...chapters];
                            updated[idx].title = e.target.value;
                            setChapters(updated);
                          }}
                          placeholder="عنوان الفصل"
                          className="font-amiri text-base font-bold bg-transparent border-b border-[#D9CDB8] px-2 py-1 focus:outline-none dark:border-stone-600 dark:text-white"
                        />
                        {chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setChapters(chapters.filter((_, i) => i !== idx))
                            }
                            className="p-1 text-stone-400 hover:text-red-600 text-xs"
                          >
                            حذف الفصل
                          </button>
                        )}
                      </div>

                      <textarea
                        rows={5}
                        required
                        value={ch.content}
                        onChange={(e) => {
                          const updated = [...chapters];
                          updated[idx].content = e.target.value;
                          setChapters(updated);
                        }}
                        placeholder="اكتب أحداث هذا الفصل هنا بلغة مشوقة..."
                        className="w-full rounded-xl border border-[#D9CDB8] bg-white p-3 text-xs leading-relaxed text-[#1F1C18] focus:border-[#8C6D46] focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex items-center justify-between">
                {manualSuccess ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>تم حفظ قصتك بنجاح في مكتبتك!</span>
                  </div>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-[#24211D] px-6 py-2.5 text-xs font-bold text-[#FAF7F2] shadow-sm transition-all hover:bg-[#3D3730] whitespace-nowrap shrink-0 dark:bg-[#E6DEC9] dark:text-stone-900 dark:hover:bg-white"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>حفظ القصة في مكتبتي</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
