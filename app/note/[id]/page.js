"use client"

import { use } from "react"
import { useAuth } from "@/components/AuthProvider"
import SignIn from "@/components/SignIn"
import SignOut from "@/components/SignOut"
import Sidebar from "@/components/Sidebar"
import Editor from "@/components/Editor"
import CollaborativeEditor from "@/components/CollaborativeEditor"
import { useState } from "react"

export default function NotePage({ params }) {
  const { user } = useAuth()
  const { id } = use(params)
  const [isCollaborative, setIsCollaborative] = useState(false)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SignIn />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Note Editor</h1>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isCollaborative}
                    onChange={() => setIsCollaborative(!isCollaborative)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Collaborative Mode</span>
                </label>
                <SignOut />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isCollaborative ? <CollaborativeEditor noteId={id} /> : <Editor noteId={id} />}
        </div>
      </div>
    </div>
  )
}

