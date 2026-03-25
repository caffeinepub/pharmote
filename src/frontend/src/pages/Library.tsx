import { Skeleton } from "@/components/ui/skeleton";
import { BookMarked } from "lucide-react";
import { motion } from "motion/react";
import NoteCard from "../components/NoteCard";
import { useGetBookmarkedNotes } from "../hooks/useQueries";

export default function Library() {
  const { data: notes = [], isLoading } = useGetBookmarkedNotes();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-secondary sticky top-0 z-10 px-4 py-4 border-b border-border">
        <h1 className="font-display text-2xl font-bold text-foreground">
          My Library
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your saved notes</p>
      </div>

      <div className="px-4 py-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
            data-ocid="library.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 border border-border">
              <BookMarked className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              No saved notes yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
              Explore and save notes to access them here anytime.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            {notes.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i + 1} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
