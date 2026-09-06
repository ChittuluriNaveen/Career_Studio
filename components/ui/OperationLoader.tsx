"use client";

import React from "react";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";

interface OperationLoaderProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  status?: "loading" | "success" | "error";
  primaryColor?: string;
}

export default function OperationLoader({
  isVisible,
  title = "Saving changes...",
  subtitle = "Please wait a moment while your changes are stored.",
  status = "loading",
  primaryColor = "#0f766e",
}: OperationLoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-slate-800 text-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4 relative overflow-hidden">
        {/* Decorative Top Accent Glow */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />

        {status === "loading" && (
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-400 animate-pulse" />
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 shadow-inner text-emerald-400">
            <CheckCircle2 className="w-8 h-8 animate-in zoom-in-75 duration-300" />
          </div>
        )}

        <div className="space-y-1.5 z-10">
          <h3 className="text-base font-extrabold tracking-tight text-white">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{subtitle}</p>
        </div>

        {/* Pulse Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden z-10">
          <div
            className="h-full rounded-full animate-pulse transition-all duration-300"
            style={{
              backgroundColor: primaryColor,
              width: status === "loading" ? "75%" : "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
