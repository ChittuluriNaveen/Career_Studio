"use client";

import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Check, Trash2, Link as LinkIcon } from "lucide-react";
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
  const [tab, setTab] = useState<"upload" | "library" | "url">("upload");
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    if (isOpen) {
      fetchLibrary();
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-teal-700" />
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
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

        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === "upload" ? "bg-teal-800 text-white shadow-xs" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setTab("library")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === "library" ? "bg-teal-800 text-white shadow-xs" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            Media Library ({mediaList.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === "url" ? "bg-teal-800 text-white shadow-xs" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            External URL
          </button>
        </div>

        {/* TAB 1: UPLOAD */}
        {tab === "upload" && (
          <div className="space-y-4 text-center py-6">
            <div className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl p-8 transition-colors flex flex-col items-center justify-center space-y-3 cursor-pointer relative bg-slate-50/50">
              <Upload className="w-10 h-10 text-slate-400" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700">Click or drag image file here to upload</p>
                <p className="text-[11px] text-slate-400">PNG, JPG, WEBP, GIF, SVG (Max 10MB)</p>
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
              <div className="text-xs font-bold text-teal-700 flex items-center justify-center gap-2">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent" />
                <span>Uploading asset to server...</span>
              </div>
            )}

            <div>
              <label className="block text-left text-xs font-bold text-slate-600 mb-1">Alt Text (Accessibility)</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descriptive caption for screen readers..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        )}

        {/* TAB 2: LIBRARY */}
        {tab === "library" && (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {loadingLibrary ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading library assets...</div>
            ) : mediaList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No media uploaded yet. Use the Upload tab to add files.</div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 hover:ring-teal-600 transition-all"
                    onClick={() => {
                      onSelectMedia(item.url, item.altText || "");
                      onClose();
                    }}
                  >
                    <img src={item.url} alt={item.altText || "Media asset"} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMedia(item.id);
                      }}
                      className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
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
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Image / Video URL</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  required
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Alt Text (Accessibility)</label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descriptive image caption..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {externalUrl && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Image Preview</span>
                <img src={externalUrl} alt="Preview" className="h-28 object-cover rounded-lg border border-slate-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs"
              >
                Use URL Asset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
