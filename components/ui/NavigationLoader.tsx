"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2, Building2 } from "lucide-react";

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  stopNavigation: () => {},
});

export const useNavigationLoader = () => useContext(NavigationContext);

export function NavigationLoaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);

  // Automatically hide loader when path or search params change
  useEffect(() => {
    setIsNavigating(false);
    setShowBackdrop(false);
  }, [pathname, searchParams]);

  // Show backdrop overlay only if navigation takes longer than 120ms (avoids fast flashes on instant cached routes)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isNavigating) {
      timer = setTimeout(() => {
        setShowBackdrop(true);
      }, 120);
    } else {
      setShowBackdrop(false);
    }
    return () => clearTimeout(timer);
  }, [isNavigating]);

  // Intercept click events on internal links across the dashboard
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href && target.href.startsWith(window.location.origin)) {
        const targetUrl = new URL(target.href);
        // Only trigger if navigating to a different route
        if (targetUrl.pathname !== window.location.pathname || targetUrl.search !== window.location.search) {
          if (!target.target || target.target === "_self") {
            setIsNavigating(true);
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        startNavigation: () => setIsNavigating(true),
        stopNavigation: () => setIsNavigating(false),
      }}
    >
      {/* Top Animated Loading Line */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-[#005d52] animate-pulse" />
      )}

      {children}

      {/* Glassmorphic Backdrop Loader Overlay */}
      {showBackdrop && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200/90 shadow-2xl rounded-2xl p-6 flex flex-col items-center gap-3 text-center max-w-xs mx-auto animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#005d52] flex items-center justify-center shadow-inner relative">
              <Loader2 className="w-6 h-6 animate-spin text-[#005d52]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">Switching Page...</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Loading recruiter studio data
              </p>
            </div>
          </div>
        </div>
      )}
    </NavigationContext.Provider>
  );
}
