import { notFound } from "next/navigation";
import axios from "axios";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

interface BlogPost {
  id: number;
  slug?: string;
  title: string;
  image: string | null;
  content: string;
  created_at: string;
}

async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.get(`${apiUrl}posts`);
    const posts: BlogPost[] = response.data;

    const found = posts.find((post) => post.slug === slug || String(post.id) === slug);
    return found || null;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL 
  const imageUrl = blog.image
    ? `${baseUrl}${blog.image}`
    : "/default-image.jpg";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 font-poppins">
      <img
        src={imageUrl}
        alt={blog.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(blog.created_at).toLocaleDateString()}
      </p>
      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
        {blog.content}
      </p>
    </div>
  );
}
