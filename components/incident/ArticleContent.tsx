/**
 * ArticleContent - Styled wrapper for ReactMarkdown article content
 * Applies consistent typography and spacing to the 12-section article format
 */

import ReactMarkdown from "react-markdown";

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className = "" }: ArticleContentProps) {
  return (
    <article
      className={`prose prose-slate max-w-none
        prose-headings:font-semibold prose-headings:text-slate-900
        prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
        prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-[15px]
        prose-li:text-slate-700 prose-li:text-[15px]
        prose-strong:text-slate-900 prose-strong:font-semibold
        prose-a:text-[var(--primary)] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
        prose-ul:my-3 prose-ol:my-3
        prose-blockquote:border-l-[var(--primary)] prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
        ${className}`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
