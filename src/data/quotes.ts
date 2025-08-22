export interface Quote {
  id: number;
  text: string;
  author: string;
  category: string;
  tags: string[];
}

export const quotes: Quote[] = [
  // Motivation & Success
  {
    id: 1,
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Success",
    tags: ["action", "motivation", "start"]
  },
  {
    id: 2,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Success",
    tags: ["courage", "persistence", "resilience"]
  },
  {
    id: 3,
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    category: "Success",
    tags: ["ambition", "excellence", "growth"]
  },

  // Discipline & Growth
  {
    id: 4,
    text: "You have the right to perform your actions, but you are not entitled to the fruits of the actions.",
    author: "Bhagavad Gita",
    category: "Discipline",
    tags: ["duty", "detachment", "action"]
  },
  {
    id: 5,
    text: "What does not kill me makes me stronger.",
    author: "Friedrich Nietzsche",
    category: "Growth",
    tags: ["strength", "adversity", "resilience"]
  },
  {
    id: 6,
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "Growth",
    tags: ["mindset", "thoughts", "transformation"]
  },
  {
    id: 7,
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
    category: "Discipline",
    tags: ["goals", "achievement", "consistency"]
  },

  // Failure & Learning
  {
    id: 8,
    text: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
    category: "Failure",
    tags: ["learning", "persistence", "innovation"]
  },
  {
    id: 9,
    text: "Failure is simply the opportunity to begin again, this time more intelligently.",
    author: "Henry Ford",
    category: "Failure",
    tags: ["opportunity", "wisdom", "restart"]
  },
  {
    id: 10,
    text: "The only real mistake is the one from which we learn nothing.",
    author: "Henry Ford",
    category: "Failure",
    tags: ["learning", "mistakes", "growth"]
  },

  // Sadness & Healing
  {
    id: 11,
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    category: "Sadness",
    tags: ["healing", "transformation", "light"]
  },
  {
    id: 12,
    text: "Even the darkest night will end and the sun will rise.",
    author: "Victor Hugo",
    category: "Sadness",
    tags: ["hope", "endurance", "dawn"]
  },
  {
    id: 13,
    text: "Tears are words that need to be written.",
    author: "Paulo Coelho",
    category: "Sadness",
    tags: ["emotion", "expression", "healing"]
  },

  // Anger & Peace
  {
    id: 14,
    text: "Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.",
    author: "Buddha",
    category: "Anger",
    tags: ["release", "harm", "suffering"]
  },
  {
    id: 15,
    text: "Peace cannot be kept by force; it can only be achieved by understanding.",
    author: "Albert Einstein",
    category: "Peace",
    tags: ["understanding", "force", "harmony"]
  },
  {
    id: 16,
    text: "The best fighter is never angry.",
    author: "Lao Tzu",
    category: "Peace",
    tags: ["control", "calm", "strength"]
  },

  // Love & Relationships
  {
    id: 17,
    text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
    author: "Lao Tzu",
    category: "Love",
    tags: ["strength", "courage", "connection"]
  },
  {
    id: 18,
    text: "The greatest thing you'll ever learn is just to love and be loved in return.",
    author: "Eden Ahbez",
    category: "Love",
    tags: ["reciprocity", "learning", "fulfillment"]
  },
  {
    id: 19,
    text: "Love is not about how much you say 'I love you', but how much you prove that it's true.",
    author: "Unknown",
    category: "Love",
    tags: ["actions", "proof", "authenticity"]
  },

  // Stoic Philosophy
  {
    id: 20,
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    category: "Peace",
    tags: ["control", "mindset", "stoicism"]
  },
  {
    id: 21,
    text: "No man is free who is not master of himself.",
    author: "Epictetus",
    category: "Discipline",
    tags: ["freedom", "self-control", "mastery"]
  },
  {
    id: 22,
    text: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius",
    category: "Growth",
    tags: ["happiness", "thoughts", "quality"]
  },

  // More Bhagavad Gita
  {
    id: 23,
    text: "Set thy heart upon thy work, but never on its reward.",
    author: "Bhagavad Gita",
    category: "Discipline",
    tags: ["focus", "detachment", "work"]
  },
  {
    id: 24,
    text: "When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.",
    author: "Bhagavad Gita",
    category: "Peace",
    tags: ["meditation", "stability", "focus"]
  },

  // Modern Motivation
  {
    id: 25,
    text: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "Success",
    tags: ["limitations", "imagination", "potential"]
  },
  {
    id: 26,
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "Growth",
    tags: ["comfort", "challenge", "greatness"]
  },
  {
    id: 27,
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "Success",
    tags: ["dreams", "action", "execution"]
  }
];

export const categories = [
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

export const getQuotesByCategory = (category: string): Quote[] => {
  if (category === "All") return quotes;
  return quotes.filter(quote => quote.category === category);
};

export const getRandomQuote = (): Quote => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getRandomQuoteByCategory = (category: string): Quote => {
  const categoryQuotes = getQuotesByCategory(category);
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
};