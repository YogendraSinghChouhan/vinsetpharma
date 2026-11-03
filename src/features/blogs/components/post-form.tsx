"use client";

import {
  IconAlertCircle,
  IconClock,
  IconEye,
  IconFileText,
  IconSearch,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ROUTES } from "@/config/site";
import {
  CharacterCounter,
  CompletenessChecklist,
  DiscardChangesDialog,
  FormSection,
  StickyActionBar,
  useSaveShortcut,
  useUnsavedChangesGuard,
} from "@/features/admin-shell/components/form";
import { ImageUploader } from "@/features/storage/components/image-uploader";
import { slugify } from "@/lib/slug";
import { createPost, updatePost } from "../actions";
import {
  calculateReadingTimeMinutes,
  calculateWordCount,
  createClientExcerpt,
  formatReadingTime,
} from "../blog-metrics";
import { POST_LIMITS } from "../constants";
import type { Post } from "../schema";
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
import { BlogCardView } from "./blog-card-view";
import { RichTextEditor } from "./rich-text-editor";

export interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const formHtmlId = useId();
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
          const firstIssue = parseResult.error.issues[0];
          setFormError(
            firstIssue?.message ?? "Please fix the highlighted errors.",
          );
          const invalidField = firstIssue?.path[0] as string;
          if (invalidField) {
            const el = document.getElementById(`field-${invalidField}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.focus();
            }
          }
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
          const firstIssue = parseResult.error.issues[0];
          setFormError(
            firstIssue?.message ?? "Please fix the highlighted errors.",
          );
          const invalidField = firstIssue?.path[0] as string;
          if (invalidField) {
            const el = document.getElementById(`field-${invalidField}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.focus();
            }
          }
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

  // Track dirty state
  const isDirty =
    form.state.values.title !== (post?.title ?? "") ||
    form.state.values.slug !== (post?.slug ?? "") ||
    form.state.values.content !== (post?.content ?? "") ||
    form.state.values.coverImageKey !== (post?.coverImageKey ?? "") ||
    form.state.values.seoTitle !== (post?.seoTitle ?? "") ||
    form.state.values.seoDescription !== (post?.seoDescription ?? "");

  // Unsaved changes guard
  const {
    showDiscardDialog,
    setShowDiscardDialog,
    requestCancel,
    confirmDiscard,
  } = useUnsavedChangesGuard({
    isDirty,
    onDiscard: () => router.push(ROUTES.adminBlogs),
  });

  // Save shortcut (Ctrl+S / Cmd+S)
  const { announcement } = useSaveShortcut({
    onSave: () => form.handleSubmit(),
    disabled: isSubmitting,
  });

  // Derived metrics from content
  const wordCount = useMemo(
    () => calculateWordCount(form.state.values.content),
    [form.state.values.content],
  );

  const readingTimeMinutes = useMemo(
    () => calculateReadingTimeMinutes(wordCount),
    [wordCount],
  );

  const clientExcerpt = useMemo(
    () => createClientExcerpt(form.state.values.content, 160),
    [form.state.values.content],
  );

  const searchPreviewDescription =
    form.state.values.seoDescription ||
    clientExcerpt ||
    "Article snippet will appear in search results.";

  const searchPreviewTitle =
    form.state.values.seoTitle || form.state.values.title || "Untitled Article";

  // Completeness checklist items
  const checklistItems = useMemo(
    () => [
      {
        id: "cover",
        label: "Article cover image",
        done: Boolean(form.state.values.coverImageKey),
        fieldId: "field-coverImageKey",
        hint: "Required for blog cards and social sharing",
      },
      {
        id: "title",
        label: "Article headline",
        done: form.state.values.title.trim().length >= POST_LIMITS.title.min,
        fieldId: "field-title",
        hint: `At least ${POST_LIMITS.title.min} characters`,
      },
      {
        id: "slug",
        label: "URL Slug",
        done: Boolean(form.state.values.slug.trim()),
        fieldId: "field-slug",
        hint: "Determines permanent article address",
      },
      {
        id: "content",
        label: "Article content (≥100 words)",
        done: wordCount >= 100,
        fieldId: "field-content",
        hint: `${wordCount} words written`,
      },
      {
        id: "seo",
        label: "SEO description (optional)",
        done: Boolean(form.state.values.seoDescription.trim()),
        fieldId: "field-seoDescription",
        hint: "Recommended for search engine snippet",
      },
    ],
    [
      form.state.values.coverImageKey,
      form.state.values.title,
      form.state.values.slug,
      wordCount,
      form.state.values.seoDescription,
    ],
  );

  return (
    <div className="relative pb-28 sm:pb-16">
      {/* Screen reader announcement for keyboard shortcut */}
      {announcement && (
        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
      )}

      {/* Global Form Error Banner */}
      {formError && (
        <Alert variant="destructive" className="mb-6 animate-in fade-in-50">
          <IconAlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <AlertDescription className="text-xs font-medium">
            {formError}
          </AlertDescription>
        </Alert>
      )}

      <form
        id={formHtmlId}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Column: Form Sections */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Section 1: Cover Image */}
            <FormSection
              id="section-cover"
              title="Cover Image"
              description="Upload an article hero image for catalog grids, social shares, and header display."
              hint={
                <span className="text-muted-foreground font-medium">
                  16:9 ratio recommended
                </span>
              }
            >
              <form.Field
                name="coverImageKey"
                validators={{
                  onBlur: ({ value }) => {
                    const res = postCoverImageKeySchema.safeParse(value);
                    return res.success
                      ? undefined
                      : res.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => {
                  const error = field.state.meta.errors[0];
                  const isInvalid = Boolean(error);
                  const errorId = "post-cover-image-error";

                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <ImageUploader
                        id="field-coverImageKey"
                        purpose="blogs"
                        value={field.state.value || null}
                        onChange={(key) => field.handleChange(key ?? "")}
                        disabled={isSubmitting}
                        aria-invalid={isInvalid}
                        aria-describedby={isInvalid ? errorId : undefined}
                        aria-required="true"
                        aria-label="Article Cover Image"
                      />
                      {isInvalid && (
                        <FieldError id={errorId}>{String(error)}</FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FormSection>

            {/* Section 2: Title and URL */}
            <FormSection
              id="section-title-url"
              title="Title and URL"
              description="Define the primary article headline and canonical public link."
            >
              <FieldGroup className="space-y-4">
                {/* Title */}
                <form.Field
                  name="title"
                  validators={{
                    onBlur: ({ value }) => {
                      const res = postTitleSchema.safeParse(value);
                      return res.success
                        ? undefined
                        : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => {
                    const error = field.state.meta.errors[0];
                    const isInvalid = Boolean(error);
                    const errorId = "post-title-error";

                    return (
                      <Field data-invalid={isInvalid} className="gap-1.5">
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="field-title">
                            <FieldTitle>Article Headline</FieldTitle>
                          </FieldLabel>
                          <CharacterCounter
                            current={field.state.value.length}
                            max={POST_LIMITS.title.max}
                          />
                        </div>
                        <Input
                          id="field-title"
                          name={field.name}
                          type="text"
                          placeholder="e.g. Advancements in Sterile Injectable Formulations"
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
                          className="font-medium text-base sm:text-lg"
                        />
                        {isInvalid ? (
                          <FieldError id={errorId}>{String(error)}</FieldError>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            {POST_LIMITS.title.min} to {POST_LIMITS.title.max}{" "}
                            characters. Appears on cards, social embeds, and
                            article headers.
                          </p>
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
                      return res.success
                        ? undefined
                        : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => {
                    const error = field.state.meta.errors[0];
                    const isInvalid = Boolean(error);
                    const errorId = "post-slug-error";

                    return (
                      <Field data-invalid={isInvalid} className="gap-1.5">
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="field-slug">
                            <FieldTitle>URL Slug</FieldTitle>
                          </FieldLabel>
                          <CharacterCounter
                            current={field.state.value.length}
                            max={POST_LIMITS.slug.max}
                          />
                        </div>
                        <Input
                          id="field-slug"
                          name={field.name}
                          type="text"
                          placeholder="e.g. sterile-injectable-formulations"
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
                          className="font-mono text-xs sm:text-sm"
                        />
                        {isInvalid ? (
                          <FieldError id={errorId}>{String(error)}</FieldError>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-muted-foreground">
                            <span>
                              {isSlugLocked
                                ? "Slug is locked because this article has been published, preserving canonical search links."
                                : "Lowercase letters, numbers, and hyphens."}
                            </span>
                            <span className="font-mono text-foreground font-medium">
                              /blog/{field.state.value || "..."}
                            </span>
                          </div>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FormSection>

            {/* Section 3: Content Editor */}
            <FormSection
              id="section-content"
              title="Article Content"
              description="Compose your article using clinical headings, lists, bold styling, quotes, and links."
              hint={
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <IconFileText className="size-3.5" />
                    <span>{wordCount} words</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <IconClock className="size-3.5" />
                    <span>{formatReadingTime(readingTimeMinutes)}</span>
                  </span>
                </div>
              }
            >
              <form.Field
                name="content"
                validators={{
                  onBlur: ({ value }) => {
                    const res = postContentSchema.safeParse(value);
                    return res.success
                      ? undefined
                      : res.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => {
                  const error = field.state.meta.errors[0];
                  const isInvalid = Boolean(error);
                  const errorId = "post-content-error";
                  const labelId = "post-content-label";

                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <span id={labelId} className="sr-only">
                        Article Content
                      </span>
                      <RichTextEditor
                        id="field-content"
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val)}
                        disabled={isSubmitting}
                        aria-labelledby={labelId}
                        aria-describedby={isInvalid ? errorId : undefined}
                      />
                      {isInvalid ? (
                        <FieldError id={errorId}>{String(error)}</FieldError>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>
                            Prose styles match the public website rendering.
                          </span>
                          <span>
                            {wordCount >= 100 ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                Ready for publishing ({wordCount} words)
                              </span>
                            ) : (
                              <span>Recommended: 100+ words</span>
                            )}
                          </span>
                        </div>
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FormSection>

            {/* Section 4: Search Appearance (Collapsible-free) */}
            <FormSection
              id="section-seo"
              title="Search Appearance"
              description="Customize how this article appears on Google, Bing, and social search previews."
            >
              <FieldGroup className="space-y-4">
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
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="field-seoTitle">
                            <FieldTitle>SEO Title</FieldTitle>
                          </FieldLabel>
                          <CharacterCounter
                            current={field.state.value.length}
                            max={POST_LIMITS.seoTitle.max}
                          />
                        </div>
                        <Input
                          id="field-seoTitle"
                          name={field.name}
                          type="text"
                          placeholder="Custom search title (defaults to article headline if empty)"
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
                          <p className="text-[11px] text-muted-foreground">
                            Recommended under 60 characters for clean Google
                            search snippet display.
                          </p>
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
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="field-seoDescription">
                            <FieldTitle>SEO Description</FieldTitle>
                          </FieldLabel>
                          <CharacterCounter
                            current={field.state.value.length}
                            max={POST_LIMITS.seoDescription.max}
                          />
                        </div>
                        <Textarea
                          id="field-seoDescription"
                          name={field.name}
                          rows={3}
                          placeholder="Brief summary snippet for search result snippets (defaults to article excerpt if empty)"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          maxLength={POST_LIMITS.seoDescription.max}
                          disabled={isSubmitting}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          className="resize-y min-h-[80px]"
                        />
                        {isInvalid ? (
                          <FieldError id={errorId}>{String(error)}</FieldError>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            140–160 characters recommended to maximize
                            click-through rate from search engines.
                          </p>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FormSection>
          </div>

          {/* Right Column: Sticky Aside with Blog Card Preview & Google Search Snippet */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* Live Blog Card Preview */}
            <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <IconEye className="size-4 text-primary" aria-hidden="true" />
                  <h3 className="font-heading text-sm font-semibold text-foreground tracking-tight">
                    Website Card Preview
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-semibold"
                >
                  Blog Grid
                </Badge>
              </div>

              {/* Shared BlogCardView presentation without link */}
              <div className="transition-opacity duration-150 motion-reduce:transition-none">
                <BlogCardView
                  title={form.state.values.title}
                  excerpt={clientExcerpt}
                  coverImageKey={form.state.values.coverImageKey}
                  publishedAt={post?.publishedAt}
                  className="w-full bg-background/50 shadow-xs"
                />
              </div>

              {/* Google-Style Search Result Snippet Preview */}
              <div className="rounded-lg border border-border/80 bg-card p-3.5 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold">
                  <IconSearch
                    className="size-3.5 text-primary"
                    aria-hidden="true"
                  />
                  <span>Search Snippet Preview</span>
                </div>
                <div className="space-y-1 pt-1 border-t border-border/40">
                  <p className="text-[11px] text-muted-foreground font-mono truncate">
                    vinsetpharma.com › blog › {form.state.values.slug || "..."}
                  </p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline line-clamp-1 leading-snug cursor-pointer">
                    {searchPreviewTitle}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {searchPreviewDescription}
                  </p>
                </div>
              </div>

              {/* Publication Status info */}
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                <span className="text-muted-foreground">
                  Publication status:
                </span>
                <Badge
                  variant={post?.published ? "default" : "secondary"}
                  className="text-[10px] uppercase font-semibold"
                >
                  {post?.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground italic text-right">
                Publish and feature from the post list.
              </p>
            </div>

            {/* Completeness Readiness Checklist */}
            <CompletenessChecklist
              title="Article Readiness"
              items={checklistItems}
            />
          </div>
        </div>

        {/* Sticky Action Bar */}
        <StickyActionBar
          isSubmitting={isSubmitting}
          isDirty={isDirty}
          onCancel={() => requestCancel(() => router.push(ROUTES.adminBlogs))}
          saveLabel={isEditMode ? "Save Changes" : "Create Post"}
        />
      </form>

      {/* Discard Changes Confirmation Modal */}
      <DiscardChangesDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        onConfirm={() => confirmDiscard(() => router.push(ROUTES.adminBlogs))}
      />
    </div>
  );
}
