import { prisma } from '@/lib/prisma'
import { deleteMessage, markMessageRead } from '../actions'
import { Trash2, Mail, MailOpen, Calendar } from 'lucide-react'
import { Message } from '@prisma/client'

export default async function AdminMessages() {
    // Cast prisma to any to avoid type errors until client is regenerated
    const messages = await (prisma as any).message.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Messages ({messages.length})</h1>

            {messages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <Mail className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-lg">No messages yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg: Message) => (
                        <div key={msg.id} className={`p-6 rounded-xl border transition-all ${msg.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200 shadow-sm border-l-4 border-l-blue-500'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-gray-900">{msg.name}</h3>
                                        {!msg.read && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">NEW</span>}
                                    </div>
                                    <a href={`mailto:${msg.email}`} className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                                        <Mail size={12} /> {msg.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <form action={async () => {
                                        'use server'
                                        await markMessageRead(msg.id)
                                    }}>
                                        <button title={msg.read ? "Mark as Unread" : "Mark as Read"} className={`p-2 rounded-lg hover:bg-gray-100 ${msg.read ? 'text-gray-400' : 'text-blue-600'}`}>
                                            <MailOpen size={18} />
                                        </button>
                                    </form>
                                    <form action={async () => {
                                        'use server'
                                        await deleteMessage(msg.id)
                                    }}>
                                        <button title="Delete" className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100 font-mono text-sm">
                                {msg.content}
                            </div>

                            <div className="mt-4 flex items-center text-xs text-gray-400">
                                <Calendar size={12} className="mr-1" />
                                {new Date(msg.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
