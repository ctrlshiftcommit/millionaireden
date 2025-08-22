import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  Download, 
  Star, 
  Hash,
  Edit3,
  Trash2,
  Filter,
  BookMarked,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useJournal } from "@/hooks/useJournal";

const Journal = () => {
  const { 
    entries, 
    createEntry, 
    updateEntry, 
    deleteEntry, 
    toggleImportant, 
    extractTagsFromContent,
    exportToObsidian,
    searchEntries,
    getImportantEntries,
    getStats 
  } = useJournal();

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({ 
    title: "", 
    content: "", 
    tags: [] as string[],
    isImportant: false 
  });

  const stats = getStats();
  const displayedEntries = showImportantOnly 
    ? getImportantEntries() 
    : searchEntries(searchTerm);

  const handleSaveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    
    const extractedTags = extractTagsFromContent(newEntry.content);
    
    createEntry({
      title: newEntry.title,
      content: newEntry.content,
      tags: extractedTags,
      isImportant: newEntry.isImportant,
    });

    setShowNewEntry(false);
    setNewEntry({ title: "", content: "", tags: [], isImportant: false });
  };

  const handleExportToObsidian = () => {
    const exportData = exportToObsidian();
    
    // Create and download files
    exportData.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-hero px-4 pt-8 pb-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center glow-effect">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">Journal</h1>
          </div>
          <p className="text-muted-foreground text-lg">Capture your thoughts, track your growth</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="glass-effect p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-foreground">{stats.totalEntries}</p>
            <p className="text-xs text-muted-foreground">Entries</p>
          </div>
          <div className="glass-effect p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-foreground">{stats.totalWords}</p>
            <p className="text-xs text-muted-foreground">Words</p>
          </div>
          <div className="glass-effect p-3 rounded-lg text-center">
            <p className="text-xl font-bold text-foreground">{stats.importantEntries}</p>
            <p className="text-xs text-muted-foreground">Starred</p>
          </div>
        </div>

        <Button 
          onClick={() => setShowNewEntry(true)}
          className="gradient-primary text-white w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="px-4 -mt-4">
        {/* Search and Filters */}
        <Card className="card-elegant p-4 mb-6">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search entries, tags, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                variant={showImportantOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowImportantOnly(!showImportantOnly)}
              >
                <Star className="w-4 h-4 mr-2" />
                Important Only
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToObsidian}
              >
                <Download className="w-4 h-4 mr-2" />
                Export to Obsidian
              </Button>
            </div>
          </div>
        </Card>

        {/* New Entry Form */}
        {showNewEntry && (
          <Card className="card-elegant p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">New Entry</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewEntry({ ...newEntry, isImportant: !newEntry.isImportant })}
                  className={newEntry.isImportant ? "text-primary border-primary" : ""}
                >
                  <Star className={`w-4 h-4 ${newEntry.isImportant ? "fill-current" : ""}`} />
                </Button>
              </div>
              
              <Input
                placeholder="Entry title..."
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                className="text-lg font-medium"
              />
              
              <Textarea
                placeholder="Start writing your thoughts... 

Use #tags to organize your entries.
Markdown formatting is supported."
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                rows={10}
                className="resize-none font-mono text-sm"
              />
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span>Tags will be auto-extracted from #hashtags in your content</span>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveEntry} className="gradient-primary text-white">
                  Save Entry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewEntry(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Top Tags */}
        {stats.topTags.length > 0 && (
          <Card className="card-elegant p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Popular Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.topTags.map(([tag, count]) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => setSearchTerm(`#${tag}`)}
                >
                  #{tag} <span className="ml-1 text-xs">({count})</span>
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Journal Entries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {showImportantOnly ? "Important Entries" : "Recent Entries"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {displayedEntries.length} {displayedEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {displayedEntries.length === 0 ? (
            <Card className="card-elegant p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No entries found matching your search." : "No entries yet."}
              </p>
              <Button 
                onClick={() => {
                  if (searchTerm) {
                    setSearchTerm("");
                    setShowImportantOnly(false);
                  } else {
                    setShowNewEntry(true);
                  }
                }}
                variant="outline"
              >
                {searchTerm ? "Clear Search" : "Create Your First Entry"}
              </Button>
            </Card>
          ) : (
            displayedEntries.map((entry) => (
              <Card key={entry.id} className="card-elegant p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{entry.title}</h3>
                        {entry.isImportant && (
                          <Star className="w-4 h-4 text-primary fill-current" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{entry.wordCount} words</span>
                        {entry.mood && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{entry.mood}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleImportant(entry.id)}
                      className={`p-1 ${entry.isImportant ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <Star className={`w-4 h-4 ${entry.isImportant ? "fill-current" : ""}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {entry.content.replace(/#\w+/g, '').replace(/^#+\s*/gm, '').trim()}
                  </p>
                </div>
                
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-primary/20"
                        onClick={() => setSearchTerm(`#${tag}`)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;