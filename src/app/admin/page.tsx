
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        if (res.ok) {
            router.refresh()
            router.push('/admin/dashboard')
        } else {
            const data = await res.json()
            setError(data.message || 'Invalid credentials')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 font-[family-name:var(--font-geist-sans)]">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex justify-center mb-6 text-blue-600 dark:text-blue-500">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                        <Lock size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
                <p className="text-gray-500 text-center mb-8 text-sm">Access your content management dashboard</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            placeholder="Enter admin username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            placeholder="Enter admin password"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-95">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
