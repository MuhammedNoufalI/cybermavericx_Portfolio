
'use client'

import { useRef, useState } from 'react'
import { Bold, Italic, Heading2, List, ListOrdered, Link2, Code, Quote } from 'lucide-react'
import Markdown from './Markdown'

interface MarkdownEditorProps {
    initialValue?: string
    name: string
    placeholder?: string
    required?: boolean
    // 'full' = side-by-side editor (bio, blog); 'compact' = shorter, for description fields
    size?: 'full' | 'compact'
}

type Wrap = { before: string; after?: string; placeholder: string; line?: boolean }

const ACTIONS: { key: string; label: string; icon: React.ReactNode; wrap: Wrap; shortcut?: string }[] = [
    { key: 'bold', label: 'Bold (Ctrl+B)', icon: <Bold size={16} />, wrap: { before: '**', after: '**', placeholder: 'bold text' }, shortcut: 'b' },
    { key: 'italic', label: 'Italic (Ctrl+I)', icon: <Italic size={16} />, wrap: { before: '_', after: '_', placeholder: 'italic text' }, shortcut: 'i' },
    { key: 'heading', label: 'Heading', icon: <Heading2 size={16} />, wrap: { before: '### ', placeholder: 'Heading', line: true } },
    { key: 'ul', label: 'Bullet list', icon: <List size={16} />, wrap: { before: '- ', placeholder: 'List item', line: true } },
    { key: 'ol', label: 'Numbered list', icon: <ListOrdered size={16} />, wrap: { before: '1. ', placeholder: 'List item', line: true } },
    { key: 'quote', label: 'Quote', icon: <Quote size={16} />, wrap: { before: '> ', placeholder: 'Quote', line: true } },
    { key: 'code', label: 'Inline code', icon: <Code size={16} />, wrap: { before: '`', after: '`', placeholder: 'code' } },
    { key: 'link', label: 'Link (Ctrl+K)', icon: <Link2 size={16} />, wrap: { before: '[', after: '](https://)', placeholder: 'link text' }, shortcut: 'k' },
]

export default function MarkdownEditor({ initialValue = '', name, placeholder, required, size = 'full' }: MarkdownEditorProps) {
    const [content, setContent] = useState(initialValue)
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
    const ref = useRef<HTMLTextAreaElement>(null)

    const apply = ({ before, after = '', placeholder, line }: Wrap) => {
        const ta = ref.current
        if (!ta) return
        const { selectionStart: s, selectionEnd: e, value } = ta
        let next: string, selStart: number, selEnd: number

        if (line) {
            // Prefix every selected line (or the current line)
            const lineStart = value.lastIndexOf('\n', s - 1) + 1
            const lineEndIdx = value.indexOf('\n', e)
            const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx
            const block = value.slice(lineStart, lineEnd) || placeholder
            const prefixed = block.split('\n').map((l, i) => {
                const p = before === '1. ' ? `${i + 1}. ` : before
                return l.startsWith(p) ? l.slice(p.length) : p + l // toggle
            }).join('\n')
            next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd)
            selStart = lineStart
            selEnd = lineStart + prefixed.length
        } else {
            const selected = value.slice(s, e) || placeholder
            next = value.slice(0, s) + before + selected + after + value.slice(e)
            selStart = s + before.length
            selEnd = selStart + selected.length
        }

        setContent(next)
        requestAnimationFrame(() => {
            ta.focus()
            ta.setSelectionRange(selStart, selEnd)
        })
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!(e.ctrlKey || e.metaKey)) return
        const action = ACTIONS.find(a => a.shortcut === e.key.toLowerCase())
        if (action) {
            e.preventDefault()
            apply(action.wrap)
        }
    }

    const tabCls = (tab: 'write' | 'preview') => `px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab
        ? 'bg-white border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'}`

    const compact = size === 'compact'

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 bg-gray-50">
                <div className="flex">
                    <button type="button" onClick={() => setActiveTab('write')} className={tabCls('write')}>Write</button>
                    <button type="button" onClick={() => setActiveTab('preview')} className={tabCls('preview')}>Preview</button>
                </div>
                <div className="flex items-center gap-0.5 px-2 py-1">
                    {ACTIONS.map(a => (
                        <button
                            key={a.key}
                            type="button"
                            title={a.label}
                            aria-label={a.label}
                            onMouseDown={e => e.preventDefault()} // keep textarea selection
                            onClick={() => { setActiveTab('write'); apply(a.wrap) }}
                            className="p-1.5 rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        >
                            {a.icon}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`p-4 grid grid-cols-1 ${compact ? 'lg:grid-cols-2 h-[340px]' : 'md:grid-cols-2 h-[600px]'} gap-6`}>
                {/* Write Pane */}
                <div className={`${activeTab === 'preview' ? `hidden ${compact ? 'lg:flex' : 'md:flex'}` : 'flex'} h-full flex-col`}>
                    <label className="text-xs font-semibold uppercase text-gray-400 mb-2">Markdown Input</label>
                    <textarea
                        ref={ref}
                        name={name}
                        value={content}
                        required={required}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        className="flex-1 w-full p-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono text-sm resize-none text-gray-900"
                    />
                </div>

                {/* Preview Pane — same renderer as the public site */}
                <div className={`${activeTab === 'write' ? `hidden ${compact ? 'lg:flex' : 'md:flex'}` : 'flex'} h-full flex-col`}>
                    <label className="text-xs font-semibold uppercase text-gray-400 mb-2">Live Preview</label>
                    <div className="flex-1 overflow-y-auto p-4 rounded-lg border border-gray-800 bg-[#120822]">
                        {content ? (
                            <Markdown className="text-gray-300 text-sm">{content}</Markdown>
                        ) : (
                            <p className="text-gray-500 italic text-sm">Nothing to preview yet...</p>
                        )}
                    </div>
                </div>
            </div>
            <p className="px-4 pb-3 text-xs text-gray-500">
                Select text and use the toolbar, or type Markdown. Each new line stays a new line on the site.
            </p>
        </div>
    )
}
