"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./AuthProvider"
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import Link from "next/link"

export default function NestedPages() {
  const { user } = useAuth()
  const [pages, setPages] = useState([])

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "pages"), where("userId", "==", user.uid))
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const pagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPages(pagesData)
      })

      return unsubscribe
    }
  }, [user])

  const handleDragStart = (e, pageId) => {
    e.dataTransfer.setData("text/plain", pageId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, targetId) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData("text")
    if (draggedId !== targetId) {
      const draggedPage = pages.find((p) => p.id === draggedId)
      await updateDoc(doc(db, "pages", draggedId), { parentId: targetId })
    }
  }

  const renderPages = (parentId = null) => {
    return pages
      .filter((page) => page.parentId === parentId)
      .map((page) => (
        <div key={page.id}>
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, page.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, page.id)}
            className="flex items-center mb-2"
          >
            <Link href={`/page/${page.id}`} className="text-blue-500 hover:underline">
              {page.title}
            </Link>
          </div>
          <div className="ml-4">{renderPages(page.id)}</div>
        </div>
      ))
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Pages</h3>
      {renderPages()}
    </div>
  )
}

