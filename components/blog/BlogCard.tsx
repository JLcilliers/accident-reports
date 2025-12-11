import Link from "next/link";
import { BlogPost } from "@/data/blog-posts";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="block group">
        <article className="bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
          <div className="p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#E8F5F2] text-[#2A7D6E] text-xs font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-neutral-400 text-sm">{formattedDate}</span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-400 text-sm">{post.readingTime}</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-medium text-neutral-900 mb-4 group-hover:text-[#2A7D6E] transition-colors tracking-tight">
              {post.title}
            </h2>
            <p className="text-neutral-500 leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F5F2] rounded-full flex items-center justify-center">
                  <span className="text-[#2A7D6E] font-medium text-sm">
                    {post.author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-neutral-900 font-medium text-sm">{post.author.name}</p>
                  <p className="text-neutral-400 text-xs">{post.author.role}</p>
                </div>
              </div>
              <span className="text-[#2A7D6E] font-medium text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Read Article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="bg-white rounded-2xl p-6 border border-neutral-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-[#F7F7F7] text-neutral-600 text-xs font-medium px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-neutral-400 text-xs">{post.readingTime}</span>
        </div>
        <h3 className="text-lg font-medium text-neutral-900 mb-3 group-hover:text-[#2A7D6E] transition-colors tracking-tight line-clamp-2">
          {post.title}
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <span className="text-neutral-400 text-xs">{formattedDate}</span>
          <span className="text-[#2A7D6E] font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Read
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
