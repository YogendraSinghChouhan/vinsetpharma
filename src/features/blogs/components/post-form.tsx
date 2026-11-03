"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ROUTES } from "@/config/site";
import { ImageUploader } from "@/features/storage/components/image-uploader";
import { cn } from "@/lib/utils";
import { createPost, updatePost } from "../actions";
import { POST_LIMITS } from "../constants";
import type { Post } from "../schema";
import { slugify } from "../slug";
import {
  createPostSchema,
  postContentSchema,
  postCoverImageKeySchema,
  postSeoDescriptionSchema,
  postSeoTitleSchema,
  postSlugSchema,
  postTitleSchema,
  updatePostSchema,
} from "../validation";
import { RichTextEditor } from "./rich-text-editor";

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(post);
  const isSlugLocked = Boolean(post?.publishedAt);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    Boolean(post?.slug),
  );

  const form = useForm({
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      content: post?.content ?? "",
      coverImageKey: post?.coverImageKey ?? "",
      seoTitle: post?.seoTitle ?? "",
      seoDescription: post?.seoDescription ?? "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);

      if (isEditMode && post) {
        const parseResult = updatePostSchema.safeParse({
          ...value,
          id: post.id,
        });

        if (!parseResult.success) {
          setFormError(
            parseResult.error.issues[0]?.message ?? "Please fix form errors.",
          );
          return;
        }

        setIsSubmitting(true);

        try {
          const res = await updatePost(parseResult.data);
          if (!res.success) {
            setFormError(res.error);
            setIsSubmitting(false);
            return;
          }

          toast.add({
            title: "Post updated",
            description: `"${res.data.title}" has been saved.`,
            type: "success",
          });

          router.push(ROUTES.adminBlogs);
          router.refresh();
        } catch {
          setFormError("An unexpected error occurred while saving the post.");
          setIsSubmitting(false);
        }
      } else {
        const parseResult = createPostSchema.safeParse(value);

        if (!parseResult.success) {
          setFormError(
            parseResult.error.issues[0]?.message ?? "Please fix form errors.",
          );
          return;
        }

        setIsSubmitting(true);

        try {
          const res = await createPost(parseResult.data);
          if (!res.success) {
            setFormError(res.error);
            setIsSubmitting(false);
            return;
          }

          toast.add({
            title: "Post created",
            description: `"${res.data.title}" has been created as a draft.`,
            type: "success",
          });

          router.push(ROUTES.adminBlogs);
          router.refresh();
        } catch {
          setFormError("An unexpected error occurred while creating the post.");
          setIsSubmitting(false);
        }
      }
    },
  });

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {isEditMode ? "Edit Blog Post" : "New Blog Post"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the article content, slug, cover image, and metadata."
            : "Compose a new pharmaceutical article or company update."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <FieldGroup>
            {/* Cover Image */}
            <form.Field
              name="coverImageKey"
              validators={{
                onBlur: ({ value }) => {
                  const res = postCoverImageKeySchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "post-cover-image-error";

                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Cover Image</FieldTitle>
                    </FieldLabel>
                    <ImageUploader
                      id={field.name}
                      purpose="blogs"
                      value={field.state.value || null}
                      onChange={(key) => field.handleChange(key ?? "")}
                      disabled={isSubmitting}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      aria-required="true"
                    />
                    {isInvalid ? (
                      <FieldError id={errorId}>{String(error)}</FieldError>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        Upload an article cover image (PNG, JPEG, or WebP up to
                        5 MB).
                      </p>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Title */}
            <form.Field
              name="title"
              validators={{
                onBlur: ({ value }) => {
                  const res = postTitleSchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "post-title-error";

                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Article Title</FieldTitle>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Post title"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        field.handleChange(newTitle);
                        if (!isSlugManuallyEdited && !isSlugLocked) {
                          form.setFieldValue("slug", slugify(newTitle));
                        }
                      }}
                      maxLength={POST_LIMITS.title.max}
                      disabled={isSubmitting}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      required
                    />
                    {isInvalid ? (
                      <FieldError id={errorId}>{String(error)}</FieldError>
                    ) : (
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>The main headline for the post.</span>
                        <span>
                          {field.state.value.length}/{POST_LIMITS.title.max}
                        </span>
                      </div>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Slug */}
            <form.Field
              name="slug"
              validators={{
                onBlur: ({ value }) => {
                  const res = postSlugSchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "post-slug-error";

                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>URL Slug</FieldTitle>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="URL slug"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        setIsSlugManuallyEdited(true);
                        field.handleChange(e.target.value);
                      }}
                      maxLength={POST_LIMITS.slug.max}
                      disabled={isSubmitting || isSlugLocked}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      required
                    />
                    {isInvalid ? (
                      <FieldError id={errorId}>{String(error)}</FieldError>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        {isSlugLocked
                          ? "The slug cannot be changed once a post has been published to prevent breaking existing links."
                          : "Lower-case letters, numbers and hyphens. Determines the public URL."}
                      </p>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Content (RichTextEditor) */}
            <form.Field
              name="content"
              validators={{
                onBlur: ({ value }) => {
                  const res = postContentSchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "post-content-error";
                const labelId = "post-content-label";

                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel id={labelId} htmlFor={field.name}>
                      <FieldTitle>Content</FieldTitle>
                    </FieldLabel>
                    <RichTextEditor
                      id={field.name}
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                      disabled={isSubmitting}
                      aria-labelledby={labelId}
                      aria-describedby={isInvalid ? errorId : undefined}
                    />
                    {isInvalid ? (
                      <FieldError id={errorId}>{String(error)}</FieldError>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        Compose your post using headings, lists, bold, italics,
                        quotes, and links.
                      </p>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Search Engine Optimization (optional) */}
            <details className="group rounded-md border border-border bg-muted/20 p-4 transition-colors">
              <summary className="cursor-pointer text-sm font-semibold text-foreground select-none">
                Search Engine Optimization (optional)
              </summary>
              <div className="mt-4 space-y-4 pt-2 border-t border-border">
                {/* SEO Title */}
                <form.Field
                  name="seoTitle"
                  validators={{
                    onBlur: ({ value }) => {
                      const res = postSeoTitleSchema.safeParse(value);
                      return res.success
                        ? undefined
                        : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => {
                    const error = field.state.meta.errors[0];
                    const isInvalid = Boolean(error);
                    const errorId = "post-seo-title-error";

                    return (
                      <Field data-invalid={isInvalid} className="gap-1.5">
                        <FieldLabel htmlFor={field.name}>
                          <FieldTitle>SEO Title</FieldTitle>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="SEO title"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          maxLength={POST_LIMITS.seoTitle.max}
                          disabled={isSubmitting}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                        />
                        {isInvalid ? (
                          <FieldError id={errorId}>{String(error)}</FieldError>
                        ) : (
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>
                              Title for search engines. Defaults to article
                              title if blank.
                            </span>
                            <span>
                              {field.state.value.length}/
                              {POST_LIMITS.seoTitle.max}
                            </span>
                          </div>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* SEO Description */}
                <form.Field
                  name="seoDescription"
                  validators={{
                    onBlur: ({ value }) => {
                      const res = postSeoDescriptionSchema.safeParse(value);
                      return res.success
                        ? undefined
                        : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => {
                    const error = field.state.meta.errors[0];
                    const isInvalid = Boolean(error);
                    const errorId = "post-seo-desc-error";

                    return (
                      <Field data-invalid={isInvalid} className="gap-1.5">
                        <FieldLabel htmlFor={field.name}>
                          <FieldTitle>SEO Description</FieldTitle>
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          rows={3}
                          placeholder="Search description"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          maxLength={POST_LIMITS.seoDescription.max}
                          disabled={isSubmitting}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                        />
                        {isInvalid ? (
                          <FieldError id={errorId}>{String(error)}</FieldError>
                        ) : (
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>
                              Summary snippet for search results. Defaults to
                              post excerpt if blank.
                            </span>
                            <span>
                              {field.state.value.length}/
                              {POST_LIMITS.seoDescription.max}
                            </span>
                          </div>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </details>
          </FieldGroup>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Link
              href={ROUTES.adminBlogs}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cancel
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4 mr-2" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? "Save Changes" : "Create Post"}</span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
