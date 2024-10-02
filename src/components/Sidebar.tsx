import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Trash2 } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  language: string;
}

interface SidebarProps {
  notes: Note[];
  currentNote: Note | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (note: Note) => void;
  onNewNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  currentNote,
  searchTerm,
  onSearchChange,
  onNoteSelect,
  onNoteDelete,
  onNewNote,
}) => {
  return (
    <div className="w-1/5 bg-gray-800 p-4 border-r border-gray-700 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">eXNote</h1>
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-700 border-gray-600"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-grow overflow-y-auto space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="flex items-center">
            <Button
              variant={note.id === currentNote?.id ? "default" : "ghost"}
              className={`flex-grow justify-start text-left ${
                note.id === currentNote?.id ? "bg-blue-600" : ""
              }`}
              onClick={() => onNoteSelect(note)}
            >
              {note.title}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNoteDelete(note)}
              className="ml-2 text-red-500 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        onClick={onNewNote}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
      >
        <FileText className="mr-2 h-4 w-4" /> New Note
      </Button>
    </div>
  );
};

export default Sidebar;
