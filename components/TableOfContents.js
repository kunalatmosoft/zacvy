import { Link } from "lucide-react"

export default function TableOfContents({ content }) {
  const headings = content.match(/(#{1,6})\s+(.+)/g) || []

  const tocItems = headings.map((heading, index) => {
    const level = heading.match(/^#+/)[0].length
    const text = heading.replace(/^#+\s+/, "")
    const id = `heading-${index}`

    return { level, text, id }
  })

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Link size={18} className="mr-2" />
        Table of Contents
      </h3>
      <nav>
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block py-1 hover:text-blue-500 ${item.level === 1 ? "font-semibold" : `pl-${item.level * 2}`}`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  )
}

