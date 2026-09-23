import type { Collection } from './collections'
import MarkdownEditor from '@/components/MarkdownEditor'

const inputCls = 'w-full px-4 py-2 rounded-lg border border-gray-300 bg-transparent text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'

const toDateInput = (d: unknown) => d ? new Date(d as string).toISOString().slice(0, 10) : ''

export default function ItemForm({ collection, item, action }: {
    collection: Collection
    item?: Record<string, any> | null
    action: (formData: FormData) => Promise<void>
}) {
    return (
        <form action={action} className="space-y-6 bg-white text-gray-900 p-4 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
            {collection.fields.map(f => (
                <div key={f.name}>
                    {f.type === 'checkbox' ? (
                        <label className="flex items-center gap-3 text-sm font-medium">
                            <input type="checkbox" name={f.name} defaultChecked={item ? !!item[f.name] : true} className="w-4 h-4" />
                            {f.label}
                        </label>
                    ) : (
                        <label className="block text-sm font-medium mb-2" htmlFor={f.name}>
                            {f.label}{f.required && <span className="text-red-500"> *</span>}
                        </label>
                    )}

                    {f.type === 'textarea' && (
                        <textarea id={f.name} name={f.name} rows={5} required={f.required} defaultValue={item?.[f.name] ?? ''} className={inputCls} placeholder={f.placeholder} />
                    )}
                    {f.type === 'markdown' && <MarkdownEditor name={f.name} size={f.size ?? 'full'} required={f.required} initialValue={item?.[f.name] ?? ''} />}
                    {(f.type === 'text' || f.type === 'url') && (
                        <input id={f.name} name={f.name} type={f.type === 'url' ? 'url' : 'text'} required={f.required} defaultValue={item?.[f.name] ?? ''} className={inputCls} placeholder={f.placeholder} />
                    )}
                    {f.type === 'number' && (
                        <input id={f.name} name={f.name} type="number" defaultValue={item?.[f.name] ?? 0} className={`${inputCls} max-w-40`} />
                    )}
                    {f.type === 'date' && (
                        <input id={f.name} name={f.name} type="date" required={f.required} defaultValue={toDateInput(item?.[f.name])} className={`${inputCls} max-w-60`} />
                    )}
                    {f.type === 'image' && (
                        <div className="flex flex-wrap items-center gap-4">
                            {item?.[f.name] && <img src={item[f.name]} alt="" className="w-16 h-16 object-cover rounded-lg border" />}
                            <input id={f.name} name={f.name} type="file" accept="image/*" className="min-w-0 max-w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700" />
                            {item?.[f.name] && (
                                <label className="flex items-center gap-2 text-xs text-red-600"><input type="checkbox" name={`${f.name}__remove`} /> Remove</label>
                            )}
                        </div>
                    )}
                    {f.help && <p className="text-xs text-gray-500 mt-1">{f.help}</p>}
                </div>
            ))}

            <div className="flex justify-end gap-4 pt-4">
                <a href={`/admin/content/${collection.slug}`} className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</a>
                <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">Save {collection.singular}</button>
            </div>
        </form>
    )
}
