import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
  tags: string[];
  is_active: boolean;
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuotesByCategory = (category: string): Quote[] => {
    if (category === "All") return quotes;
    return quotes.filter(quote => quote.category === category);
  };

  const getRandomQuote = (): Quote | null => {
    if (quotes.length === 0) return null;
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const getRandomQuoteByCategory = (category: string): Quote | null => {
    const categoryQuotes = getQuotesByCategory(category);
    if (categoryQuotes.length === 0) return null;
    return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
  };

  const categories = [
    "All",
    "Success", 
    "Discipline", 
    "Growth", 
    "Failure", 
    "Sadness", 
    "Anger", 
    "Peace", 
    "Love"
  ];

  const shareQuote = async (quote: Quote): Promise<void> => {
    const text = `"${quote.text}" - ${quote.author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Inspirational Quote',
          text: text,
        });
      } catch (error) {
        // User cancelled or error occurred, fallback to clipboard
        fallbackShare(text);
      }
    } else {
      fallbackShare(text);
    }
  };

  const fallbackShare = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      // Show a toast notification that text was copied
      const event = new CustomEvent('quote-copied');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to copy quote:', error);
      // Final fallback - create a text selection
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      const event = new CustomEvent('quote-copied');
      window.dispatchEvent(event);
    }
  };

  return {
    quotes,
    loading,
    categories,
    getQuotesByCategory,
    getRandomQuote,
    getRandomQuoteByCategory,
    shareQuote,
    refetch: fetchQuotes
  };
};