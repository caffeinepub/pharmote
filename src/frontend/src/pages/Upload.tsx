import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Upload as UploadIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomCategory, ExternalBlob } from "../backend";
import { CATEGORY_LABELS, useCreateNote } from "../hooks/useQueries";

export default function Upload() {
  const navigate = useNavigate();
  const createNote = useCreateNote();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CustomCategory>(
    CustomCategory.bPharm,
  );
  const [semester, setSemester] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else if (selected) {
      toast.error("Please select a PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      const noteTitle = semester.trim()
        ? `${title.trim()} [${semester.trim()}]`
        : title.trim();

      const note = {
        id: crypto.randomUUID(),
        title: noteTitle,
        description: description.trim(),
        blob,
        category,
        isPublic,
        isFeatured: false,
        timestamp: BigInt(Date.now()),
        uploader: Principal.anonymous() as unknown as Principal,
      };

      await createNote.mutateAsync(note);
      toast.success("Note uploaded successfully!");
      navigate({ to: "/" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload note. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-secondary sticky top-0 z-10 px-4 py-4 border-b border-border flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          data-ocid="upload.back_button"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-display text-xl font-bold text-foreground">
          Upload Notes
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 py-6 max-w-lg mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File picker */}
          <div>
            <Label className="text-foreground font-medium mb-2 block">
              PDF File
            </Label>
            <label
              htmlFor="pdf-file"
              className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/60 transition-colors bg-secondary"
              data-ocid="upload.dropzone"
            >
              {file ? (
                <div className="flex items-center gap-3 text-foreground">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadIcon className="w-10 h-10 text-primary/60" />
                  <p className="font-medium text-sm">Tap to select PDF</p>
                  <p className="text-xs">PDF files only</p>
                </div>
              )}
              <input
                id="pdf-file"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                data-ocid="upload.upload_button"
              />
            </label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div data-ocid="upload.loading_state">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Title */}
          <div>
            <Label htmlFor="note-title" className="text-foreground font-medium">
              Title
            </Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Organic Chemistry Chapter 5"
              required
              className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
              data-ocid="upload.input"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="note-desc" className="text-foreground font-medium">
              Description
            </Label>
            <Textarea
              id="note-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what this note covers..."
              rows={3}
              className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
              data-ocid="upload.textarea"
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-foreground font-medium">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as CustomCategory)}
            >
              <SelectTrigger
                className="mt-1 bg-muted border-border text-foreground"
                data-ocid="upload.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {Object.values(CustomCategory).map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="text-popover-foreground"
                  >
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester / Exam Name */}
          <div>
            <Label className="text-foreground font-medium">
              Semester / Exam Name
            </Label>
            <Input
              className="mt-1 bg-muted border-border text-foreground"
              placeholder="e.g. Semester 3, Mid Term Exam..."
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              data-ocid="upload.semester.input"
            />
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between bg-secondary rounded-xl p-4 border border-border">
            <div>
              <p className="text-foreground font-medium text-sm">Make Public</p>
              <p className="text-xs text-muted-foreground">
                Share with the community
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              data-ocid="upload.switch"
            />
          </div>

          <Button
            type="submit"
            disabled={!file || !title.trim() || isUploading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 rounded-xl text-base"
            data-ocid="upload.submit_button"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="w-4 h-4 mr-2" /> Upload Note
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
