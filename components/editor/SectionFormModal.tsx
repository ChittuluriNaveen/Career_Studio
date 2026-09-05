"use client";

import { useState, useEffect } from "react";
import { SectionType } from "@prisma/client";
import { X, Save, Plus, Sparkles } from "lucide-react";
import { addSectionAction, updateSectionContentAction } from "@/lib/actions/sections";

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionToEdit?: any | null;
}

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
  const [ctaText, setCtaText] = useState(sectionToEdit?.content?.ctaText || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sectionToEdit) {
      setType(sectionToEdit.type);
      setTitle(sectionToEdit.title || "");
      setSubtitle(sectionToEdit.content?.subtitle || "");
      setBody(sectionToEdit.content?.body || "");
      setVideoUrl(sectionToEdit.content?.videoUrl || "");
      setCtaText(sectionToEdit.content?.ctaText || "");
    } else {
      setType(SectionType.HERO);
      setTitle("Hero Banner");
      setSubtitle("Join our high-impact team building next-generation products.");
      setBody("");
      setVideoUrl("");
      setCtaText("View Open Positions");
    }
  }, [sectionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const contentPayload: any = {};
    if (subtitle) contentPayload.subtitle = subtitle;
    if (body) contentPayload.body = body;
    if (videoUrl) contentPayload.videoUrl = videoUrl;
    if (ctaText) contentPayload.ctaText = ctaText;

    if (type === SectionType.PERKS_BENEFITS && !sectionToEdit) {
      contentPayload.perks = [
        { icon: "Laptop", title: "Top Equipment", description: "Latest M3 Pro MacBook & 4K monitor setup." },
        { icon: "Heart", title: "Full Health Coverage", description: "100% covered health, dental, and vision insurance." },
        { icon: "Plane", title: "Flexible PTO", description: "Generous paid vacation and wellness days off." },
      ];
    }

    if (type === SectionType.VALUES && !sectionToEdit) {
      contentPayload.values = [
        { title: "Autonomy & Ownership", description: "We trust our teammates to make big decisions." },
        { title: "Velocity with Rigor", description: "We ship quickly while maintaining high standards." },
        { title: "Customer Obsession", description: "Everything starts with user feedback and empathy." },
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">
              {isEditing ? "Edit Section Content" : "Add Section to Careers Canvas"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Section Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as SectionType;
                  setType(newType);
                  if (newType === SectionType.HERO) setTitle("Hero Banner");
                  else if (newType === SectionType.ABOUT_US) setTitle("About Our Company");
                  else if (newType === SectionType.CULTURE_VIDEO) setTitle("Life at Our Company");
                  else if (newType === SectionType.VALUES) setTitle("Our Core Values");
                  else if (newType === SectionType.PERKS_BENEFITS) setTitle("Perks & Benefits");
                  else if (newType === SectionType.OPEN_ROLES) setTitle("Open Roles Grid");
                  else setTitle("Custom Section");
                }}
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={SectionType.HERO}>Hero Banner (Title, Subtitle & Call-to-Action)</option>
                <option value={SectionType.ABOUT_US}>About Us Story (Company Mission & Stats)</option>
                <option value={SectionType.CULTURE_VIDEO}>Culture Video (YouTube Embed & Description)</option>
                <option value={SectionType.VALUES}>Core Values (Principle Cards)</option>
                <option value={SectionType.PERKS_BENEFITS}>Perks & Benefits (Grid Cards)</option>
                <option value={SectionType.OPEN_ROLES}>Open Roles Search & Grid</option>
                <option value={SectionType.CUSTOM_TEXT}>Custom Text Block</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Section Heading Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Life at Acme Corp"
              className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(type === SectionType.HERO || type === SectionType.OPEN_ROLES || type === SectionType.CUSTOM_TEXT) && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Subtitle / Description Text
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Brief summary text for candidates..."
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {(type === SectionType.ABOUT_US || type === SectionType.CUSTOM_TEXT) && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Main Body Story Text
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Detailed text about company history, growth, and team mission..."
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {type === SectionType.CULTURE_VIDEO && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Video Embed URL (YouTube or Vimeo)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {type === SectionType.HERO && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Call-to-Action Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Explore Open Roles"
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? "Save Changes" : "Add Section"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
