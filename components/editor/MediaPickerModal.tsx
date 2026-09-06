"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Upload, Image as ImageIcon, Check, Trash2, Link as LinkIcon, Sparkles } from "lucide-react";
import { getCompanyMediaAction, deleteMediaRecordAction } from "@/lib/actions/media";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (url: string, altText?: string) => void;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelectMedia,
  title = "Select or Upload Media Asset",
}: MediaPickerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"upload" | "library" | "url">("upload");
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const data = await getCompanyMediaAction();
      setMediaList(data);
    } catch (e) {
      console.error("Failed to load media library", e);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (isOpen && mounted) {
      fetchLibrary();
      setError(null);
    }
  }, [isOpen, mounted]);

  if (!isOpen || !mounted) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type.startsWith("video/") ? "video" : "image");
    formData.append("altText", altText || file.name);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onSelectMedia(data.url, altText || file.name);
        onClose();
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl.trim()) return;
    onSelectMedia(externalUrl.trim(), altText);
    onClose();
  };

  const handleDeleteMedia = async (id: string) => {
    await deleteMediaRecordAction(id);
    fetchLibrary();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white border border-slate-200/90 rounded-3xl max-w-xl sm:max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 flex-shrink-0 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">{title}</h2>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Upload brand logos, custom photos, or pick from company gallery
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex items-center gap-1.5 px-4 sm:px-5 pt-3 pb-2 border-b border-slate-200/70 flex-shrink-0 bg-white text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === "upload"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("library")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === "library"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media Library ({mediaList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === "url"
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>External URL</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 min-h-0">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD */}
          {tab === "upload" && (
            <div className="space-y-4 py-1">
              <div className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-3xl p-6 sm:p-8 transition-all flex flex-col items-center justify-center space-y-3 cursor-pointer relative bg-slate-50/70 hover:bg-teal-50/40 group hover:scale-[1.005]">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 group-hover:border-teal-400 shadow-xs transition-colors">
                  <Upload className="w-7 h-7 text-teal-700" />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-xs sm:text-sm font-black text-slate-800">
                    Click to browse or drag image file here
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Supports PNG, JPG, WEBP, GIF, SVG (Max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {uploading && (
                <div className="text-xs font-bold text-teal-700 flex items-center justify-center gap-2 py-2 bg-teal-50/60 rounded-xl border border-teal-200">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent" />
                  <span>Uploading logo file to server & saving to database...</span>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <label className="block text-xs font-bold text-slate-700">
                  Alt Text / Accessibility Label (Optional)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Acme Corp Company Logo"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-teal-600 font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LIBRARY */}
          {tab === "library" && (
            <div className="space-y-3">
              {loadingLibrary ? (
                <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2 font-medium">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent" />
                  <span>Loading company media library...</span>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <p className="font-bold text-slate-700">No media assets in database library yet.</p>
                  <p className="text-[11px] text-slate-400">Use the "Upload File" tab to add company logos or photos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaList.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 hover:ring-teal-600 transition-all shadow-2xs"
                      onClick={() => {
                        onSelectMedia(item.url, item.altText || "");
                        onClose();
                      }}
                    >
                      <img src={item.url} alt={item.altText || "Media asset"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                        <span className="text-[10px] font-black uppercase text-white bg-teal-700 px-2.5 py-1 rounded-lg shadow-xs">
                          Select Asset
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMedia(item.id);
                        }}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all cursor-pointer"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXTERNAL URL */}
          {tab === "url" && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Image / SVG / Video URL</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    required
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-teal-600 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Descriptive image caption..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {externalUrl && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Live Preview</span>
                  <div className="h-28 rounded-xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center p-1">
                    <img
                      src={externalUrl}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded-lg"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Use URL Asset
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
