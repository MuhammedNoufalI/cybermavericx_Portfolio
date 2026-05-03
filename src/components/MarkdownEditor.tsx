
'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css' // Import highlight styles

interface MarkdownEditorProps {
    initialValue?: string
    name: string
    placeholder?: string
}

export default function MarkdownEditor({ initialValue = '', name, placeholder }: MarkdownEditorProps) {
    const [content, setContent] = useState(initialValue)
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'write'
                        ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Write
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'preview'
                        ? 'bg-white dark:bg-gray-800 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Preview
                </button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
                {/* Write Pane */}
                <div className={`${activeTab === 'preview' ? 'hidden md:block' : 'block'} h-full flex flex-col`}>
                    <label className="text-xs font-semibold uppercase text-gray-400 mb-2">Markdown Input</label>
                    <textarea
                        name={name}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono text-sm resize-none"
                    />
                </div>

                {/* Preview Pane */}
                <div className={`${activeTab === 'write' ? 'hidden md:block' : 'block'} h-full flex flex-col`}>
                    <label className="text-xs font-semibold uppercase text-gray-400 mb-2">Live Preview</label>
                    <div className="flex-1 overflow-y-auto p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 prose prose-sm dark:prose-invert max-w-none">
                        {content ? (
                            <ReactMarkdown rehypePlugins={[rehypeHighlight, rehypeRaw]}>{content}</ReactMarkdown>
                        ) : (
                            <p className="text-gray-400 italic">Nothing to preview yet...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
