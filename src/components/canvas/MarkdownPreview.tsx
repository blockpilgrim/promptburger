import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mb-4 text-text">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold mb-3 text-text">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-medium mb-2 text-text">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-text leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="text-text">{children}</li>,
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <code className="text-sm font-mono text-text">{children}</code>
      )
    }
    return (
      <code className="bg-surface px-1.5 py-0.5 rounded text-sm font-mono text-primary">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="bg-surface p-4 rounded-lg overflow-x-auto mb-3">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-border my-4" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-text">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-text">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-text-muted mb-3">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-primary underline hover:text-primary-hover"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-3">
      <table className="min-w-full border-collapse border border-border text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-surface px-3 py-2 text-left font-medium text-text">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2 text-text">{children}</td>
  ),
}

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
