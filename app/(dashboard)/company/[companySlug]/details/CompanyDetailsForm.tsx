"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save, Upload, CheckCircle2 } from "lucide-react";
import { updateCompanyDetailsAction } from "@/lib/actions/brand";

interface CompanyDetailsFormProps {
  company: any;
}

export default function CompanyDetailsForm({ company }: CompanyDetailsFormProps) {
  const router = useRouter();

  const [name, setName] = useState(company.name || "");
  const [website, setWebsite] = useState(company.website || "");
  const [industry, setIndustry] = useState(company.industry || "");
  const [companySize, setCompanySize] = useState(company.companySize || "");
  const [location, setLocation] = useState(company.location || "");
  const [description, setDescription] = useState(company.description || "");
  const [logoUrl, setLogoUrl] = useState(company.logoUrl || "");
  const [bannerUrl, setBannerUrl] = useState(company.bannerUrl || "");
  const [cultureVideoUrl, setCultureVideoUrl] = useState(company.cultureVideoUrl || "");
  const [primaryColor, setPrimaryColor] = useState(company.primaryColor || "#005d52");
  const [secondaryColor, setSecondaryColor] = useState(company.secondaryColor || "#0d9488");

  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "logoUrl" | "bannerUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(targetField);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        if (targetField === "logoUrl") setLogoUrl(data.url);
        if (targetField === "bannerUrl") setBannerUrl(data.url);
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMessage({ type: "error", text: "Company name is required" });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const res = await updateCompanyDetailsAction({
      name: name.trim(),
      website: website.trim() || undefined,
      industry: industry.trim() || undefined,
      companySize: companySize.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      cultureVideoUrl: cultureVideoUrl.trim() || undefined,
      primaryColor,
      secondaryColor,
    });

    setLoading(false);

    if (res.success) {
      setStatusMessage({ type: "success", text: "Company profile & branding updated successfully!" });
      router.refresh();
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to update company details" });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <Building2 className="w-8 h-8 text-[#005d52]" />
        <div>
          <h1 className="text-2xl font-black text-slate-900">Company Profile & Branding</h1>
          <p className="text-xs text-slate-600">
            Configure core company details, logos, media assets, and theme colors used across your Careers Page and job portal.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6 shadow-2xs">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-[#005d52] uppercase tracking-wider pb-2 border-b border-slate-100">
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800">Company Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005d52] font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">Company Slug (URL identifier)</label>
              <input
                type="text"
                disabled
                value={company.slug}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-mono"
              />
              <p className="text-[11px] text-slate-400">Public path: /{company.slug}/careers</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">Official Website URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005d52]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">Industry</label>
              <input
                type="text"
                placeholder="e.g. Software & Technology"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005d52]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">Company Size</label>
              <input
                type="text"
                placeholder="e.g. 50-200 employees"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005d52]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800">Headquarters Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA (or Remote-First)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005d52]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800">Company Overview / Description</label>
              <textarea
                rows={4}
                placeholder="Tell candidates about your company mission, culture, and achievements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005d52]"
              />
            </div>
          </div>
        </div>

        {/* Media & Branding Assets */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-extrabold text-[#005d52] uppercase tracking-wider pb-2 border-b border-slate-100">
            Media & Visual Assets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">Company Logo Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or upload below"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "logoUrl")}
                    className="hidden"
                  />
                </label>
              </div>
              {logoUrl && (
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center w-24 h-16 overflow-hidden">
                  <img src={logoUrl} alt="Company Logo" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>

            {/* Banner */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">Hero Banner Cover Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or upload below"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "bannerUrl")}
                    className="hidden"
                  />
                </label>
              </div>
              {bannerUrl && (
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center w-full h-16 overflow-hidden">
                  <img src={bannerUrl} alt="Banner Preview" className="h-full w-full object-cover rounded-lg" />
                </div>
              )}
            </div>

            {/* Culture Video */}
            <div className="space-y-2 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800">Culture Video Embed URL (YouTube / Vimeo / MP4)</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={cultureVideoUrl}
                onChange={(e) => setCultureVideoUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Theme Colors */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-extrabold text-[#005d52] uppercase tracking-wider pb-2 border-b border-slate-100">
            Brand Theme Colors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer bg-white p-1"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">Secondary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer bg-white p-1"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#005d52] hover:bg-[#004a41] text-white rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Company Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
