import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Clock, FileText } from "lucide-react";
import { CustomCategory, type NoteMetaData } from "../backend";
import { CATEGORY_LABELS } from "../hooks/useQueries";

interface NoteCardProps {
  note: NoteMetaData;
  uploaderName?: string;
  index?: number;
}

function formatTimeAgo(timestamp: bigint): string {
  const ms = Number(timestamp);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const CATEGORY_COLORS: Record<CustomCategory, string> = {
  [CustomCategory.bPharm]: "bg-orange-100 text-orange-700",
  [CustomCategory.dPharm]: "bg-blue-100 text-blue-700",
  [CustomCategory.mPharm]: "bg-purple-100 text-purple-700",
  [CustomCategory.graduate]: "bg-green-100 text-green-700",
};

export default function NoteCard({
  note,
  uploaderName,
  index = 1,
}: NoteCardProps) {
  return (
    <Link
      to="/notes/$id"
      params={{ id: note.id }}
      data-ocid={`notes.item.${index}`}
      className="block"
    >
      <div className="bg-card rounded-xl shadow-card p-4 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-card-foreground text-sm leading-tight line-clamp-2">
              {note.title}
            </h3>
          </div>
          <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {note.description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              CATEGORY_COLORS[note.category] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {CATEGORY_LABELS[note.category] ?? note.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(note.timestamp)}</span>
          </div>
        </div>
        {uploaderName && (
          <p className="text-xs text-muted-foreground">by {uploaderName}</p>
        )}
      </div>
    </Link>
  );
}
