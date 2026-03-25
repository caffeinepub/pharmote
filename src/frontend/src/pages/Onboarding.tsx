import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const slides = [
  {
    image: "/assets/generated/onboarding-1.dim_400x300.png",
    title: "Organize Your Notes",
    description:
      "Upload and organize educational PDFs in one place. Access them anytime, anywhere.",
  },
  {
    image: "/assets/generated/onboarding-2.dim_400x300.png",
    title: "Share Knowledge",
    description:
      "Share your study notes with the community and help others learn better.",
  },
  {
    image: "/assets/generated/onboarding-3.dim_400x300.png",
    title: "Discover & Learn",
    description:
      "Find the best notes with smart search and category filters. Learning made effortless.",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isLast = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6 max-w-sm mx-auto">
      {/* Skip button */}
      <div className="w-full flex justify-end pt-2">
        <button
          type="button"
          onClick={onComplete}
          className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
          data-ocid="onboarding.skip_button"
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* App Name */}
            <div className="mb-6">
              <span className="font-display text-4xl font-bold text-primary tracking-tight">
                Pharmote
              </span>
            </div>

            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-72 h-52 object-cover rounded-2xl mb-8"
            />

            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              {slides[currentSlide].title}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="w-full space-y-6">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: slide dots use index intentionally
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-6 rounded-xl"
          data-ocid="onboarding.next_button"
        >
          {isLast ? "Get Started" : "Next"}
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
