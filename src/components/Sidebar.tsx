import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Trash2, Edit2, File } from "lucide-react";
import logo from "../assets/apple-touch-icon.png";

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

  const startEditing = (noteId: number): void => {
    setEditingNoteId(noteId);
  };

  const finishEditing = (noteId: number, newTitle: string): void => {
    onNoteTitleChange(noteId, newTitle);
    setEditingNoteId(null);
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-gray-900 p-4 border-r border-gray-800 flex flex-col h-screen">
      <h1 className="flex gap-2 text-2xl font-bold mb-6 text-white">
        <img className="w-10 rounded-sm" src={logo} />
        eXNote
      </h1>
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          className="pl-8 py-2 bg-gray-800 border-gray-700 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-grow overflow-y-auto space-y-2">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`group relative rounded-md transition-all duration-200 ${
              note.id === currentNote?.id
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {editingNoteId === note.id ? (
              <Input
                type="text"
                defaultValue={note.title}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                  finishEditing(note.id, e.target.value)
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    finishEditing(note.id, e.currentTarget.value);
                  }
                }}
                autoFocus
                className="w-full py-2 px-3 bg-gray-700 border-gray-600 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <button
                className="w-full text-left py-2 px-3 flex items-center space-x-2"
                onClick={() => onNoteSelect(note)}
              >
                <File className="h-4 w-4 flex-shrink-0" />
                <span className="flex-grow truncate">{note.title}</span>
              </button>
            )}
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEditing(note.id)}
                className="text-gray-400 hover:text-blue-400 p-1"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNoteDelete(note)}
                className="text-gray-400 hover:text-red-400 p-1"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={onNewNote}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-200"
      >
        <FileText className="mr-2 h-4 w-4" /> New Note
      </Button>
    </div>
  );
};

export default Sidebar;
