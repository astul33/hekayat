import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProphetsSection } from './components/ProphetsSection';
import { CaliphsSection } from './components/CaliphsSection';
import { GeneralStoriesSection } from './components/GeneralStoriesSection';
import { StoryCreatorStudio } from './components/StoryCreatorStudio';
import { AdventureMode } from './components/AdventureMode';
import { MyStoriesSection } from './components/MyStoriesSection';
import { StoryReaderModal } from './components/StoryReaderModal';
import { Footer } from './components/Footer';

import { PROPHET_STORIES } from './data/prophetStories';
import { CALIPH_STORIES } from './data/caliphStories';
import { GENERAL_STORIES } from './data/generalStories';
import { Story, StoryCategory } from './types';
import { StorageService } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<StoryCategory>('prophets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize stored bookmarks and stories
  useEffect(() => {
    setBookmarks(StorageService.getBookmarks());
    setUserStories(StorageService.getUserStories());

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleToggleBookmark = (storyId: string) => {
    StorageService.toggleBookmark(storyId);
    setBookmarks(StorageService.getBookmarks());
  };

  const isBookmarked = (storyId: string) => bookmarks.includes(storyId);

  const handleStoryCreated = (newStory: Story) => {
    const updated = StorageService.saveUserStory(newStory);
    setUserStories(updated);
  };

  const handleDeleteUserStory = (storyId: string) => {
    const updated = StorageService.deleteUserStory(storyId);
    setUserStories(updated);
  };

  // Find bookmarked stories across all collections
  const allCollectionStories = [
    ...PROPHET_STORIES,
    ...CALIPH_STORIES,
    ...GENERAL_STORIES,
    ...userStories,
  ];
  const bookmarkedStories = allCollectionStories.filter((s) => bookmarks.includes(s.id));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24211D] transition-colors dark:bg-[#121214] dark:text-[#E4E4E7]">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCreator={() => {
          setActiveTab('creator');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={bookmarks.length + userStories.length}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Hero Banner (Visible on discovery tabs: prophets, caliphs, general) */}
      {(activeTab === 'prophets' || activeTab === 'caliphs' || activeTab === 'general') && (
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectTab={setActiveTab}
          onOpenCreator={() => setActiveTab('creator')}
        />
      )}

      {/* Main Content Sections */}
      <main>
        {activeTab === 'prophets' && (
          <ProphetsSection
            stories={PROPHET_STORIES}
            searchQuery={searchQuery}
            onSelectStory={setSelectedStory}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'caliphs' && (
          <CaliphsSection
            stories={CALIPH_STORIES}
            searchQuery={searchQuery}
            onSelectStory={setSelectedStory}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'general' && (
          <GeneralStoriesSection
            stories={GENERAL_STORIES}
            searchQuery={searchQuery}
            onSelectStory={setSelectedStory}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'creator' && (
          <StoryCreatorStudio
            onStoryCreated={handleStoryCreated}
            onOpenStory={setSelectedStory}
          />
        )}

        {activeTab === 'adventure' && <AdventureMode />}

        {activeTab === 'my-library' && (
          <MyStoriesSection
            userStories={userStories}
            bookmarkedStories={bookmarkedStories}
            onSelectStory={setSelectedStory}
            onDeleteUserStory={handleDeleteUserStory}
            onToggleBookmark={handleToggleBookmark}
            onOpenCreator={() => setActiveTab('creator')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Story Reader Modal */}
      <StoryReaderModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={selectedStory ? isBookmarked(selectedStory.id) : false}
      />
    </div>
  );
}
