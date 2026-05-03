'use client'

export default function ShowcasePage() {
    return (
        <div className="min-h-screen bg-black pt-20 flex flex-col">
            <div className="flex-1 w-full h-full p-4 sm:p-8">
                <iframe
                    src="https://example.com"
                    className="w-full h-[85vh] rounded-2xl border border-gray-800 shadow-2xl"
                    title="External Showcase"
                    style={{ backgroundColor: 'white' }}
                />
            </div>
        </div>
    )
}
