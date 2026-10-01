import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LoveNote {
  _id?: string;
  name?: string;
  message: string;
  createdAt?: string;
}

/** Save a love note to the database */
export async function saveLoveNote(note: Omit<LoveNote, "_id" | "createdAt">) {
  const { data } = await api.post<LoveNote>("/notes", note);
  return data;
}

/** Get all love notes */
export async function getLoveNotes() {
  const { data } = await api.get<LoveNote[]>("/notes");
  return data;
}

export default api;
