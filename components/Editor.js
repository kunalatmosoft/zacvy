"use client"

import { useState, useEffect } from "react"
import MarkdownIt from "markdown-it"
import MdEditor from "react-markdown-editor-lite"
import "react-markdown-editor-lite/lib/index.css"
import { useAuth } from "@/components/AuthProvider"
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { formatDate } from "@/lib/utils"
import {
  Clock,
  List,
  Save,
  Tags,
  Trash2,
  Smile,
  X,
  AlertTriangle,
  Check,
  Loader,
  ChevronDown,
  Plus,
  FileText,
  ImageIcon,
  Table,
  Code,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import EmojiPicker from "emoji-picker-react"
import TableOfContents from "./TableOfContents"

// Initialize markdown parser
const mdParser = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
})

export default function Editor({ noteId = "new", onNoteDeleted }) {
  const { user } = useAuth()
  const [note, setNote] = useState({
    title: "",
    content: "",
    tags: [],
    blocks: [],
    updatedAt: new Date().toISOString(),
    userId: user?.uid || "",
  })
  const [newTag, setNewTag] = useState("")
  const [showToc, setShowToc] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showModal, setShowModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showBlockMenu, setShowBlockMenu] = useState(false)

  useEffect(() => {
    const fetchNote = async () => {
      if (user && noteId !== "new") {
        try {
          const noteDoc = await getDoc(doc(db, "notes", noteId))
          if (noteDoc.exists()) {
            setNote(noteDoc.data())
          }
        } catch (error) {
          showNotification("Error", "Failed to load note", "error")
        }
      }
    }
    fetchNote()
  }, [user, noteId])

  const showNotification = (title, message, type = "info") => {
    setShowModal({
      title,
      message,
      type,
      onClose: () => setShowModal(null),
    })

    if (type !== "error") {
      setTimeout(() => setShowModal(null), 3000)
    }
  }

  const handleEditorChange = ({ text }) => {
    setNote((prev) => ({ ...prev, content: text }))
  }

  const saveNote = async () => {
    if (!user) return
    setSaving(true)
    try {
      const timestamp = new Date().toISOString()
      const docId = noteId === "new" ? Date.now().toString() : noteId
      await setDoc(
        doc(db, "notes", docId),
        {
          ...note,
          updatedAt: timestamp,
          userId: user.uid,
        },
        { merge: true },
      )
      setNote((prev) => ({ ...prev, updatedAt: timestamp }))
      showNotification("Success", "Note saved successfully", "success")
    } catch (error) {
      showNotification("Error", "Failed to save note", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteNote = () => {
    setShowModal({
      title: "Delete Note",
      message: "Are you sure you want to delete this note? This action cannot be undone.",
      type: "warning",
      showConfirm: true,
      onConfirm: confirmDeleteNote,
      onClose: () => setShowModal(null),
    })
  }

  const confirmDeleteNote = async () => {
    try {
      await deleteDoc(doc(db, "notes", noteId))
      showNotification("Success", "Note deleted successfully", "success")
      if (onNoteDeleted) {
        onNoteDeleted()
      }
    } catch (error) {
      showNotification("Error", "Failed to delete note", "error")
    }
  }

  const addTag = () => {
    if (newTag && !note.tags.includes(newTag)) {
      setNote((prev) => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setNote((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleEmojiClick = (emojiData) => {
    const editor = document.querySelector(".rc-md-editor textarea")
    if (editor) {
      const start = editor.selectionStart
      const end = editor.selectionEnd
      const text = note.content
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end)
      setNote((prev) => ({ ...prev, content: newText }))

      // Restore cursor position after emoji insertion
      setTimeout(() => {
        editor.selectionStart = editor.selectionEnd = start + emojiData.emoji.length
        editor.focus()
      }, 0)
    }
    setShowEmojiPicker(false)
  }

  const addBlock = (type) => {
    const newBlock = { id: Date.now(), type, content: "" }
    setNote((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }))
    setShowBlockMenu(false)
  }

  const updateBlock = (id, content) => {
    setNote((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => (block.id === id ? { ...block, content } : block)),
    }))
  }

  const removeBlock = (id) => {
    setNote((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id),
    }))
  }

  const moveBlock = (id, direction) => {
    const blocks = note.blocks || []
    const index = blocks.findIndex((block) => block.id === id)
    if ((direction === "up" && index > 0) || (direction === "down" && index < blocks.length - 1)) {
      const newBlocks = [...blocks]
      const [movedBlock] = newBlocks.splice(index, 1)
      newBlocks.splice(direction === "up" ? index - 1 : index + 1, 0, movedBlock)
      setNote((prev) => ({ ...prev, blocks: newBlocks }))
    }
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "text":
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Type your text here..."
          />
        )
      case "image":
        return (
          <div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter image URL"
            />
            {block.content && (
              <img src={block.content || "/placeholder.svg"} alt="Block content" className="mt-2 max-w-full h-auto" />
            )}
          </div>
        )
      case "table":
        return (
          <div>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter table data (CSV format)"
            />
            {block.content && (
              <table className="mt-2 w-full border-collapse border border-gray-300">
                <tbody>
                  {block.content.split("\n").map((row, i) => (
                    <tr key={i}>
                      {row.split(",").map((cell, j) => (
                        <td key={j} className="border border-gray-300 p-2">
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )
      case "code":
        return (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            className="w-full p-2 border rounded font-mono"
            placeholder="Enter your code here..."
          />
        )
      default:
        return null
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Please sign in to access notes.</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <input
            type="text"
            value={note.title}
            onChange={(e) => setNote((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Note title"
            className="w-full sm:w-auto p-3 text-2xl font-bold border-b focus:border-blue-500 focus:outline-none"
          />
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1" />
              Last saved: {formatDate(note.updatedAt)}
            </div>
            <button
              onClick={() => setShowToc(!showToc)}
              className="p-2 rounded hover:bg-gray-100"
              title="Toggle Table of Contents"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded hover:bg-gray-100 relative"
              title="Insert Emoji"
            >
              <Smile size={20} />
              {showEmojiPicker && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <div className="bg-white rounded-lg shadow-xl border">
                    <div className="flex justify-between items-center p-2 border-b">
                      <span className="font-medium">Pick an emoji</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowEmojiPicker(false)
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <EmojiPicker onEmojiClick={handleEmojiClick} width={320} height={400} />
                  </div>
                </div>
              )}
            </button>
            <button
              onClick={handleDeleteNote}
              className="p-2 rounded hover:bg-red-100 text-red-500"
              title="Delete Note"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="relative mb-6">
          <MdEditor
            value={note.content}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            className="h-[300px] border rounded-lg"
            view={{ menu: true, md: true, html: true }}
          />
        </div>

        {/* Blocks */}

     

        {/* Tags */}
        <div className="mt-4 flex items-center gap-2">
          <Tags size={20} className="text-gray-500" />
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTag()}
            placeholder="Add a tag"
            className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
          />
          <button onClick={addTag} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Tag
          </button>
        </div>

        {/* Tag List */}
        <div className="mt-2 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
              #{tag}
              <button onClick={() => removeTag(tag)} className="ml-2 text-gray-500 hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={saveNote}
            disabled={saving}
            className={`px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2 ${
              saving ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              {showModal.type === "success" && <Check className="text-green-500" size={24} />}
              {showModal.type === "error" && <AlertTriangle className="text-red-500" size={24} />}
              {showModal.type === "warning" && <AlertTriangle className="text-yellow-500" size={24} />}
              <h3 className="text-lg font-semibold">{showModal.title}</h3>
            </div>
            <p className="text-gray-600 mb-6">{showModal.message}</p>
            <div className="flex justify-end gap-2">
              {showModal.showConfirm && (
                <>
                  <button
                    onClick={() => setShowModal(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      showModal.onConfirm()
                      setShowModal(null)
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
              {!showModal.showConfirm && (
                <button
                  onClick={() => setShowModal(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      {showToc && (
        <div className="fixed right-4 top-20 w-64 bg-white rounded-lg shadow-lg p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <TableOfContents content={note.content} />
        </div>
      )}
    </div>
  )
}



/* "use client"


import { useState, useEffect } from "react"
import { useAuth } from "./AuthProvider"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { lowlight } from "lowlight"
import EmojiPicker from "emoji-picker-react"
import { formatDate, deleteNote } from "../lib/utils"
import TableOfContents from "./TableOfContents"
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LinkIcon,
  Highlighter,
  CheckSquare,
  Code,
  Table2,
  Smile,
  Trash2,
  Clock,
  Save,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function Editor({ noteId }) {
  const router = useRouter()
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [showToc, setShowToc] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-500 hover:underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
/*       CodeBlockLowlight.configure({
        lowlight,
      }), 
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
  })

  useEffect(() => {
    if (user && noteId && noteId !== "new" && editor) {
      const fetchNote = async () => {
        const noteDoc = await getDoc(doc(db, "notes", noteId))
        if (noteDoc.exists()) {
          const noteData = noteDoc.data()
          setTitle(noteData.title || "")
          editor.commands.setContent(noteData.content || "")
          setTags(noteData.tags || [])
          setLastSaved(noteData.updatedAt)
        }
      }
      fetchNote()
    }
  }, [user, noteId, editor])

  const saveNote = async () => {
    if (user && editor) {
      const noteRef = doc(db, "notes", noteId === "new" ? Date.now().toString() : noteId)
      const timestamp = new Date().toISOString()
      await setDoc(
        noteRef,
        {
          title,
          content: editor.getHTML(),
          tags,
          userId: user.uid,
          updatedAt: timestamp,
        },
        { merge: true },
      )
      setLastSaved(timestamp)
    }
  }

  const handleDeleteNote = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      const success = await deleteNote(noteId)
      if (success) {
        router.push("/")
      }
    }
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const onEmojiClick = (emojiObject) => {
    editor.chain().focus().insertContent(emojiObject.emoji).run()
    setShowEmojiPicker(false)
  }

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full p-3 text-2xl font-bold border-b focus:border-blue-500 focus:outline-none"
          />
          <div className="flex items-center gap-4">
            {lastSaved && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" />
                Last saved: {formatDate(lastSaved)}
              </div>
            )}
            <button
              onClick={() => setShowToc(!showToc)}
              className="p-2 rounded hover:bg-gray-100"
              title="Toggle Table of Contents"
            >
              <List size={20} />
            </button>
            <button
              onClick={handleDeleteNote}
              className="p-2 rounded hover:bg-red-100 text-red-500"
              title="Delete Note"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="mb-6 border rounded-lg">
          <div className="flex flex-wrap gap-2 border-b p-3 bg-gray-50">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
              title="Bold"
            >
              <Bold size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
              title="Italic"
            >
              <Italic size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
              title="Heading 1"
            >
              <Heading1 size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
              title="Heading 2"
            >
              <Heading2 size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
              title="Bullet List"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
              title="Align Left"
            >
              <AlignLeft size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
              title="Align Center"
            >
              <AlignCenter size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
              title="Align Right"
            >
              <AlignRight size={20} />
            </button>
            <button
              onClick={() => setShowLinkInput(!showLinkInput)}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200" : ""}`}
              title="Add Link"
            >
              <LinkIcon size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("highlight") ? "bg-gray-200" : ""}`}
              title="Highlight"
            >
              <Highlighter size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("taskList") ? "bg-gray-200" : ""}`}
              title="Task List"
            >
              <CheckSquare size={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-200" : ""}`}
              title="Code Block"
            >
              <Code size={20} />
            </button>
            <button onClick={insertTable} className="p-2 rounded hover:bg-gray-200" title="Insert Table">
              <Table2 size={20} />
            </button>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded hover:bg-gray-200"
              title="Insert Emoji"
            >
              <Smile size={20} />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute z-10">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
          {showLinkInput && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 border-b">
              <input
                type="url"
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button onClick={setLink} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Link
              </button>
            </div>
          )}
          <EditorContent editor={editor} className="p-4 min-h-[300px] prose max-w-none" />
        </div>
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 p-2 border rounded focus:border-blue-500 focus:outline-none"
            />
            <button onClick={addTag} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add Tag
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags &&
              tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="ml-2 text-gray-500 hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={saveNote}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            Save Note
          </button>
        </div>
      </div>
      {showToc && <TableOfContents editor={editor} />}
    </div>
  )
}

 */