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
import { createProduct, updateProduct } from "../actions";
import { PRODUCT_LIMITS } from "../constants";
import type { Product } from "../schema";
import {
  createProductSchema,
  productDescriptionSchema,
  productImageKeySchema,
  productTaglineSchema,
  productTitleSchema,
} from "../validation";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(product);

  const form = useForm({
    defaultValues: {
      title: product?.title ?? "",
      tagline: product?.tagline ?? "",
      description: product?.description ?? "",
      imageKey: product?.imageKey ?? "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);

      // Validate inputs with Zod
      const parseResult = createProductSchema.safeParse(value);
      if (!parseResult.success) {
        setFormError(
          parseResult.error.issues[0]?.message ?? "Please fix form errors.",
        );
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

  return (
    <Card className="border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {isEditMode ? "Edit Product" : "New Product Details"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the details and image for this pharmaceutical product."
            : "Enter information to showcase a new product in the catalog."}
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
            {/* Image Uploader Field */}
            <form.Field
              name="imageKey"
              validators={{
                onBlur: ({ value }) => {
                  const res = productImageKeySchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "product-image-error";

                return (
                  <Field data-invalid={isInvalid} className="gap-2">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Product Image</FieldTitle>
                    </FieldLabel>
                    <ImageUploader
                      id={field.name}
                      purpose="products"
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
                        Upload a clear product packshot (PNG, JPEG, or WebP up
                        to 5 MB).
                      </p>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Title Field */}
            <form.Field
              name="title"
              validators={{
                onBlur: ({ value }) => {
                  const res = productTitleSchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "product-title-error";

                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Product Title</FieldTitle>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="e.g. Paracetamol 500mg Tablets"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      maxLength={PRODUCT_LIMITS.title.max}
                      disabled={isSubmitting}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      required
                    />
                    {isInvalid ? (
                      <FieldError id={errorId}>{String(error)}</FieldError>
                    ) : (
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>The official product name.</span>
                        <span>
                          {field.state.value.length}/{PRODUCT_LIMITS.title.max}
                        </span>
                      </div>
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
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "product-tagline-error";

                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Tagline</FieldTitle>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="e.g. Fast-acting relief for mild to moderate pain."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      maxLength={PRODUCT_LIMITS.tagline.max}
                      disabled={isSubmitting}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                    />
                    {isInvalid ? (
                      <FieldError id={errorId}>{String(error)}</FieldError>
                    ) : (
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>A short highlight sentence for listings.</span>
                        <span>
                          {field.state.value.length}/
                          {PRODUCT_LIMITS.tagline.max}
                        </span>
                      </div>
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Description Field with Live Character Count */}
            <form.Field
              name="description"
              validators={{
                onBlur: ({ value }) => {
                  const res = productDescriptionSchema.safeParse(value);
                  return res.success ? undefined : res.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const error = field.state.meta.errors[0];
                const isInvalid = Boolean(error);
                const errorId = "product-description-error";
                const currentLength = field.state.value.length;

                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel htmlFor={field.name}>
                      <FieldTitle>Description</FieldTitle>
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={6}
                      placeholder="Detailed pharmaceutical specifications, active ingredients, dosage form, packaging..."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      maxLength={PRODUCT_LIMITS.description.max}
                      disabled={isSubmitting}
                      aria-invalid={isInvalid}
                      aria-describedby={isInvalid ? errorId : undefined}
                      required
                    />
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      {isInvalid ? (
                        <FieldError id={errorId}>{String(error)}</FieldError>
                      ) : (
                        <span>Comprehensive details for buyers and RFQs.</span>
                      )}
                      <span
                        className={
                          currentLength > PRODUCT_LIMITS.description.max - 100
                            ? "font-semibold text-destructive"
                            : ""
                        }
                      >
                        {currentLength}/{PRODUCT_LIMITS.description.max}{" "}
                        characters
                      </span>
                    </div>
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link
              href={ROUTES.adminProducts}
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
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
