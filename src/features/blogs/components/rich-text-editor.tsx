"use client";

import {
  IconArrowBackUp,
  IconArrowForwardUp,
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
import { Link as TiptapLink } from "@tiptap/extension-link";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor({
  id,
  value,
  onChange,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  disabled = false,
  className,
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
      TiptapLink.configure({
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
          "prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed sm:text-lg min-h-[320px] p-4 sm:p-6 focus:outline-none",
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
      <div className="min-h-[360px] rounded-xl border border-input bg-card p-6 text-sm text-muted-foreground animate-pulse flex items-center justify-center">
        Loading editor surface...
      </div>
    );
  }

  const isLinkActive = editor.isActive("link");

  const buttonClasses = (active: boolean) =>
    cn(
      "inline-flex min-h-[44px] min-w-[44px] sm:min-h-9 sm:min-w-9 items-center justify-center rounded-md text-xs font-semibold transition-colors shrink-0",
      "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active
        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs font-bold"
        : "text-muted-foreground",
      disabled && "opacity-40 pointer-events-none",
    );

  return (
    <TooltipProvider delay={200}>
      <div
        className={cn(
          "rounded-xl border border-input bg-card shadow-xs transition-all overflow-hidden",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        {/* Sticky Accessible Toolbar with Grouped Actions */}
        <div
          role="toolbar"
          aria-label="Article formatting toolbar"
          className="sticky top-0 z-20 flex items-center gap-1.5 overflow-x-auto border-b border-border bg-card/95 backdrop-blur-md p-1.5 sm:p-2 scrollbar-none"
        >
          {/* History Group: Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={disabled || !editor.can().undo()}
                    className={buttonClasses(false)}
                    aria-label="Undo last change (Ctrl+Z)"
                  >
                    <IconArrowBackUp className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Undo</span>
                <kbd className="ml-1 text-[10px] font-mono opacity-70">
                  Ctrl+Z
                </kbd>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={disabled || !editor.can().redo()}
                    className={buttonClasses(false)}
                    aria-label="Redo last change (Ctrl+Shift+Z)"
                  >
                    <IconArrowForwardUp className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Redo</span>
                <kbd className="ml-1 text-[10px] font-mono opacity-70">
                  Ctrl+Y
                </kbd>
              </TooltipContent>
            </Tooltip>
          </div>

          <div
            className="h-5 w-px bg-border/60 mx-1 shrink-0"
            aria-hidden="true"
          />

          {/* Headings Group: H2 / H3 */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    disabled={disabled}
                    aria-pressed={editor.isActive("heading", { level: 2 })}
                    className={buttonClasses(
                      editor.isActive("heading", { level: 2 }),
                    )}
                    aria-label="Heading 2 (H2)"
                  >
                    <IconH2 className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Heading 2</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    disabled={disabled}
                    aria-pressed={editor.isActive("heading", { level: 3 })}
                    className={buttonClasses(
                      editor.isActive("heading", { level: 3 }),
                    )}
                    aria-label="Heading 3 (H3)"
                  >
                    <IconH3 className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Heading 3</span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div
            className="h-5 w-px bg-border/60 mx-1 shrink-0"
            aria-hidden="true"
          />

          {/* Text Styling: Bold / Italic */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                    aria-pressed={editor.isActive("bold")}
                    className={buttonClasses(editor.isActive("bold"))}
                    aria-label="Bold text (Ctrl+B)"
                  >
                    <IconBold className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Bold</span>
                <kbd className="ml-1 text-[10px] font-mono opacity-70">
                  Ctrl+B
                </kbd>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                    aria-pressed={editor.isActive("italic")}
                    className={buttonClasses(editor.isActive("italic"))}
                    aria-label="Italic text (Ctrl+I)"
                  >
                    <IconItalic className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Italic</span>
                <kbd className="ml-1 text-[10px] font-mono opacity-70">
                  Ctrl+I
                </kbd>
              </TooltipContent>
            </Tooltip>
          </div>

          <div
            className="h-5 w-px bg-border/60 mx-1 shrink-0"
            aria-hidden="true"
          />

          {/* Lists Group: Bullet / Numbered */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    disabled={disabled}
                    aria-pressed={editor.isActive("bulletList")}
                    className={buttonClasses(editor.isActive("bulletList"))}
                    aria-label="Bullet List"
                  >
                    <IconList className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Bullet List</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    disabled={disabled}
                    aria-pressed={editor.isActive("orderedList")}
                    className={buttonClasses(editor.isActive("orderedList"))}
                    aria-label="Numbered List"
                  >
                    <IconListNumbers className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Numbered List</span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div
            className="h-5 w-px bg-border/60 mx-1 shrink-0"
            aria-hidden="true"
          />

          {/* Quote Block */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                    disabled={disabled}
                    aria-pressed={editor.isActive("blockquote")}
                    className={buttonClasses(editor.isActive("blockquote"))}
                    aria-label="Blockquote"
                  >
                    <IconQuote className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>Blockquote</span>
              </TooltipContent>
            </Tooltip>
          </div>

          <div
            className="h-5 w-px bg-border/60 mx-1 shrink-0"
            aria-hidden="true"
          />

          {/* Link Controls */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={openLinkDialog}
                    disabled={disabled}
                    aria-pressed={isLinkActive}
                    className={buttonClasses(isLinkActive)}
                    aria-label={
                      isLinkActive
                        ? "Edit destination link"
                        : "Insert destination link"
                    }
                  >
                    <IconLink className="size-4" aria-hidden="true" />
                  </button>
                }
              />
              <TooltipContent side="bottom">
                <span>{isLinkActive ? "Edit Link" : "Insert Link"}</span>
              </TooltipContent>
            </Tooltip>

            {isLinkActive && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={handleRemoveLink}
                      disabled={disabled}
                      className={cn(
                        buttonClasses(false),
                        "text-destructive hover:bg-destructive/10",
                      )}
                      aria-label="Remove link"
                    >
                      <IconUnlink className="size-4" aria-hidden="true" />
                    </button>
                  }
                />
                <TooltipContent side="bottom">
                  <span>Remove Link</span>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Calm Writing Surface with matching website prose classes */}
        <div className="relative bg-card">
          {editor.isEmpty && (
            <p className="pointer-events-none absolute left-4 sm:left-6 top-4 sm:top-6 text-sm sm:text-base text-muted-foreground select-none">
              Write your post
            </p>
          )}
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
                Enter a destination URL. Allowed schemes are http://, https://,
                or mailto:.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <label
                  htmlFor="editor-link-url"
                  className="text-xs font-semibold text-foreground"
                >
                  Destination URL
                </label>
                <Input
                  id="editor-link-url"
                  type="url"
                  placeholder="https://example.com"
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
                  Save Link
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
