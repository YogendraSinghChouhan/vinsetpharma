"use client";

import {
  IconAlertCircle,
  IconEye,
  IconLink,
  IconPlus,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { CategoryOption } from "@/features/categories/data";
import { ImageUploader } from "@/features/storage/components/image-uploader";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { createProduct, updateProduct } from "../actions";
import { PRODUCT_LIMITS } from "../constants";
import type { Product } from "../schema";
import {
  createProductSchema,
  productCategoryIdSchema,
  productDescriptionSchema,
  productImageKeySchema,
  productTaglineSchema,
  productTitleSchema,
} from "../validation";
import { ProductCardView } from "./product-card";

export interface ProductFormProps {
  product?: Product;
  categories?: CategoryOption[];
}

export function ProductForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter();
  const formHtmlId = useId();
  const isEditMode = Boolean(product);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      title: product?.title ?? "",
      tagline: product?.tagline ?? "",
      description: product?.description ?? "",
      imageKey: product?.imageKey ?? "",
      categoryId: product?.categoryId ?? "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);

      // Validate inputs with Zod
      const parseResult = createProductSchema.safeParse(value);
      if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        setFormError(
          firstIssue?.message ?? "Please fix the highlighted errors.",
        );

        // Focus first invalid field
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
        if (isEditMode && product) {
          const res = await updateProduct({
            id: product.id,
            title: parseResult.data.title,
            tagline: parseResult.data.tagline,
            description: parseResult.data.description,
            imageKey: parseResult.data.imageKey,
            categoryId: parseResult.data.categoryId,
          });

          if (!res.success) {
            setFormError(res.error);
            setIsSubmitting(false);
            return;
          }

          toast.add({
            title: "Product updated",
            description: `"${res.data.title}" has been saved.`,
            type: "success",
          });
        } else {
          const res = await createProduct({
            title: parseResult.data.title,
            tagline: parseResult.data.tagline,
            description: parseResult.data.description,
            imageKey: parseResult.data.imageKey,
            categoryId: parseResult.data.categoryId,
          });

          if (!res.success) {
            setFormError(res.error);
            setIsSubmitting(false);
            return;
          }

          toast.add({
            title: "Product created",
            description: `"${res.data.title}" has been added to products.`,
            type: "success",
          });
        }

        router.push(ROUTES.adminProducts);
        router.refresh();
      } catch {
        setFormError(
          "An unexpected error occurred while saving the product. Please try again.",
        );
        setIsSubmitting(false);
      }
    },
  });

  // Track dirty state
  const isDirty =
    form.state.values.title !== (product?.title ?? "") ||
    form.state.values.tagline !== (product?.tagline ?? "") ||
    form.state.values.description !== (product?.description ?? "") ||
    form.state.values.imageKey !== (product?.imageKey ?? "") ||
    form.state.values.categoryId !== (product?.categoryId ?? "");

  // Unsaved changes guard
  const {
    showDiscardDialog,
    setShowDiscardDialog,
    requestCancel,
    confirmDiscard,
  } = useUnsavedChangesGuard({
    isDirty,
    onDiscard: () => router.push(ROUTES.adminProducts),
  });

  // Save keyboard shortcut (Ctrl+S / Cmd+S)
  const { announcement } = useSaveShortcut({
    onSave: () => form.handleSubmit(),
    disabled: isSubmitting || categories.length === 0,
  });

  // Computed live slug preview
  const liveSlug = useMemo(() => {
    if (isEditMode && product) {
      return product.slug;
    }
    return slugify(form.state.values.title || "product-name");
  }, [isEditMode, product, form.state.values.title]);

  // Selected category name for preview
  const selectedCategoryName = useMemo(() => {
    const selected = categories.find(
      (c) => c.id === form.state.values.categoryId,
    );
    return selected?.name ?? null;
  }, [categories, form.state.values.categoryId]);

  // Completeness checklist items
  const checklistItems = useMemo(
    () => [
      {
        id: "image",
        label: "Product packshot image",
        done: Boolean(form.state.values.imageKey),
        fieldId: "field-imageKey",
        hint: "Required for catalog display",
      },
      {
        id: "title",
        label: "Product title",
        done: form.state.values.title.trim().length >= PRODUCT_LIMITS.title.min,
        fieldId: "field-title",
        hint: `${PRODUCT_LIMITS.title.min}–${PRODUCT_LIMITS.title.max} characters`,
      },
      {
        id: "category",
        label: "Category assignment",
        done: Boolean(form.state.values.categoryId),
        fieldId: "field-categoryId",
        hint: "Select a clinical category",
      },
      {
        id: "tagline",
        label: "Summary tagline",
        done: Boolean(form.state.values.tagline.trim()),
        fieldId: "field-tagline",
        hint: "Brief summary on product cards",
      },
      {
        id: "description",
        label: "Detailed description",
        done: Boolean(form.state.values.description.trim()),
        fieldId: "field-description",
        hint: "Full therapeutic details",
      },
    ],
    [
      form.state.values.imageKey,
      form.state.values.title,
      form.state.values.categoryId,
      form.state.values.tagline,
      form.state.values.description,
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

      {/* Missing Category Warning */}
      {categories.length === 0 && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-50/60 p-4 text-xs text-amber-900 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-300">
          <div className="flex items-center gap-2.5">
            <IconAlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              No product categories exist yet. You must create at least one
              category before adding products.
            </span>
          </div>
          <Link
            href={ROUTES.adminCategoryNew}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shrink-0 bg-background/80 font-semibold",
            )}
          >
            <IconPlus className="size-3.5 mr-1" />
            <span>Create a category</span>
          </Link>
        </div>
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
            {/* Section 1: Product Image */}
            <FormSection
              id="section-image"
              title="Product Image"
              description="Upload a high-resolution packaging packshot or bottle render."
              hint={
                <span className="text-muted-foreground font-medium">
                  PNG, JPEG, WebP
                </span>
              }
            >
              <form.Field
                name="imageKey"
                validators={{
                  onBlur: ({ value }) => {
                    const res = productImageKeySchema.safeParse(value);
                    return res.success
                      ? undefined
                      : res.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => {
                  const error = field.state.meta.errors[0];
                  const isInvalid = Boolean(error);
                  const errorId = "product-image-error";

                  return (
                    <Field data-invalid={isInvalid} className="gap-2">
                      <ImageUploader
                        id="field-imageKey"
                        purpose="products"
                        value={field.state.value || null}
                        onChange={(key) => field.handleChange(key ?? "")}
                        disabled={isSubmitting}
                        aria-invalid={isInvalid}
                        aria-describedby={isInvalid ? errorId : undefined}
                        aria-required="true"
                        aria-label="Product Image Packshot"
                      />
                      {isInvalid && (
                        <FieldError id={errorId}>{String(error)}</FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FormSection>

            {/* Section 2: Details */}
            <FormSection
              id="section-details"
              title="Product Details"
              description="Provide the official name, descriptive tagline, and therapeutic specifications."
            >
              <FieldGroup className="space-y-4">
                {/* Title Field */}
                <form.Field
                  name="title"
                  validators={{
                    onBlur: ({ value }) => {
                      const res = productTitleSchema.safeParse(value);
                      return res.success
                        ? undefined
                        : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => {
                    const error = field.state.meta.errors[0];
                    const isInvalid = Boolean(error);
                    const errorId = "product-title-error";

                    return (
                      <Field data-invalid={isInvalid} className="gap-1.5">
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="field-title">
                            <FieldTitle>Product Title</FieldTitle>
                          </FieldLabel>
                          <CharacterCounter
                            current={field.state.value.length}
                            max={PRODUCT_LIMITS.title.max}
                          />
                        </div>
                        <Input
                          id="field-title"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. Paracetamol 500mg Tablets"
                          maxLength={PRODUCT_LIMITS.title.max}
                          disabled={isSubmitting}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          required
                          className="font-medium"
                        />
                        {isInvalid ? (
                          <FieldError id={errorId}>{String(error)}</FieldError>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            {PRODUCT_LIMITS.title.min} to{" "}
                            {PRODUCT_LIMITS.title.max} characters. Appears on
                            catalog cards and page headings.
                          </p>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Tagline Field */}
                <form.Field
                  name="tagline"
                  validators={{
                    onBlur: ({ value }) => {
                      const res = productTaglineSchema.safeParse(value);
                      return res.success
                        ? undefined
                        : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => {
                    const error = field.state.meta.errors[0];
                    const isInvalid = Boolean(error);
                    const errorId = "product-tagline-error";

                    return (
                      <Field data-invalid={isInvalid} className="gap-1.5">
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="field-tagline">
                            <FieldTitle>Tagline</FieldTitle>
                          </FieldLabel>
                          <CharacterCounter
                            current={field.state.value.length}
                            max={PRODUCT_LIMITS.tagline.max}
                          />
                        </div>
                        <Input
                          id="field-tagline"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. Fast-acting analgesic & antipyretic formulation"
                          maxLength={PRODUCT_LIMITS.tagline.max}
                          disabled={isSubmitting}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                        />
                        {isInvalid ? (
                          <FieldError id={errorId}>{String(error)}</FieldError>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            Brief clinical summary displayed on showcase cards
                            and search previews.
                          </p>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Description Field (gentle auto-growing textarea) */}
                <form.Field
                  name="description"
                  validators={{
                    onBlur: ({ value }) => {
                      const res = productDescriptionSchema.safeParse(value);
                      return res.success
                        ? undefined
                        : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => {
                    const error = field.state.meta.errors[0];
                    const isInvalid = Boolean(error);
                    const errorId = "product-description-error";

                    return (
                      <Field data-invalid={isInvalid} className="gap-1.5">
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="field-description">
                            <FieldTitle>
                              Description & Specifications
                            </FieldTitle>
                          </FieldLabel>
                          <CharacterCounter
                            current={field.state.value.length}
                            max={PRODUCT_LIMITS.description.max}
                          />
                        </div>
                        <Textarea
                          id="field-description"
                          name={field.name}
                          rows={6}
                          placeholder="Detail active pharmaceutical ingredients, dosage strengths, therapeutic indications, packaging specifications, and storage requirements."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            // Gentle auto-grow
                            const target = e.currentTarget;
                            target.style.height = "auto";
                            target.style.height = `${Math.max(140, target.scrollHeight)}px`;
                          }}
                          maxLength={PRODUCT_LIMITS.description.max}
                          disabled={isSubmitting}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          required
                          className="min-h-[140px] resize-y font-normal leading-relaxed"
                        />
                        {isInvalid ? (
                          <FieldError id={errorId}>{String(error)}</FieldError>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            Comprehensive clinical specifications displayed on
                            the product detail page.
                          </p>
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </FormSection>

            {/* Section 3: Category */}
            <FormSection
              id="section-category"
              title="Category"
              description="Organize this product into its primary pharmaceutical category."
              hint={
                categories.length > 0 ? (
                  <Link
                    href={ROUTES.adminCategoryNew}
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <IconPlus className="size-3" />
                    <span>New category</span>
                  </Link>
                ) : undefined
              }
            >
              <form.Field
                name="categoryId"
                validators={{
                  onBlur: ({ value }) => {
                    const res = productCategoryIdSchema.safeParse(value);
                    return res.success
                      ? undefined
                      : res.error.issues[0]?.message;
                  },
                }}
              >
                {(field) => {
                  const error = field.state.meta.errors[0];
                  const isInvalid = Boolean(error);
                  const errorId = "product-category-error";

                  return (
                    <Field data-invalid={isInvalid} className="gap-1.5">
                      <FieldLabel htmlFor="field-categoryId">
                        <FieldTitle>Selected Category</FieldTitle>
                      </FieldLabel>
                      <Select
                        value={field.state.value || null}
                        onValueChange={(val) => field.handleChange(val ?? "")}
                        disabled={categories.length === 0 || isSubmitting}
                      >
                        <SelectTrigger
                          id="field-categoryId"
                          className="w-full font-medium"
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          aria-required="true"
                        >
                          <SelectValue>
                            {selectedCategoryName ??
                              "Select a pharmaceutical category"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid ? (
                        <FieldError id={errorId}>{String(error)}</FieldError>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          Each product must belong to one pharmaceutical
                          category.
                        </p>
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FormSection>
          </div>

          {/* Right Column: Sticky Aside with Live Card Preview & Checklist */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-6">
            {/* Live Website Card Preview */}
            <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <IconEye className="size-4 text-primary" aria-hidden="true" />
                  <h3 className="font-heading text-sm font-semibold text-foreground tracking-tight">
                    Live Card Preview
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-semibold"
                >
                  Website Card
                </Badge>
              </div>

              {/* Shared ProductCardView presentation without link wrapper */}
              <div className="transition-opacity duration-150 motion-reduce:transition-none">
                <ProductCardView
                  title={form.state.values.title}
                  tagline={form.state.values.tagline}
                  imageKey={form.state.values.imageKey}
                  className="w-full bg-background/50 shadow-xs"
                />
              </div>

              {/* Detail Page Preview Snippet */}
              <div className="rounded-lg border border-border/60 bg-surface-tint/50 p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Detail page preview</span>
                  {selectedCategoryName && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-normal py-0"
                    >
                      {selectedCategoryName}
                    </Badge>
                  )}
                </div>
                <h4 className="font-heading font-semibold text-foreground text-sm truncate">
                  {form.state.values.title || "Product Title"}
                </h4>
                <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                  {form.state.values.description ||
                    "Full therapeutic description and dosage specifications will appear here."}
                </p>
              </div>

              {/* Canonical URL preview line */}
              <div className="rounded-md border border-border/60 bg-muted/40 p-2.5 text-xs space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                  <IconLink
                    className="size-3 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>Public URL</span>
                </div>
                <p className="font-mono text-muted-foreground break-all text-[11px]">
                  /products/{liveSlug}
                </p>
                <p className="text-[10px] text-muted-foreground/80 italic">
                  {isEditMode
                    ? "Canonical slug is permanent."
                    : "Set when you save and never changes."}
                </p>
              </div>

              {/* Publication Status info */}
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                <span className="text-muted-foreground">
                  Publication status:
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={product?.published ? "default" : "secondary"}
                    className="text-[10px] uppercase font-semibold"
                  >
                    {product?.published ? "Published" : "Draft"}
                  </Badge>
                  {product?.featured && (
                    <Badge className="text-[10px] bg-amber-500 text-white border-transparent">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic text-right">
                Publish and feature from the product list.
              </p>
            </div>

            {/* Completeness Readiness Checklist */}
            <CompletenessChecklist
              title="Catalog Readiness"
              items={checklistItems}
            />
          </div>
        </div>

        {/* Sticky Action Bar */}
        <StickyActionBar
          isSubmitting={isSubmitting}
          isDirty={isDirty}
          onCancel={() =>
            requestCancel(() => router.push(ROUTES.adminProducts))
          }
          saveLabel={isEditMode ? "Save Changes" : "Create Product"}
          disabled={categories.length === 0}
        />
      </form>

      {/* Discard Changes Confirmation Modal */}
      <DiscardChangesDialog
        open={showDiscardDialog}
        onOpenChange={setShowDiscardDialog}
        onConfirm={() =>
          confirmDiscard(() => router.push(ROUTES.adminProducts))
        }
      />
    </div>
  );
}
