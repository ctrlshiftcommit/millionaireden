import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote, Shuffle, Heart, Zap } from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "All", color: "primary" },
  { name: "Success", color: "secondary" },
  { name: "Discipline", color: "secondary" },
  { name: "Growth", color: "secondary" },
  { name: "Failure", color: "secondary" },
  { name: "Love", color: "secondary" },
];

const quotes = [
  {
    text: "You have the right to perform your actions, but you are not entitled to the fruits of the actions.",
    author: "Bhagavad Gita",
    category: "Discipline",
  },
  {
    text: "What does not kill me makes me stronger.",
    author: "Friedrich Nietzsche",
    category: "Growth",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Success",
  },
];

const Motivation = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <header className="pt-8 pb-6">
        <h1 className="text-3xl font-bold text-foreground">Motivation</h1>
        <p className="text-muted-foreground mt-1">Feed your mind with wisdom</p>
      </header>

      {/* Daily Quote */}
      <Card className="card-elegant p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Quote className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Quote of the Day</span>
        </div>
        
        <blockquote className="text-lg text-foreground mb-4 leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
          <Badge variant="secondary" className="text-xs">
            {currentQuote.category}
          </Badge>
        </div>
        
        <Button 
          onClick={getRandomQuote}
          variant="outline" 
          size="sm" 
          className="mt-4 w-full"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Random Quote
        </Button>
      </Card>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Quote Library */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quote Library</h2>
        
        {quotes.map((quote, index) => (
          <Card key={index} className="card-elegant p-4">
            <blockquote className="text-foreground mb-3 leading-relaxed">
              "{quote.text}"
            </blockquote>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">— {quote.author}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {quote.category}
                </Badge>
                <Button size="sm" variant="ghost" className="p-1">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Motivation;