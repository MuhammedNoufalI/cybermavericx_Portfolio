'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Type, Terminal, Hash, MoveUp, MoveDown } from 'lucide-react'

export type BlockType = 'paragraph' | 'subheading' | 'command'

export interface BlogBlock {
    id: string
    type: BlockType
    content: string
    level?: 2 | 3 | 4 // Only for subheadings
}

interface BlogContentBuilderProps {
    initialContent?: string | BlogBlock[] // JSON string or array
    name: string
}

export default function BlogContentBuilder({ initialContent, name }: BlogContentBuilderProps) {
    const [blocks, setBlocks] = useState<BlogBlock[]>([])

    useEffect(() => {
        if (!initialContent) return

        try {
            let parsed: any[] = []
            if (typeof initialContent === 'string') {
                // Heuristic check to avoid unnecessary throws
                if (initialContent.trim().startsWith('[') || initialContent.trim().startsWith('{')) {
                    try {
                        parsed = JSON.parse(initialContent)
                    } catch (e) {
                        // Fallback for malformed JSON
                        parsed = [{ id: 'legacy-1', type: 'paragraph', content: initialContent }]
                    }
                } else {
                    // Treat as legacy text
                    parsed = [{ id: 'legacy-1', type: 'paragraph', content: initialContent }]
                }
            } else {
                parsed = initialContent
            }

            if (Array.isArray(parsed)) {
                setBlocks(parsed)
            }
        } catch (e) {
            console.error("Failed to parse initial content", e)
            setBlocks([{ id: 'err-1', type: 'paragraph', content: typeof initialContent === 'string' ? initialContent : '' }])
        }
    }, [initialContent])

    const addBlock = (type: BlockType, level: 2 | 3 | 4 = 2) => {
        setBlocks([...blocks, { id: crypto.randomUUID(), type, content: '', level: type === 'subheading' ? level : undefined }])
    }

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id))
    }

    const updateBlock = (id: string, updates: Partial<BlogBlock>) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b))
    }

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks]
        if (direction === 'up' && index > 0) {
            [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]]
        } else if (direction === 'down' && index < newBlocks.length - 1) {
            [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
        }
        setBlocks(newBlocks)
    }

    return (
        <div className="space-y-4">
            <input type="hidden" name={name} value={JSON.stringify(blocks)} />

            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <div key={block.id} className="flex gap-2 items-start group">
                        <div className="flex flex-col gap-1 pt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30">
                                <MoveUp size={14} />
                            </button>
                            <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30">
                                <MoveDown size={14} />
                            </button>
                        </div>

                        <div className="flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase text-gray-400 justify-between">
                                <div className="flex items-center gap-2">
                                    {block.type === 'subheading' && <Hash size={14} />}
                                    {block.type === 'command' && <Terminal size={14} />}
                                    {block.type === 'paragraph' && <Type size={14} />}
                                    <span>{block.type} {block.level ? `(H${block.level})` : ''}</span>
                                </div>
                                {block.type === 'subheading' && (
                                    <div className="flex gap-1 bg-gray-200 dark:bg-gray-800 rounded p-0.5">
                                        {[2, 3, 4].map((lvl) => (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => updateBlock(block.id, { level: lvl as 2 | 3 | 4 })}
                                                className={`px-2 py-0.5 text-xs rounded ${block.level === lvl ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                                            >
                                                H{lvl}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {block.type === 'paragraph' && (
                                <textarea
                                    className="w-full p-2 bg-transparent outline-none resize-none min-h-[100px]"
                                    placeholder="Write your paragraph here..."
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                />
                            )}

                            {block.type === 'subheading' && (
                                <input
                                    type="text"
                                    className={`w-full p-2 bg-transparent outline-none font-bold ${block.level === 2 ? 'text-lg' : block.level === 3 ? 'text-base' : 'text-sm'}`}
                                    placeholder={`Heading ${block.level || 2}`}
                                    value={block.content}
                                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                />
                            )}

                            {block.type === 'command' && (
                                <div className="font-mono bg-black/80 text-green-400 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1 opacity-50 text-xs select-none">
                                        <span className="text-gray-500">$</span>
                                        <span>Terminal / Code</span>
                                    </div>
                                    <textarea
                                        className="w-full bg-transparent outline-none resize-none"
                                        rows={2}
                                        placeholder="npm install..."
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                        Add blocks to build your post
                    </div>
                )}
            </div>

            <div className="flex gap-2 justify-center pt-4 border-t border-gray-200 dark:border-gray-800">
                <button type="button" onClick={() => addBlock('subheading', 2)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium transition-colors">
                    <Hash size={16} /> Add Heading
                </button>
                <button type="button" onClick={() => addBlock('paragraph')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors">
                    <Type size={16} /> Add Paragraph
                </button>
                <button type="button" onClick={() => addBlock('command')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium transition-colors">
                    <Terminal size={16} /> Add Command
                </button>
            </div>
        </div>
    )
}
