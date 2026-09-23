import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy', robots: { index: false } }

export default function Privacy() {
    return (
        <div className="min-h-screen px-4 sm:px-10 lg:px-20 pb-12 pt-20 sm:pt-24 max-w-3xl mx-auto font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-8 text-gray-100">Privacy</h1>
            <div className="prose prose-invert max-w-none prose-a:text-blue-400 text-gray-300">
                <p>This is a personal portfolio. It does not use advertising or third-party analytics.</p>
                <h3>What is recorded</h3>
                <ul>
                    <li><strong>Contact form:</strong> the name, email and message you send, so I can reply.</li>
                    <li>
                        <strong>CV downloads and visits via links I share:</strong> the time, your IP address and the
                        network/approximate location it belongs to, browser type, and the site that referred you.
                        This helps me follow up with the people I have applied to.
                    </li>
                    <li>
                        <strong>Two first-party cookies</strong> remember which link you arrived from, for up to 90 days.
                        They are not shared with anyone.
                    </li>
                </ul>
                <h3>Spam protection</h3>
                <p>
                    Forms and the CV download are protected by reCAPTCHA. The Google{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
                </p>
                <h3>Your choice</h3>
                <p>To have your data removed, use the contact form and I will delete it.</p>
            </div>
        </div>
    )
}
