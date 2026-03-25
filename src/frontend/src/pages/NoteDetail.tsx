import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Download,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  CATEGORY_LABELS,
  useAddBookmark,
  useGetBookmarkedNotes,
  useGetNoteById,
  useRemoveBookmark,
} from "../hooks/useQueries";

export default function NoteDetail() {
  const { id } = useParams({ from: "/notes/$id" });
  const navigate = useNavigate();

  const { data: note, isLoading } = useGetNoteById(id);
  const { data: bookmarks = [] } = useGetBookmarkedNotes();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const isBookmarked = bookmarks.some((b) => b.id === id);

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark.mutateAsync(id);
        toast.success("Removed from library");
      } else {
        await addBookmark.mutateAsync(id);
        toast.success("Saved to library");
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background p-4"
        data-ocid="note_detail.loading_state"
      >
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!note) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center p-4"
        data-ocid="note_detail.error_state"
      >
        <p className="text-muted-foreground">Note not found</p>
        <Button
          onClick={() => navigate({ to: "/" })}
          className="mt-4 bg-primary text-primary-foreground"
        >
          Go Home
        </Button>
      </div>
    );
  }

  const pdfUrl = note.blob.getDirectURL();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-secondary sticky top-0 z-10 px-4 py-4 border-b border-border flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          data-ocid="note_detail.back_button"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground flex-1 line-clamp-1">
          {note.title}
        </h1>
        <button
          type="button"
          onClick={handleBookmark}
          disabled={addBookmark.isPending || removeBookmark.isPending}
          data-ocid="note_detail.toggle"
          className="w-9 h-9 flex items-center justify-center"
        >
          {addBookmark.isPending || removeBookmark.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-primary" />
          ) : (
            <Bookmark className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 py-4 space-y-4"
      >
        {/* Meta */}
        <div className="bg-secondary rounded-xl p-4 border border-border space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-0">
              {CATEGORY_LABELS[note.category] ?? note.category}
            </Badge>
            {note.isPublic && (
              <Badge
                variant="outline"
                className="border-border text-muted-foreground"
              >
                Public
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{note.description}</p>
          <p className="text-xs text-muted-foreground">
            Uploaded {new Date(Number(note.timestamp)).toLocaleDateString()}
          </p>
        </div>

        {/* PDF Viewer */}
        <div
          className="rounded-xl overflow-hidden border border-border bg-secondary"
          style={{ height: "60vh" }}
        >
          <iframe
            src={pdfUrl}
            title={note.title}
            className="w-full h-full"
            data-ocid="note_detail.editor"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            asChild
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="note_detail.primary_button"
          >
            <a href={pdfUrl} download={`${note.title}.pdf`}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </a>
          </Button>
          <Button
            onClick={handleBookmark}
            variant="outline"
            disabled={addBookmark.isPending || removeBookmark.isPending}
            className="flex-1 border-border text-foreground hover:bg-muted"
            data-ocid="note_detail.secondary_button"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 mr-2 text-primary" /> Saved
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 mr-2" /> Save
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
