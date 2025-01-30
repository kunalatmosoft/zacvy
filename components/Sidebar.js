"use client"

import Link from "next/link"
import { useAuth } from "./AuthProvider"
import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"
import NestedPages from "./NestedPages"
import { Search, PlusCircle, Book } from "lucide-react"

export default function Sidebar() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "notes"), where("userId", "==", user.uid))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          tags: doc.data().tags || [],
        }))
        setNotes(notesData)
      })

      return unsubscribe
    }
  }, [user])

  const filteredNotes = notes.filter(
    (note) =>
      (note.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase">Notes</h2>
            <Link href="/note/new">
              <button className="p-1 hover:text-blue-400 transition-colors">
                <PlusCircle size={20} />
              </button>
            </Link>
          </div>
          <ul className="space-y-2">
            {filteredNotes.map((note) => (
              <li key={note.id}>
                <Link href={`/note/${note.id}`}>
                  <div className="p-2 rounded hover:bg-gray-800 transition-colors group">
                    <div className="flex items-center">
                      <Book size={16} className="mr-2 text-gray-500 group-hover:text-blue-400" />
                      <span className="text-sm font-medium">{note.title || "Untitled Note"}</span>
                    </div>
                    {note.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <span key={tag} className="text-xs text-gray-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t border-gray-800">
          <NestedPages />
        </div>
      </div>
    </div>
  )
}

