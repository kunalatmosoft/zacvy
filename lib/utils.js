import { db } from "./firebase"
import { doc, deleteDoc } from "firebase/firestore"

export async function deleteNote(noteId) {
  try {
    await deleteDoc(doc(db, "notes", noteId))
    return true
  } catch (error) {
    console.error("Error deleting note:", error)
    return false
  }
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

