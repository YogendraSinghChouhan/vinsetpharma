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
import { toast } from "@/components/ui/toast";
import { ROUTES } from "@/config/site";
import { ImageUploader } from "@/features/storage/components/image-uploader";
import { cn } from "@/lib/utils";
import { createCategory, updateCategory } from "../actions";
import { CATEGORY_LIMITS } from "../constants";
import type { Category } from "../schema";
import {
  categoryImageKeySchema,
  categoryNameSchema,
  createCategorySchema,
} from "../validation";

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(category);

  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
      imageKey: category?.imageKey ?? "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);

      const parseResult = createCategorySchema.safeParse(value);
      if (!parseResult.success) {
        setFormError(
          parseResult.error.issues[0]?.message ?? "Please fix form errors.",
        );
        return;
      }

      setIsSubmitting(true);

      try {
        if (isEditMode && category) {
          const res = await updateCategory({
            id: category.id,
            name: parseResult.data.name,
            imageKey: parseResult.data.imageKey,
          });

          if (!res.success) {
            setFormError(res.error);
            setIsSubmitting(false);
            return;
          }

          toast.add({
            title: "Category updated",
            description: `"${res.data.name}" has been saved.`,
            type: "success",
          });
        } else {
          const res = await createCategory({
            name: parseResult.data.name,
            imageKey: parseResult.data.imageKey,
          });

          if (!res.success) {
            setFormError(res.error);
            setIsSubmitting(false);
            return;
          }

          toast.add({
            title: "Category created",
            description: `"${res.data.name}" has been added to categories.`,
            type: "success",
          });
        }

        router.push(ROUTES.adminCategories);
        router.refresh();
      } catch {
        setFormError(
          "An unexpected error occurred while saving the category. Please try again.",
        );
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {isEditMode ? "Edit Category" : "New Category Details"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the name or optional thumbnail image for this category."
            : "Enter a category name and optional image to organize products."}
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
            {/* Slug field (read-only on edit) */}
            {isEditMode && category ? (
              <Field className="gap-1.5">
                <FieldLabel htmlFor="category-slug">
                  <FieldTitle>Category Slug</FieldTitle>
                </FieldLabel>
                <Input
                  id="category-slug"
                  value={category.slug}
                  disabled
                  readOnly
                  className="bg-muted text-muted-foreground font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Slugs are permalinks generated at creation and cannot be
                  modified.
                </p>
              </Field>
            ) : null}

            {/* Name Field */}
            <form.Field
              name="name"
              validators={{
                onBlur: ({ value }) => {
                  const res = categoryNameSchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "category-name-error";

                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Category Name</FieldTitle>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Category name"
                      disabled={isSubmitting}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      aria-required="true"
                    />
                    {isInvalid ? (
                      <FieldError id={errorId}>{String(error)}</FieldError>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        {CATEGORY_LIMITS.name.min} to {CATEGORY_LIMITS.name.max}{" "}
                        characters.
                      </p>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Optional Image Uploader Field */}
            <form.Field
              name="imageKey"
              validators={{
                onBlur: ({ value }) => {
                  if (!value) return undefined;
                  const res = categoryImageKeySchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "category-image-error";

                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Category Image (Optional)</FieldTitle>
                    </FieldLabel>
                    <ImageUploader
                      id={field.name}
                      purpose="categories"
                      value={field.state.value || null}
                      onChange={(key) => field.handleChange(key ?? "")}
                      disabled={isSubmitting}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      aria-required="false"
                    />
                    {isInvalid ? (
                      <FieldError id={errorId}>{String(error)}</FieldError>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        If empty, the image of the first product in this
                        category is used.
                      </p>
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link
              href={ROUTES.adminCategories}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Cancel
            </Link>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit]) => (
                <Button
                  type="submit"
                  size="sm"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="size-3.5 mr-2" />
                      <span>Saving...</span>
                    </>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Create Category"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
