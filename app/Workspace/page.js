"use client"

import { useAuth } from "@/components/AuthProvider"
import SignIn from "@/components/SignIn"
import SignOut from "@/components/SignOut"
import Sidebar from "@/components/Sidebar"
import Editor from "@/components/Editor"
import { useState } from "react"

export default function Home() {
  const { user } = useAuth()
  const [activeNoteId, setActiveNoteId] = useState("new")
  const [isCollaborative, setIsCollaborative] = useState(false)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SignIn />
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar onNoteSelect={(id) => setActiveNoteId(id)} />
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Welcome to Your Advanced Notion Clone</h1>
          <SignOut />
        </div>
      </div>
    </div>
  )
}

