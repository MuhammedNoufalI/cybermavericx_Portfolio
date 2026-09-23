import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import 'highlight.js/styles/github-dark.css'

// Shared renderer for CMS rich text, used by both the public site and the
// admin editor preview so they always look the same. Single newlines are
// kept as line breaks (remark-breaks), matching how content is typed.
export default function Markdown({ children, className = '' }: { children: string, className?: string }) {
    return (
        <div className={`prose prose-invert max-w-none leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:text-gray-100 prose-headings:mt-4 prose-headings:mb-2 prose-a:text-blue-400 prose-strong:text-white prose-code:text-pink-300 ${className}`}>
            <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>{children}</ReactMarkdown>
        </div>
    )
}
