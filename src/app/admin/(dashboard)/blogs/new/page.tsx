import type { Metadata } from "next";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { PostForm } from "@/features/blogs/components/post-form";

export const metadata: Metadata = {
  title: "New Post | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminNewBlogPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="Add New Post"
        description="Draft a new article, news announcement, or pharmaceutical guide."
      />
      <PostForm />
    </div>
  );
}
