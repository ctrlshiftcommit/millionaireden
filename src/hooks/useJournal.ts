import { useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  wordCount: number;
}

const mockEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Morning Reflections',
    content: `# Morning Reflections

Today I woke up feeling grateful for the opportunities ahead. I completed my morning workout and meditation session. The discipline is building momentum.

## Key Insights
- Consistency is more important than intensity
- Small daily actions compound over time
- Gratitude shifts perspective instantly

#growth #meditation #discipline #gratitude`,
    tags: ['growth', 'meditation', 'discipline', 'gratitude'],
    isImportant: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    mood: 'great',
    wordCount: 234
  },
  {
    id: '2',
    title: 'Weekly Review',
    content: `# Weekly Review - Week 3

This week has been a journey of growth and challenges. I managed to stick to my habits 85% of the time, which is progress from last week.

## What Worked
- Morning routine consistency
- Evening planning sessions
- Reduced social media time

## Areas for Improvement
- Better sleep schedule
- More focused work sessions
- Consistent journaling

## Next Week Goals
- [ ] Wake up at 6 AM daily
- [ ] Complete all 4 core habits
- [ ] Read for 30 minutes before bed

#review #habits #goals #progress`,
    tags: ['review', 'habits', 'goals', 'progress'],
    isImportant: false,
    createdAt: '2024-01-14T20:00:00Z',
    updatedAt: '2024-01-14T20:45:00Z',
    mood: 'good',
    wordCount: 156
  },
  {
    id: '3',
    title: 'Breakthrough Moment',
    content: `# Breakthrough Moment

Had an incredible realization today about the power of compound habits. It's not about the individual actions, but the identity shift that happens when you consistently show up.

## The Shift
When I stopped asking "What do I want to achieve?" and started asking "Who do I want to become?", everything changed.

Every habit is a vote for the type of person you want to be.

#identity #mindset #breakthrough #philosophy`,
    tags: ['identity', 'mindset', 'breakthrough', 'philosophy'],
    isImportant: true,
    createdAt: '2024-01-13T14:30:00Z',
    updatedAt: '2024-01-13T15:00:00Z',
    mood: 'great',
    wordCount: 89
  }
];

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('millionaire-den-journal');
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      setEntries(mockEntries);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever entries change
    if (!loading) {
      localStorage.setItem('millionaire-den-journal', JSON.stringify(entries));
    }
  }, [entries, loading]);

  const createEntry = (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'wordCount'>) => {
    const now = new Date().toISOString();
    const wordCount = entryData.content.split(/\s+/).filter(word => word.length > 0).length;
    
    const newEntry: JournalEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      wordCount,
    };

    setEntries(prev => [newEntry, ...prev]);
    return newEntry.id;
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updatedContent = updates.content || entry.content;
        const wordCount = updatedContent.split(/\s+/).filter(word => word.length > 0).length;
        
        return {
          ...entry,
          ...updates,
          updatedAt: new Date().toISOString(),
          wordCount,
        };
      }
      return entry;
    }));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const toggleImportant = (id: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, isImportant: !entry.isImportant, updatedAt: new Date().toISOString() }
        : entry
    ));
  };

  const extractTagsFromContent = (content: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const exportToObsidian = () => {
    const exportData = entries.map(entry => {
      const frontMatter = `---
title: ${entry.title}
created: ${entry.createdAt}
updated: ${entry.updatedAt}
tags: [${entry.tags.join(', ')}]
important: ${entry.isImportant}
mood: ${entry.mood || 'not-set'}
word-count: ${entry.wordCount}
---

`;
      
      return {
        filename: `${entry.createdAt.split('T')[0]}-${entry.title.toLowerCase().replace(/\s+/g, '-')}.md`,
        content: frontMatter + entry.content
      };
    });

    // Create zip file or provide download links
    return exportData;
  };

  const searchEntries = (query: string) => {
    if (!query) return entries;
    
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry =>
      entry.title.toLowerCase().includes(lowercaseQuery) ||
      entry.content.toLowerCase().includes(lowercaseQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getEntriesByTag = (tag: string) => {
    return entries.filter(entry => entry.tags.includes(tag));
  };

  const getImportantEntries = () => {
    return entries.filter(entry => entry.isImportant);
  };

  const getStats = () => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const importantEntries = entries.filter(entry => entry.isImportant).length;
    const avgWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
    
    const tagCounts = entries.reduce((acc, entry) => {
      entry.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalEntries,
      totalWords,
      importantEntries,
      avgWordsPerEntry,
      topTags,
    };
  };

  return {
    entries,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    toggleImportant,
    extractTagsFromContent,
    exportToObsidian,
    searchEntries,
    getEntriesByTag,
    getImportantEntries,
    getStats,
  };
};