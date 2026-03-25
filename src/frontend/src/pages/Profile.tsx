import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Edit2, Save, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomCategory } from "../backend";
import NoteCard from "../components/NoteCard";
import { CATEGORY_LABELS, useGetRecentNotes } from "../hooks/useQueries";

const PROFILE_KEY = "pharmote_profile";

const COURSE_OPTIONS: { value: CustomCategory; label: string }[] = [
  { value: CustomCategory.bPharm, label: "B Pharm" },
  { value: CustomCategory.dPharm, label: "D Pharm" },
  { value: CustomCategory.mPharm, label: "M Pharm" },
  { value: CustomCategory.graduate, label: "Graduate" },
];

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function Profile() {
  const saved = getProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(saved.name || "");
  const [editAge, setEditAge] = useState(saved.age || "");
  const [editDob, setEditDob] = useState(saved.dob || "");
  const [editCourse, setEditCourse] = useState<CustomCategory>(
    saved.course || CustomCategory.bPharm,
  );
  const [profile, setProfile] = useState(saved);

  const { data: recentNotes = [], isLoading: notesLoading } =
    useGetRecentNotes();

  const handleSave = () => {
    const updated = {
      name: editName.trim(),
      age: editAge,
      dob: editDob,
      course: editCourse,
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    setProfile(updated);
    toast.success("Profile updated!");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-secondary sticky top-0 z-10 px-4 py-4 border-b border-border flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Profile
        </h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-2xl p-5 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                {profile?.name ? (
                  <span className="text-2xl font-bold text-primary-foreground">
                    {profile.name[0].toUpperCase()}
                  </span>
                ) : (
                  <User className="w-7 h-7 text-primary-foreground" />
                )}
              </div>
              {!isEditing && (
                <div className="space-y-1">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    {profile?.name ?? "Anonymous"}
                  </h2>
                  {profile?.course && (
                    <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                      {CATEGORY_LABELS[profile.course as CustomCategory]}
                    </Badge>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {profile?.age && <span>Age {profile.age}</span>}
                    {profile?.dob && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {profile.dob}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                data-ocid="profile.edit_button"
              >
                <Edit2 className="w-4 h-4 text-foreground" />
              </button>
            )}
          </div>

          {isEditing && (
            <div className="space-y-3">
              <div>
                <Label className="text-foreground text-sm">Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 bg-muted border-border text-foreground"
                  data-ocid="profile.input"
                />
              </div>
              <div>
                <Label className="text-foreground text-sm">Age</Label>
                <Input
                  type="number"
                  min={16}
                  max={99}
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  className="mt-1 bg-muted border-border text-foreground"
                  data-ocid="profile.age_input"
                />
              </div>
              <div>
                <Label className="text-foreground text-sm">Date of Birth</Label>
                <Input
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  className="mt-1 bg-muted border-border text-foreground"
                  data-ocid="profile.dob_input"
                />
              </div>
              <div>
                <Label className="text-foreground text-sm">Course</Label>
                <Select
                  value={editCourse}
                  onValueChange={(v) => setEditCourse(v as CustomCategory)}
                >
                  <SelectTrigger
                    className="mt-1 bg-muted border-border text-foreground"
                    data-ocid="profile.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {COURSE_OPTIONS.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="text-popover-foreground"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!editName.trim() || !editAge || !editDob}
                  size="sm"
                  className="bg-primary text-primary-foreground"
                  data-ocid="profile.save_button"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground"
                  data-ocid="profile.cancel_button"
                >
                  <X className="w-3 h-3 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent Notes */}
        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-3">
            All Notes
          </h2>
          {notesLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="py-10 text-center" data-ocid="profile.empty_state">
              <p className="text-muted-foreground text-sm">
                No notes have been uploaded yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recentNotes.map((note, i) => (
                <NoteCard key={note.id} note={note} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
