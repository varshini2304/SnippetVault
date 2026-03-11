'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CopyButton from './CopyButton'

interface CodeBlockProps {
  snippetId: string
  language: string
  code: string
}

export default function CodeBlock({ snippetId, language, code }: CodeBlockProps) {
  const lineCount = code.split('\n').length
  const charCount = code.length
  const rawHref = `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--syntax-bg)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span className="font-code">{language}</span>
        </div>
        <CopyButton snippetId={snippetId} code={code} />
      </div>
      <div className="max-h-none overflow-auto md:max-h-[400px]">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          showLineNumbers
          customStyle={{
            margin: 0,
            background: 'transparent',
            fontSize: '13px',
            padding: '16px',
            fontFamily: 'var(--font-code)',
          }}
          lineNumberStyle={{ color: 'var(--text-tertiary)', fontSize: '12px' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--text-tertiary)]">
        <span>
          {lineCount} lines · {charCount} chars
        </span>
        <a
          href={rawHref}
          className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          download={`snippet-${snippetId}.txt`}
        >
          View Raw
        </a>
      </div>
    </div>
  )
}
