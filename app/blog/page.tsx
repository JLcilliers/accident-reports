import { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { BlogCard } from "@/components/blog";
import { getAllBlogPosts, getFeaturedPosts } from "@/data/blog-posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://accident-reports.vercel.app";

export const metadata: Metadata = {
  title: "Blog | AccidentLookup - Traffic Safety Insights & Statistics",
  description: "Explore in-depth articles on traffic safety, accident statistics, prevention strategies, and what to do after a crash. Expert insights backed by federal data.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | AccidentLookup - Traffic Safety Insights & Statistics",
    description: "Explore in-depth articles on traffic safety, accident statistics, prevention strategies, and what to do after a crash.",
    url: `${BASE_URL}/blog`,
    siteName: "AccidentLookup",
    type: "website",
  },
};

// JSON-LD for the blog listing
const blogListingJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "AccidentLookup Blog",
  description: "Traffic safety insights, accident statistics, and prevention strategies",
  url: `${BASE_URL}/blog`,
  publisher: {
    "@type": "Organization",
    name: "AccidentLookup",
    url: BASE_URL,
  },
};

export default function BlogPage() {
  const allPosts = getAllBlogPosts();
  const featuredPosts = getFeaturedPosts();
  const regularPosts = allPosts.filter(post => !post.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListingJsonLd) }}
      />
      <PageContainer>
        {/* Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
            <Link href="/" className="hover:text-[#2A7D6E] transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>
            <span className="text-neutral-900">Blog</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 mb-4 tracking-tight">
            Safety Insights & Resources
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed max-w-2xl">
            In-depth articles on traffic safety, accident statistics, and practical guidance
            for anyone affected by a vehicle crash. Data-driven insights you can trust.
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#E8F5F2] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-[#2A7D6E]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h2 className="text-lg font-medium text-neutral-900">Featured Article</h2>
            </div>
            <div className="space-y-6">
              {featuredPosts.map(post => (
                <BlogCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        {regularPosts.length > 0 && (
          <section>
            <h2 className="text-xl font-medium text-neutral-900 mb-6">All Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {allPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#E8F5F2] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#2A7D6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
              </svg>
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">No articles yet</h2>
            <p className="text-neutral-500">Check back soon for safety insights and resources.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <section className="mt-20 bg-neutral-900 rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight">
            Stay Informed on Traffic Safety
          </h2>
          <p className="text-neutral-300 mb-8 max-w-xl mx-auto">
            Get the latest accident statistics, safety tips, and resources delivered to your understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center bg-[#2A7D6E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#236859] transition-all"
            >
              Search Accident Records
            </Link>
            <Link
              href="/legal-help"
              className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all border border-neutral-700"
            >
              Get Legal Help
            </Link>
          </div>
        </section>
      </PageContainer>
    </>
  );
}
