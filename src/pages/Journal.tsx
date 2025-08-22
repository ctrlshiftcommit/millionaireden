import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, FileText, Calendar, Download } from "lucide-react";
import { useState } from "react";

const mockEntries = [
  {
    id: 1,
    title: "Morning Reflections",
    content: "Today I woke up feeling grateful for the opportunities ahead...",
    date: "2024-01-15",
    preview: "Today I woke up feeling grateful for the opportunities ahead. I completed my morning workout and meditation session. The discipline is building..."
  },
  {
    id: 2,
    title: "Weekly Review",
    content: "This week has been a journey of growth and challenges...",
    date: "2024-01-14",
    preview: "This week has been a journey of growth and challenges. I managed to stick to my habits 85% of the time, which is progress from last week..."
  },
];

const Journal = () => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });

  const handleSaveEntry = () => {
    // Handle saving entry
    setShowNewEntry(false);
    setNewEntry({ title: "", content: "" });
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <header className="pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Journal</h1>
            <p className="text-muted-foreground mt-1">Capture your thoughts and growth</p>
          </div>
          <Button 
            onClick={() => setShowNewEntry(true)}
            className="gradient-primary text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search your entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="card-elegant p-6 mb-6">
          <div className="space-y-4">
            <Input
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="text-lg font-medium"
            />
            <Textarea
              placeholder="Start writing your thoughts..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              rows={8}
              className="resize-none"
            />
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

      {/* Export Options */}
      <Card className="card-elegant p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Export to Obsidian</p>
              <p className="text-sm text-muted-foreground">Download as markdown files</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Entries</h2>
          <span className="text-sm text-muted-foreground">{mockEntries.length} entries</span>
        </div>

        {mockEntries.map((entry) => (
          <Card key={entry.id} className="card-elegant p-4 cursor-pointer hover:bg-card/70 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">{entry.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">{entry.date}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entry.preview}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Journal;