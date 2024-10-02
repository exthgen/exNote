import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Trash2, Edit2 } from "lucide-react";

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
  onNoteTitleChange: (noteId: number, newTitle: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  currentNote,
  searchTerm,
  onSearchChange,
  onNoteSelect,
  onNoteDelete,
  onNewNote,
  onNoteTitleChange,
}) => {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const startEditing = (noteId: number) => {
    setEditingNoteId(noteId);
  };

  const finishEditing = (noteId: number, newTitle: string) => {
    onNoteTitleChange(noteId, newTitle);
    setEditingNoteId(null);
  };

  return (
    <div className="w-64 bg-gray-800 p-2 border-r border-gray-700 flex flex-col h-screen">
      <h1 className="text-xl font-bold mb-4 mt-2 px-2 text-white">eXNote</h1>
      <div className="mb-3 relative px-2">
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-7 py-1 h-7 bg-gray-700 border-gray-600 text-xs"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
      </div>
      <div className="flex-grow overflow-y-auto space-y-1 px-2">
        {notes.map((note) => (
          <div key={note.id} className="flex items-center">
            {editingNoteId === note.id ? (
              <Input
                type="text"
                defaultValue={note.title}
                onBlur={(e) => finishEditing(note.id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    finishEditing(note.id, e.currentTarget.value);
                  }
                }}
                autoFocus
                className="flex-grow mr-1 h-7 bg-gray-700 border-gray-600 text-xs"
              />
            ) : (
              <Button
                variant={note.id === currentNote?.id ? "default" : "ghost"}
                className={`flex-grow justify-start text-left py-1 px-2 text-sm ${
                  note.id === currentNote?.id ? "bg-gray-700" : ""
                }`}
                onClick={() => onNoteSelect(note)}
              >
                {note.title}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditing(note.id)}
              className="ml-1 text-blue-500 hover:text-blue-400 p-1"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNoteDelete(note)}
              className="ml-1 text-red-500 hover:text-red-400 p-1"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="px-2">
        <Button
          onClick={onNewNote}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 py-1 text-sm"
        >
          <FileText className="mr-1 h-3 w-3" /> New Note
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;