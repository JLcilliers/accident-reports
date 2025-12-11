// Blog posts data configuration
// Add new posts here - they will automatically appear on the blog listing page

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
  };
  category: string;
  tags: string[];
  readingTime: string;
  featured: boolean;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "us-vehicle-accident-statistics",
    title: "United States Vehicle Accident Statistics, Causes, and Prevention",
    description: "Fresh United States car accident statistics, causes, and safety tips. Explore 2023 crash data, high-risk groups, and evidence-based prevention strategies.",
    excerpt: "Every day in the United States, road crashes change lives in an instant. In 2023 alone, federal crash data record 40,901 people killed and about 2.44 million people injured in police-reported motor vehicle traffic crashes.",
    publishedAt: "2025-12-11",
    updatedAt: "2025-12-11",
    author: {
      name: "AccidentLookup Research Team",
      role: "Safety & Statistics Division"
    },
    category: "Statistics & Research",
    tags: ["accident statistics", "traffic safety", "prevention", "NHTSA data", "crash data"],
    readingTime: "25 min read",
    featured: true,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}
