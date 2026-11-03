"use client";

import {
  IconBold,
  IconH2,
  IconH3,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconQuote,
  IconUnlink,
} from "@tabler/icons-react";
import { Link } from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  id,
  value,
  onChange,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  disabled = false,
}: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        id: id ?? "rich-text-editor-content",
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[220px] px-3 py-2.5 focus:outline-none text-foreground",
        ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
        ...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {}),
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const isEmpty = editor.isEmpty;
      onChange(isEmpty ? "" : html);
    },
  });

  // Sync external value when not focused or reset
  useEffect(() => {
    if (!editor) return;
    if (editor.isFocused) return;

    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  // Update editable status
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  function openLinkDialog() {
    if (!editor) return;
    const existingHref = editor.getAttributes("link").href ?? "";
    setLinkUrl(existingHref);
    setLinkError(null);
    setIsLinkDialogOpen(true);
  }

  function handleSaveLink() {
    if (!editor) return;
    const trimmed = linkUrl.trim();

    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsLinkDialogOpen(false);
      return;
    }

    const isValidScheme =
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("mailto:");

    if (!isValidScheme) {
      setLinkError("URL must start with http://, https:// or mailto:");
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: trimmed })
      .run();

    setIsLinkDialogOpen(false);
  }

  function handleRemoveLink() {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkDialogOpen(false);
  }

  if (!editor) {
    return (
      <div className="min-h-[260px] rounded-md border border-input bg-background/50 p-3 text-sm text-muted-foreground animate-pulse">
        Loading editor...
      </div>
    );
  }

  const isLinkActive = editor.isActive("link");

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Rich text formatting"
        className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-1.5"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          aria-pressed={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            editor.isActive("bold")
              ? "bg-muted-foreground/20 text-foreground font-bold"
              : "text-muted-foreground",
          )}
        >
          <IconBold className="size-4" aria-hidden="true" />
          <span className="sr-only">Bold</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          aria-pressed={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            editor.isActive("italic")
              ? "bg-muted-foreground/20 text-foreground"
              : "text-muted-foreground",
          )}
        >
          <IconItalic className="size-4" aria-hidden="true" />
          <span className="sr-only">Italic</span>
        </button>

        <div className="h-4 w-px bg-border mx-1" aria-hidden="true" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
          aria-pressed={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            editor.isActive("heading", { level: 2 })
              ? "bg-muted-foreground/20 text-foreground font-semibold"
              : "text-muted-foreground",
          )}
        >
          <IconH2 className="size-4" aria-hidden="true" />
          <span className="sr-only">Heading 2</span>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={disabled}
          aria-pressed={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            editor.isActive("heading", { level: 3 })
              ? "bg-muted-foreground/20 text-foreground font-semibold"
              : "text-muted-foreground",
          )}
        >
          <IconH3 className="size-4" aria-hidden="true" />
          <span className="sr-only">Heading 3</span>
        </button>

        <div className="h-4 w-px bg-border mx-1" aria-hidden="true" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          aria-pressed={editor.isActive("bulletList")}
          title="Bullet List"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            editor.isActive("bulletList")
              ? "bg-muted-foreground/20 text-foreground"
              : "text-muted-foreground",
          )}
        >
          <IconList className="size-4" aria-hidden="true" />
          <span className="sr-only">Bullet List</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          aria-pressed={editor.isActive("orderedList")}
          title="Numbered List"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            editor.isActive("orderedList")
              ? "bg-muted-foreground/20 text-foreground"
              : "text-muted-foreground",
          )}
        >
          <IconListNumbers className="size-4" aria-hidden="true" />
          <span className="sr-only">Numbered List</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          aria-pressed={editor.isActive("blockquote")}
          title="Blockquote"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            editor.isActive("blockquote")
              ? "bg-muted-foreground/20 text-foreground"
              : "text-muted-foreground",
          )}
        >
          <IconQuote className="size-4" aria-hidden="true" />
          <span className="sr-only">Blockquote</span>
        </button>

        <div className="h-4 w-px bg-border mx-1" aria-hidden="true" />

        <button
          type="button"
          onClick={openLinkDialog}
          disabled={disabled}
          aria-pressed={isLinkActive}
          title={isLinkActive ? "Edit Link" : "Insert Link"}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            isLinkActive
              ? "bg-muted-foreground/20 text-primary font-semibold"
              : "text-muted-foreground",
          )}
        >
          <IconLink className="size-4" aria-hidden="true" />
          <span className="sr-only">
            {isLinkActive ? "Edit Link" : "Insert Link"}
          </span>
        </button>

        {isLinkActive && (
          <button
            type="button"
            onClick={handleRemoveLink}
            disabled={disabled}
            title="Remove Link"
            className="inline-flex size-8 items-center justify-center rounded-sm text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <IconUnlink className="size-4" aria-hidden="true" />
            <span className="sr-only">Remove Link</span>
          </button>
        )}
      </div>

      {/* Editor Body */}
      <div className="relative">
        {editor.isEmpty ? (
          <p className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground select-none">
            Write your post
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isLinkActive ? "Edit Link" : "Insert Link"}
            </DialogTitle>
            <DialogDescription>
              Enter a destination URL. Allowed schemes are http://, https://, or
              mailto:.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label
                htmlFor="editor-link-url"
                className="text-xs font-medium text-foreground"
              >
                URL
              </label>
              <Input
                id="editor-link-url"
                type="url"
                placeholder="https://"
                value={linkUrl}
                onChange={(e) => {
                  setLinkUrl(e.target.value);
                  setLinkError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveLink();
                  }
                }}
                aria-invalid={linkError ? "true" : undefined}
                aria-describedby={linkError ? "editor-link-error" : undefined}
              />
              {linkError && (
                <p
                  id="editor-link-error"
                  className="text-xs text-destructive font-medium"
                >
                  {linkError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
            {isLinkActive ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveLink}
              >
                Remove
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsLinkDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSaveLink}>
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
