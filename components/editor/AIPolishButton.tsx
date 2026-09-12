"use client";

import { useState } from "react";
import { Sparkles, Check } from "lucide-react";

interface AIPolishButtonProps {
  currentText: string;
  onApplyEnhancedText: (enhanced: string) => void;
  type?: "heading" | "tagline" | "description" | "button" | "general";
  companyName?: string;
}

export default function AIPolishButton({
  currentText,
  onApplyEnhancedText,
  type = "general",
  companyName = "Our Company",
}: AIPolishButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);

  const enhanceCopy = () => {
    setIsEnhancing(true);

    setTimeout(() => {
      const company = companyName || "Our Company";

      if (type === "heading") {
        const headingVariations = [
          `Build the Future of Technology at ${company}`,
          `Join ${company}'s High-Growth Core Team`,
          `Empowering Top Talent & Driving Global Innovation`,
          `Craft Extraordinary Digital Products with ${company}`,
        ];
        onApplyEnhancedText(headingVariations[Math.floor(Math.random() * headingVariations.length)]);
      } else if (type === "tagline") {
        const taglineVariations = [
          `Innovating tomorrow's technology with speed, ownership, and passion.`,
          `Where exceptional talent solves ambitious global challenges.`,
          `Pioneering next-generation enterprise software solutions at scale.`,
        ];
        onApplyEnhancedText(taglineVariations[Math.floor(Math.random() * taglineVariations.length)]);
      } else if (type === "button") {
        const btnVariations = [
          `Explore Open Opportunities →`,
          `Join Our Team Today`,
          `View Active Engineering Roles`,
          `Apply for this Position`,
        ];
        onApplyEnhancedText(btnVariations[Math.floor(Math.random() * btnVariations.length)]);
      } else {
        // Description / Paragraph
        const descVariations = [
          `At ${company}, we empower ambitious builders to own high-impact projects, collaborate across cross-functional teams, and shape the next generation of scalable software.`,
          `We build mission-critical products with deep ownership, radical transparency, and a relentless focus on engineering excellence.`,
          `Join a culture engineered for rapid growth, creative autonomy, and personal development alongside industry-leading technical experts.`,
        ];
        onApplyEnhancedText(descVariations[Math.floor(Math.random() * descVariations.length)]);
      }

      setIsEnhancing(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, 400);
  };

  return (
    <button
      type="button"
      onClick={enhanceCopy}
      disabled={isEnhancing}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-indigo-500/15 border border-amber-500/30 hover:border-amber-500/60 text-slate-800 text-[11px] font-extrabold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
      title="Polish copy with AI recruiter generator"
    >
      {isEnhancing ? (
        <span className="flex items-center gap-1.5 text-amber-700">
          <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-amber-600 border-t-transparent" />
          <span>AI Enhancing...</span>
        </span>
      ) : copied ? (
        <span className="flex items-center gap-1 text-emerald-700">
          <Check className="w-3 h-3 text-emerald-600" />
          <span>Polished!</span>
        </span>
      ) : (
        <span className="flex items-center gap-1 text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>✨ Polish with AI</span>
        </span>
      )}
    </button>
  );
}
