import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { CustomCategory } from "../backend";
import type { NoteMetaData } from "../backend";
import NoteCard from "../components/NoteCard";
import {
  CATEGORY_LABELS,
  useGetAllNotes,
  useGetFeaturedNotes,
  useGetNotesByCategory,
  useGetRecentNotes,
} from "../hooks/useQueries";

type FilterKey = "all" | CustomCategory;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: CustomCategory.bPharm, label: CATEGORY_LABELS[CustomCategory.bPharm] },
  { key: CustomCategory.dPharm, label: CATEGORY_LABELS[CustomCategory.dPharm] },
  { key: CustomCategory.mPharm, label: CATEGORY_LABELS[CustomCategory.mPharm] },
  {
    key: CustomCategory.graduate,
    label: CATEGORY_LABELS[CustomCategory.graduate],
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const { data: featuredNotes = [], isLoading: loadingFeatured } =
    useGetFeaturedNotes();
  const { data: recentNotes = [], isLoading: loadingRecent } =
    useGetRecentNotes();
  const { data: allNotes = [], isLoading: loadingAll } = useGetAllNotes();
  const { data: categoryNotes = [] } = useGetNotesByCategory(
    activeFilter !== "all" ? (activeFilter as CustomCategory) : null,
  );

  const displayNotes: NoteMetaData[] =
    activeFilter === "all"
      ? search
        ? allNotes.filter(
            (n) =>
              n.title.toLowerCase().includes(search.toLowerCase()) ||
              n.description.toLowerCase().includes(search.toLowerCase()),
          )
        : recentNotes
      : categoryNotes;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-secondary sticky top-0 z-10 px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display text-2xl font-bold text-primary">
            Pharmote
          </h1>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="pl-9 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl"
            data-ocid="home.search_input"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Category Filters */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              data-ocid="home.filter.tab"
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground border border-border hover:border-primary/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Featured Notes */}
        {activeFilter === "all" && !search && (
          <section className="px-4 mb-6">
            <h2 className="font-display text-lg font-bold text-foreground mb-3">
              Featured Notes
            </h2>
            {loadingFeatured ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="w-44 h-32 rounded-xl shrink-0" />
                ))}
              </div>
            ) : featuredNotes.length === 0 ? (
              <div
                className="bg-secondary rounded-xl p-4 text-center"
                data-ocid="featured.empty_state"
              >
                <p className="text-muted-foreground text-sm">
                  No featured notes yet
                </p>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {featuredNotes.map((note, i) => (
                  <div key={note.id} className="w-52 shrink-0">
                    <NoteCard note={note} index={i + 1} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recent / Filtered Notes */}
        <section className="px-4">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">
            {activeFilter === "all" && !search ? "Recent Notes" : "Notes"}
          </h2>
          {loadingRecent || loadingAll ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : displayNotes.length === 0 ? (
            <div className="py-12 text-center" data-ocid="home.empty_state">
              <p className="text-muted-foreground">No notes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayNotes.map((note, i) => (
                <NoteCard key={note.id} note={note} index={i + 1} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
