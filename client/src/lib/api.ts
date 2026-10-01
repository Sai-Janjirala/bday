export interface LoveNote {
  id?: string;
  name?: string;
  message: string;
  createdAt?: string;
}

export interface CapsuleNote {
  body: string;
  sealedAt: string;
}

const STORAGE_KEY = "birthday_love_notes";
const CAPSULE_KEY = "birthday_capsule_note";

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

/* ─────────────────────────────────────────────────────────────
   Everything below is local-only too. There is no backend in
   this project, so anything she writes or claims lives in her
   own browser and nowhere else.
   ───────────────────────────────────────────────────────────── */

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Seal a note to her future self. Returns false if storage refused. */
export function saveCapsuleNote(body: string): boolean {
  return writeJson(CAPSULE_KEY, {
    body,
    sealedAt: new Date().toISOString(),
  } satisfies CapsuleNote);
}

export function getCapsuleNote(): CapsuleNote | null {
  const value = readJson<CapsuleNote | null>(CAPSULE_KEY, null);
  if (!value || typeof value.body !== "string") return null;
  return value;
}

export function clearCapsuleNote(): void {
  try {
    localStorage.removeItem(CAPSULE_KEY);
  } catch {
    /* nothing to do */
  }
}
