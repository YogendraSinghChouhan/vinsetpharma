import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminPageHeader } from "@/features/admin-shell/components/admin-page-header";
import { PostForm } from "@/features/blogs/components/post-form";
import { PostFormSkeleton } from "@/features/blogs/components/post-form-skeleton";
import { getPostById } from "@/features/blogs/data";
import { postIdSchema } from "@/features/blogs/validation";

export const metadata: Metadata = {
  title: "Edit Post | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

async function EditBlogContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = postIdSchema.safeParse(id);
  if (!parsed.success) {
    notFound();
  }

  const post = await getPostById(parsed.data);
  if (!post) {
    notFound();
  }

  return <PostForm post={post} />;
}

export default function AdminEditBlogPage({ params }: EditBlogPageProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="Edit Post"
        description="Update article contents, cover imagery, and SEO metadata."
      />
      <Suspense fallback={<PostFormSkeleton />}>
        <EditBlogContent params={params} />
      </Suspense>
    </div>
  );
}
