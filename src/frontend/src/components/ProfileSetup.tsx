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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CustomCategory } from "../backend";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

interface ProfileSetupProps {
  onComplete: () => void;
}

const COURSE_OPTIONS: { value: CustomCategory; label: string }[] = [
  { value: CustomCategory.bPharm, label: "B Pharm" },
  { value: CustomCategory.dPharm, label: "D Pharm" },
  { value: CustomCategory.mPharm, label: "M Pharm" },
  { value: CustomCategory.graduate, label: "Graduate" },
];

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [course, setCourse] = useState<CustomCategory>(CustomCategory.bPharm);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age || !dob || !course) return;
    await saveProfile.mutateAsync({
      name: name.trim(),
      age: BigInt(age),
      dob,
      course,
    });
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
      data-ocid="profile_setup.modal"
    >
      <div className="bg-secondary rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl text-primary-foreground font-bold">
              P
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Welcome to Pharmote
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Set up your profile to get started
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="setup-name" className="text-foreground">
              Full Name
            </Label>
            <Input
              id="setup-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
              data-ocid="profile_setup.input"
            />
          </div>
          <div>
            <Label htmlFor="setup-age" className="text-foreground">
              Age
            </Label>
            <Input
              id="setup-age"
              type="number"
              min={16}
              max={99}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              required
              className="mt-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
              data-ocid="profile_setup.age_input"
            />
          </div>
          <div>
            <Label htmlFor="setup-dob" className="text-foreground">
              Date of Birth
            </Label>
            <Input
              id="setup-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="mt-1 bg-muted border-border text-foreground"
              data-ocid="profile_setup.dob_input"
            />
          </div>
          <div>
            <Label className="text-foreground">Course</Label>
            <Select
              value={course}
              onValueChange={(v) => setCourse(v as CustomCategory)}
            >
              <SelectTrigger
                className="mt-1 bg-muted border-border text-foreground"
                data-ocid="profile_setup.select"
              >
                <SelectValue placeholder="Select your course" />
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
          <Button
            type="submit"
            disabled={
              !name.trim() || !age || !dob || !course || saveProfile.isPending
            }
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="profile_setup.submit_button"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
