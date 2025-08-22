import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Quote, Shuffle, Heart, Search, Filter, Bookmark, Share } from "lucide-react";
import { useState, useEffect } from "react";
import { quotes, categories, getQuotesByCategory, getRandomQuote } from "@/data/quotes";

const Motivation = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteQuotes, setFavoriteQuotes] = useState<number[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState(quotes);

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('millionaire-den-favorites');
    if (saved) {
      setFavoriteQuotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Filter quotes based on category and search
    let filtered = getQuotesByCategory(selectedCategory);
    
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredQuotes(filtered);
  }, [selectedCategory, searchTerm]);

  const getRandomQuoteFromCategory = () => {
    const categoryQuotes = getQuotesByCategory(selectedCategory);
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    setCurrentQuote(categoryQuotes[randomIndex]);
  };

  const toggleFavorite = (quoteId: number) => {
    const newFavorites = favoriteQuotes.includes(quoteId)
      ? favoriteQuotes.filter(id => id !== quoteId)
      : [...favoriteQuotes, quoteId];
    
    setFavoriteQuotes(newFavorites);
    localStorage.setItem('millionaire-den-favorites', JSON.stringify(newFavorites));
  };

  const shareQuote = (quote: typeof quotes[0]) => {
    if (navigator.share) {
      navigator.share({
        title: 'Inspirational Quote',
        text: `"${quote.text}" - ${quote.author}`,
      });
    } else {
      navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-hero px-4 pt-8 pb-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center glow-effect">
              <Quote className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">Motivation</h1>
          </div>
          <p className="text-muted-foreground text-lg">Feed your mind with timeless wisdom</p>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Featured Quote */}
        <Card className="card-elegant p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 gradient-primary opacity-10 rounded-full blur-xl" />
          
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Quote of the Day</span>
          </div>
          
          <blockquote className="text-xl text-foreground mb-4 leading-relaxed font-medium relative">
            <span className="text-4xl text-primary/20 absolute -top-2 -left-1">"</span>
            {currentQuote.text}
            <span className="text-4xl text-primary/20 absolute -bottom-6 right-0">"</span>
          </blockquote>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
              <div className="flex gap-1 mt-2">
                {currentQuote.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {currentQuote.category}
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={getRandomQuoteFromCategory}
              className="gradient-primary text-white flex-1"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              New Quote
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFavorite(currentQuote.id)}
              className={favoriteQuotes.includes(currentQuote.id) ? "text-primary border-primary" : ""}
            >
              <Heart className={`w-4 h-4 ${favoriteQuotes.includes(currentQuote.id) ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareQuote(currentQuote)}
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes, authors, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quote Library */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Quote Library</h2>
            <span className="text-sm text-muted-foreground">{filteredQuotes.length} quotes</span>
          </div>
          
          {filteredQuotes.length === 0 ? (
            <Card className="card-elegant p-8 text-center">
              <p className="text-muted-foreground">No quotes found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            filteredQuotes.map((quote) => (
              <Card key={quote.id} className="card-interactive p-4">
                <div className="flex items-start justify-between mb-3">
                  <blockquote className="text-foreground leading-relaxed flex-1 pr-4">
                    "{quote.text}"
                  </blockquote>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(quote.id)}
                      className={`p-1 ${favoriteQuotes.includes(quote.id) ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <Heart className={`w-4 h-4 ${favoriteQuotes.includes(quote.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => shareQuote(quote)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">— {quote.author}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {quote.category}
                    </Badge>
                    {quote.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Motivation;