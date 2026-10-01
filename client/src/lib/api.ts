export interface LoveNote {
  id?: string;
  name?: string;
  message: string;
  createdAt?: string;
}

const STORAGE_KEY = "birthday_love_notes";

/** Save a love note purely in localStorage on client side */
export function saveLoveNote(note: Omit<LoveNote, "id" | "createdAt">): LoveNote {
  const notes = getLoveNotes();
  const newNote: LoveNote = {
    ...note,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  notes.unshift(newNote);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.warn("Could not save note to localStorage", err);
  }
  return newNote;
}

/** Get all love notes from localStorage */
export function getLoveNotes(): LoveNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
