import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  is_important: boolean;
  word_count: number;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'millionaire-den-journal-entries';

export const useJournalLocal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    saveEntries();
  }, [entries]);

  const loadEntries = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setEntries(parsed);
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntries = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entries:', error);
    }
  };

  const addEntry = (entryData: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at' | 'word_count'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      word_count: entryData.content.trim().split(/\s+/).length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEntries(prev => [newEntry, ...prev]);
    
    toast({
      title: "Entry Saved",
      description: "Your journal entry has been saved locally.",
    });

    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { 
            ...entry, 
            ...updates,
            word_count: updates.content ? updates.content.trim().split(/\s+/).length : entry.word_count,
            updated_at: new Date().toISOString()
          }
        : entry
    ));

    toast({
      title: "Entry Updated",
      description: "Your journal entry has been updated.",
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    
    toast({
      title: "Entry Deleted",
      description: "Your journal entry has been deleted.",
    });
  };

  const getStats = () => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + entry.word_count, 0);
    const importantEntries = entries.filter(entry => entry.is_important).length;
    
    // Calculate entries this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const entriesThisWeek = entries.filter(
      entry => new Date(entry.created_at) >= oneWeekAgo
    ).length;

    return {
      totalEntries,
      totalWords,
      importantEntries,
      entriesThisWeek,
      averageWordsPerEntry: totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0
    };
  };

  const searchEntries = (query: string): JournalEntry[] => {
    if (!query.trim()) return entries;
    
    const searchTerm = query.toLowerCase();
    return entries.filter(entry =>
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  };

  const getEntriesByTag = (tag: string): JournalEntry[] => {
    return entries.filter(entry => entry.tags.includes(tag));
  };

  const getAllTags = (): string[] => {
    const allTags = entries.flatMap(entry => entry.tags);
    return [...new Set(allTags)].sort();
  };

  const exportEntries = (): string => {
    const exportData = {
      entries,
      exportedAt: new Date().toISOString(),
      totalEntries: entries.length,
      stats: getStats()
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  const importEntries = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.entries && Array.isArray(data.entries)) {
        // Merge with existing entries, avoiding duplicates by ID
        const existingIds = new Set(entries.map(e => e.id));
        const newEntries = data.entries.filter((entry: JournalEntry) => !existingIds.has(entry.id));
        
        setEntries(prev => [...newEntries, ...prev].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
        
        toast({
          title: "Import Successful",
          description: `Imported ${newEntries.length} new journal entries.`,
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error importing entries:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import journal entries. Please check the file format.",
        variant: "destructive"
      });
    }
    
    return false;
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    getStats,
    searchEntries,
    getEntriesByTag,
    getAllTags,
    exportEntries,
    importEntries
  };
};