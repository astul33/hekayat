import { Story } from '../types';

const STORAGE_KEYS = {
  BOOKMARKS: 'rawi_bookmarks_v1',
  USER_STORIES: 'rawi_user_stories_v1',
  READ_HISTORY: 'rawi_read_history_v1',
};

export const StorageService = {
  getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(storyId: string): boolean {
    const list = this.getBookmarks();
    const index = list.indexOf(storyId);
    let isBookmarked = false;
    if (index >= 0) {
      list.splice(index, 1);
      isBookmarked = false;
    } else {
      list.push(storyId);
      isBookmarked = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
    return isBookmarked;
  },

  isBookmarked(storyId: string): boolean {
    return this.getBookmarks().includes(storyId);
  },

  getUserStories(): Story[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_STORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUserStory(story: Story): Story[] {
    const list = this.getUserStories();
    const index = list.findIndex((s) => s.id === story.id);
    if (index >= 0) {
      list[index] = story;
    } else {
      list.unshift(story);
    }
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STORIES, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
    return list;
  },

  deleteUserStory(storyId: string): Story[] {
    const list = this.getUserStories().filter((s) => s.id !== storyId);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STORIES, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
    return list;
  },

  markAsRead(storyId: string) {
    try {
      const history = this.getReadHistory();
      if (!history.includes(storyId)) {
        history.push(storyId);
        localStorage.setItem(STORAGE_KEYS.READ_HISTORY, JSON.stringify(history));
      }
    } catch (e) {
      console.error(e);
    }
  },

  getReadHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READ_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
};
