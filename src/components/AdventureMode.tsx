import React, { useState } from 'react';
import { Compass, RotateCcw, Award, CheckCircle, ArrowLeft, Footprints } from 'lucide-react';
import { ADVENTURE_STORIES } from '../data/interactiveAdventures';
import { AdventureStory, InteractiveAdventureNode } from '../types';

export const AdventureMode: React.FC = () => {
  const [selectedAdventure, setSelectedAdventure] = useState<AdventureStory>(
    ADVENTURE_STORIES[0]
  );
  const [currentNodeId, setCurrentNodeId] = useState<string>(
    selectedAdventure.startNodeId
  );
  const [historyTrail, setHistoryTrail] = useState<{ title: string; choiceMade?: string }[]>([
    { title: selectedAdventure.nodes[selectedAdventure.startNodeId]?.title || 'البداية' },
  ]);

  const currentNode: InteractiveAdventureNode =
    selectedAdventure.nodes[currentNodeId] ||
    selectedAdventure.nodes[selectedAdventure.startNodeId];

  const handleChoose = (choice: {
    text: string;
    targetNodeId: string;
    moralTrait: string;
  }) => {
    const nextNode = selectedAdventure.nodes[choice.targetNodeId];
    if (nextNode) {
      setCurrentNodeId(choice.targetNodeId);
      setHistoryTrail((prev) => [
        ...prev,
        { title: nextNode.title, choiceMade: choice.text },
      ]);
    }
  };

  const handleRestart = () => {
    setCurrentNodeId(selectedAdventure.startNodeId);
    setHistoryTrail([
      { title: selectedAdventure.nodes[selectedAdventure.startNodeId]?.title || 'البداية' },
    ]);
  };

  return (
    <div className="py-12 transition-colors">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-right border-b border-[#E6DEC9] pb-6 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
                اختر مسارك وعش المغامرة
              </div>
              <h2 className="mt-1 font-amiri text-3xl font-bold tracking-tight text-[#1F1C18] sm:text-4xl dark:text-[#FAF7F2]">
                مغامرات تفاعلية متعددة المسارات
              </h2>
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 rounded-lg border border-[#D9CDB8] px-3.5 py-2 text-xs font-semibold text-[#575147] transition-colors hover:bg-stone-100 hover:text-[#1F1C18] dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>إعادة من البداية</span>
            </button>
          </div>
          <p className="mt-2 text-sm text-[#575147] dark:text-stone-300">
            أنت بطل القصة وصانع أحداثها؛ كل قرار تتخذه يقودك إلى منعطف مختلف ويمتحن خصائل الصدق والشجاعة والمروءة.
          </p>
        </div>

        {/* Trail Breadcrumbs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[#706859] dark:text-stone-400">
          <Footprints className="h-3.5 w-3.5 text-[#8C6D46] dark:text-[#D4A373]" />
          <span>مسارك حتى الآن:</span>
          {historyTrail.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="font-semibold text-[#1F1C18] dark:text-white">
                {item.title}
              </span>
              {idx < historyTrail.length - 1 && (
                <span className="text-stone-400">←</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Interactive Story Scene Card */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#E6DEC9] bg-white shadow-md dark:border-stone-800 dark:bg-stone-900">
          {/* Scene Header */}
          <div className="border-b border-[#EFE9DD] bg-[#FAF7F2] px-6 py-4 dark:border-stone-800 dark:bg-stone-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#8C6D46] dark:text-[#D4A373]">
                {selectedAdventure.title}
              </span>
              <span className="text-xs text-[#8F8778] dark:text-stone-400">
                المشهد #{historyTrail.length}
              </span>
            </div>
            <h3 className="mt-1 font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
              {currentNode.title}
            </h3>
          </div>

          {/* Scene Narrative Prose */}
          <div className="p-6 sm:p-8">
            <p className="font-amiri text-lg leading-loose text-[#2B2721] sm:text-xl dark:text-stone-200">
              {currentNode.sceneText}
            </p>

            {/* Ending Resolution if reached */}
            {currentNode.isEnding && (
              <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50/70 p-6 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="mt-3 font-amiri text-2xl font-bold text-[#1F1C18] dark:text-white">
                  خاتمة الرحلة وظفر الحكمة
                </h4>
                {currentNode.moralSummary && (
                  <p className="mt-2 font-amiri text-base italic text-[#575147] dark:text-stone-300">
                    {currentNode.moralSummary}
                  </p>
                )}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 rounded-lg bg-[#24211D] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#3D3730] dark:bg-[#E6DEC9] dark:text-stone-900"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>خوض مغامرة أخرى بمسارات جديدة</span>
                  </button>
                </div>
              </div>
            )}

            {/* Choices Options */}
            {!currentNode.isEnding && currentNode.choices.length > 0 && (
              <div className="mt-8 border-t border-[#EFE9DD] pt-6 dark:border-stone-800">
                <span className="text-xs font-bold text-[#8C6D46] dark:text-[#D4A373]">
                  ماذا تختار أن تفعل في هذا الموقف؟
                </span>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentNode.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoose(choice)}
                      className="group flex flex-col justify-between rounded-xl border border-[#D9CDB8] bg-[#FAF7F2] p-4 text-right transition-all hover:border-[#8C6D46] hover:bg-white hover:shadow-md dark:border-stone-700 dark:bg-stone-800 dark:hover:border-[#D4A373] dark:hover:bg-stone-700/60"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-amiri text-base font-bold text-[#1F1C18] group-hover:text-[#8C6D46] dark:text-white dark:group-hover:text-[#D4A373]">
                          {choice.text}
                        </span>
                        <ArrowLeft className="h-4 w-4 shrink-0 text-[#8C6D46] transition-transform group-hover:translate-x-[-3px] dark:text-[#D4A373]" />
                      </div>

                      <div className="mt-3 text-[11px] text-[#706859] dark:text-stone-400">
                        الدافع الأخلاقي: <span className="font-medium">{choice.moralTrait}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
