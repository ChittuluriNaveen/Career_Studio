"use client";

import { useState, useEffect } from "react";
import { SectionType } from "@prisma/client";
import {
  X,
  Save,
  Plus,
  Sparkles,
  Info,
  Image as ImageIcon,
  Tv,
  Heart,
  Grid,
  Type,
  Briefcase,
  Megaphone,
} from "lucide-react";
import { addSectionAction, updateSectionContentAction } from "@/lib/actions/sections";
import MediaPickerModal from "@/components/editor/MediaPickerModal";

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionToEdit?: any | null;
}

const SECTION_LIBRARY_CONFIG = [
  { type: SectionType.HERO, title: "Hero Banner", description: "Main page headline, background image/video, & call-to-action buttons", icon: Sparkles, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { type: SectionType.ABOUT_US, title: "About Us Story", description: "Company mission narrative, key stats, & optional image", icon: Info, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { type: SectionType.IMAGE_TEXT, title: "Image + Text Feature", description: "Split layout showcasing team photos, office culture, or product", icon: ImageIcon, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { type: SectionType.CULTURE_VIDEO, title: "Culture Video", description: "YouTube/Vimeo embed showing day-in-the-life team culture", icon: Tv, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { type: SectionType.VALUES, title: "Core Values", description: "Numbered principle cards highlighting company ethics & culture", icon: Heart, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { type: SectionType.PERKS_BENEFITS, title: "Perks & Benefits", description: "Grid cards detailing health coverage, equipment, PTO, & bonuses", icon: Sparkles, color: "text-pink-600 bg-pink-50 border-pink-200" },
  { type: SectionType.GALLERY, title: "Image Gallery", description: "Multi-photo grid/carousel of office life and team events", icon: Grid, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  { type: SectionType.CUSTOM_TEXT, title: "Custom Content Block", description: "Flexible markdown/text block for custom announcements", icon: Type, color: "text-slate-600 bg-slate-100 border-slate-200" },
  { type: SectionType.OPEN_ROLES, title: "Open Positions Grid", description: "Dynamic search & filter grid connected to real job requisitions", icon: Briefcase, color: "text-teal-600 bg-teal-50 border-teal-200" },
  { type: SectionType.CTA, title: "Call to Action (CTA)", description: "High-visibility banner encouraging candidates to apply", icon: Megaphone, color: "text-orange-600 bg-orange-50 border-orange-200" },
];

export default function SectionFormModal({
  isOpen,
  onClose,
  sectionToEdit,
}: SectionFormModalProps) {
  const isEditing = !!sectionToEdit;

  const [type, setType] = useState<SectionType>(sectionToEdit?.type || SectionType.HERO);
  const [title, setTitle] = useState(sectionToEdit?.title || "");
  const [subtitle, setSubtitle] = useState(sectionToEdit?.content?.subtitle || "");
  const [body, setBody] = useState(sectionToEdit?.content?.body || "");
  const [videoUrl, setVideoUrl] = useState(sectionToEdit?.content?.videoUrl || "");
  const [imageUrl, setImageUrl] = useState(sectionToEdit?.content?.imageUrl || sectionToEdit?.content?.backgroundImage || "");
  const [ctaText, setCtaText] = useState(sectionToEdit?.content?.ctaText || "");
  const [ctaLink, setCtaLink] = useState(sectionToEdit?.content?.primaryCtaLink || sectionToEdit?.content?.ctaLink || "");
  const [imagePosition, setImagePosition] = useState<"left" | "right">(sectionToEdit?.content?.imagePosition || "right");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    if (sectionToEdit) {
      setType(sectionToEdit.type);
      setTitle(sectionToEdit.title || "");
      setSubtitle(sectionToEdit.content?.subtitle || "");
      setBody(sectionToEdit.content?.body || "");
      setVideoUrl(sectionToEdit.content?.videoUrl || "");
      setImageUrl(sectionToEdit.content?.imageUrl || sectionToEdit.content?.backgroundImage || "");
      setCtaText(sectionToEdit.content?.ctaText || "");
      setCtaLink(sectionToEdit.content?.primaryCtaLink || sectionToEdit.content?.ctaLink || "");
      setImagePosition(sectionToEdit.content?.imagePosition || "right");
    } else {
      setType(SectionType.HERO);
      setTitle("Hero Banner");
      setSubtitle("Join our high-impact team building next-generation products.");
      setBody("");
      setVideoUrl("");
      setImageUrl("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80");
      setCtaText("Explore Open Roles");
      setCtaLink("#open-positions");
      setImagePosition("right");
    }
  }, [sectionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSelectType = (selectedType: SectionType) => {
    setType(selectedType);
    const config = SECTION_LIBRARY_CONFIG.find((s) => s.type === selectedType);
    if (config) {
      setTitle(config.title);
      if (selectedType === SectionType.HERO) setCtaText("Explore Open Roles");
      else if (selectedType === SectionType.CTA) setCtaText("Join Our Team Today");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const contentPayload: any = { ...(sectionToEdit?.content || {}) };
    if (subtitle) contentPayload.subtitle = subtitle;
    if (body) contentPayload.body = body;
    if (videoUrl) contentPayload.videoUrl = videoUrl;
    if (imageUrl) {
      contentPayload.imageUrl = imageUrl;
      contentPayload.backgroundImage = imageUrl;
    }
    if (ctaText) contentPayload.ctaText = ctaText;
    if (ctaLink) {
      contentPayload.ctaLink = ctaLink;
      contentPayload.primaryCtaLink = ctaLink;
    }
    if (type === SectionType.IMAGE_TEXT) {
      contentPayload.imagePosition = imagePosition;
    }

    // Default payloads for grid section types if creating fresh
    if (type === SectionType.PERKS_BENEFITS && !sectionToEdit?.content?.perks) {
      contentPayload.perks = [
        { icon: "Laptop", title: "Latest Hardware", description: "Top-tier MacBook Pro & $1,500 home office setup stipend." },
        { icon: "Heart", title: "Comprehensive Health", description: "100% premium coverage for medical, dental, and vision." },
        { icon: "Plane", title: "Flexible PTO", description: "Unlimited PTO with 4 weeks recommended minimum." },
        { icon: "GraduationCap", title: "Learning Budget", description: "$2,500 annual allowance for courses & conferences." },
      ];
    }

    if (type === SectionType.VALUES && !sectionToEdit?.content?.values) {
      contentPayload.values = [
        { title: "Autonomy & Ownership", description: "We trust our teammates to make high-impact decisions." },
        { title: "Velocity with Rigor", description: "We ship rapidly while maintaining exceptional quality standards." },
        { title: "Customer Obsession", description: "Everything starts with candidate and recruiter empathy." },
      ];
    }

    if (type === SectionType.GALLERY && !sectionToEdit?.content?.images) {
      contentPayload.images = [
        { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80", caption: "Team Hackathon Event" },
        { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80", caption: "San Francisco Office Lounge" },
        { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80", caption: "Annual Team Retreat" },
      ];
    }

    let res;
    if (isEditing) {
      res = await updateSectionContentAction({
        id: sectionToEdit.id,
        title,
        content: contentPayload,
      });
    } else {
      res = await addSectionAction({
        type,
        title,
        content: contentPayload,
      });
    }

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Failed to save section");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-700" />
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `Edit Section: ${title || type}` : "Add Section to Careers Page Library"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Section Type Library Selection (if creating new) */}
          {!isEditing && (
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Select Section Type (MVP Library)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {SECTION_LIBRARY_CONFIG.map((item) => {
                  const Icon = item.icon;
                  const isSelected = type === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => handleSelectType(item.type)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? "bg-teal-50 border-teal-600 ring-2 ring-teal-600/20 shadow-2xs"
                          : "bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className={`p-2 rounded-xl border flex-shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-900 block truncate">{item.title}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{item.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Title / Heading</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Life at Acme Corp"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {(type === SectionType.HERO || type === SectionType.OPEN_ROLES || type === SectionType.CTA || type === SectionType.IMAGE_TEXT) && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Summary Text</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Brief introduction or tagline for candidates..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-teal-600"
                />
              </div>
            )}

            {(type === SectionType.ABOUT_US || type === SectionType.CUSTOM_TEXT || type === SectionType.IMAGE_TEXT) && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Body Story Text</label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Detailed paragraph narrative describing company history, mission, or culture..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-teal-600"
                />
              </div>
            )}

            {/* Media Upload / Selection Trigger for Image / Banner / Video Poster */}
            {(type === SectionType.HERO || type === SectionType.IMAGE_TEXT || type === SectionType.CTA || type === SectionType.ABOUT_US) && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Section Feature Image / Banner</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4 h-4 text-teal-700" />
                    <span>Browse Media</span>
                  </button>
                </div>

                {imageUrl && (
                  <div className="relative h-24 w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                    <img src={imageUrl} alt="Feature preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {type === SectionType.IMAGE_TEXT && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image Placement</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setImagePosition("left")}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      imagePosition === "left" ? "bg-teal-800 text-white border-teal-800 shadow-xs" : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Image Left / Text Right
                  </button>
                  <button
                    type="button"
                    onClick={() => setImagePosition("right")}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                      imagePosition === "right" ? "bg-teal-800 text-white border-teal-800 shadow-xs" : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Image Right / Text Left
                  </button>
                </div>
              </div>
            )}

            {type === SectionType.CULTURE_VIDEO && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Culture Video Embed URL (YouTube or Vimeo)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:ring-2 focus:ring-teal-600"
                />
              </div>
            )}

            {(type === SectionType.HERO || type === SectionType.CTA || type === SectionType.IMAGE_TEXT) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Explore Open Roles"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Target Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="#open-positions"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
              >
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? "Save Section Changes" : "Add Section to Canvas"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Media Picker Submodal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectMedia={(url) => {
          setImageUrl(url);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
}
