/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Third-party Libraries
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


/////////////////////////////
///    TYPE DEFINITION    ///
/////////////////////////////
type MarkdownContentProps = {
    content: string
}


/////////////////////////////
///   COMPONENT SECTION   ///
/////////////////////////////
export default function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <div className="max-w-none space-y-4">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({node, ...props}) => <h1 className="mb-4 mt-8 text-3xl font-bold text-text-primary" {...props} />,
                    h2: ({node, ...props}) => <h2 className="mb-4 mt-8 text-2xl font-semibold text-text-primary" {...props} />,
                    h3: ({node, ...props}) => <h3 className="mb-3 mt-6 text-xl font-semibold text-text-primary" {...props} />,
                    h4: ({node, ...props}) => <h4 className="mb-2 mt-4 text-lg font-semibold text-text-primary" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-base leading-7 text-text-secondary" {...props} />,
                    ul: ({node, ...props}) => <ul className="mb-4 ml-6 list-disc space-y-2 text-text-secondary" {...props} />,
                    ol: ({node, ...props}) => <ol className="mb-4 ml-6 list-decimal space-y-2 text-text-secondary" {...props} />,
                    li: ({node, ...props}) => <li className="text-base leading-7" {...props} />,
                    a: ({node, ...props}) => <a className="text-primary underline hover:text-primary-hover" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-text-primary" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-text-secondary" {...props} />,
                    code: ({node, ...props}) => <code className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-sm text-text-primary" {...props} />,
                    pre: ({node, ...props}) => <pre className="mb-4 overflow-x-auto rounded-lg bg-surface-elevated p-4" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
