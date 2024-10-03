import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Save, Copy, Check, File } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";
import Sidebar from "./Sidebar"; // Make sure to import the Sidebar component

const languageMap = {
  plaintext: [],
  javascript: [javascript()],
  python: [python()],
  html: [html()],
  css: [css()],
  json: [json()],
};

interface Note {
  id: number;
  title: string;
  content: string;
  language: string;
}

const Notepad: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setCurrentNote(parsedNotes[0]);
      }
    }
  }, []);

  const saveToLocalStorage = useCallback((updatedNotes: Note[]) => {
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  }, []);

  const createNewNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled",
      content: "",
      language: "plaintext",
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setCurrentNote(newNote);
    saveToLocalStorage(updatedNotes);
  }, [notes, saveToLocalStorage]);

  const saveNote = useCallback(() => {
    if (currentNote) {
      const updatedNotes = notes.map((note) =>
        note.id === currentNote.id ? currentNote : note
      );
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
      toast({
        title: "Note Saved",
        description: "Your note has been successfully saved.",
      });
    }
  }, [currentNote, notes, saveToLocalStorage, toast]);

  const updateCurrentNote = useCallback(
    (field: keyof Note, value: string) => {
      if (currentNote) {
        const updatedNote = { ...currentNote, [field]: value };
        setCurrentNote(updatedNote);
        const updatedNotes = notes.map((note) =>
          note.id === currentNote.id ? updatedNote : note
        );
        setNotes(updatedNotes);
        saveToLocalStorage(updatedNotes);
      }
    },
    [currentNote, notes, saveToLocalStorage]
  );

  const handleEditorChange = useCallback(
    (value: string) => {
      updateCurrentNote("content", value);
    },
    [updateCurrentNote]
  );

  const copyContent = useCallback(() => {
    if (currentNote) {
      navigator.clipboard.writeText(currentNote.content).then(() => {
        setIsCopied(true);
        toast({
          title: "Content Copied",
          description: "The note content has been copied to your clipboard.",
        });
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  }, [currentNote, toast]);

  const deleteNote = useCallback((note: Note) => {
    setNoteToDelete(note);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (noteToDelete) {
      const updatedNotes = notes.filter((note) => note.id !== noteToDelete.id);
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
      if (currentNote && currentNote.id === noteToDelete.id) {
        setCurrentNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      }
      toast({
        title: "Note Deleted",
        description: "Your note has been successfully deleted.",
      });
    }
    setIsDeleteDialogOpen(false);
    setNoteToDelete(null);
  }, [noteToDelete, notes, currentNote, saveToLocalStorage, toast]);

  const handleNoteTitleChange = useCallback(
    (noteId: number, newTitle: string) => {
      const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, title: newTitle } : note
      );
      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
      if (currentNote && currentNote.id === noteId) {
        setCurrentNote({ ...currentNote, title: newTitle });
      }
    },
    [notes, currentNote, saveToLocalStorage]
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar
        notes={notes}
        currentNote={currentNote}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNoteSelect={setCurrentNote}
        onNoteDelete={deleteNote}
        onNewNote={createNewNote}
        onNoteTitleChange={handleNoteTitleChange}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentNote ? (
          <>
            <div className="p-2 bg-gray-800 flex justify-between items-center">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <File className="h-5 w-5 flex-shrink-0" />
                {currentNote.title}
              </h2>
              <Select
                value={currentNote.language}
                onValueChange={(value) => updateCurrentNote("language", value)}
              >
                <SelectTrigger className="w-[140px] bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plaintext">Plain Text</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <CodeMirror
                value={currentNote.content}
                height="100%"
                theme={dracula}
                extensions={
                  languageMap[currentNote.language as keyof typeof languageMap]
                }
                onChange={handleEditorChange}
                className="h-full overflow-auto"
              />
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button
                  onClick={saveNote}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  onClick={copyContent}
                  className="bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a note or create a new one
          </div>
        )}
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this note?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notepad;
