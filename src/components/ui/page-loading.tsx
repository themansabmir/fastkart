"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "./loading";

export function PageLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset loading when route changes complete
    setIsLoading(false);
  }, [pathname, searchParams]);

  // This component doesn't show loading by itself - it's controlled by NavigationEvents
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-primary/20">
        <div className="h-full bg-primary animate-pulse" style={{ width: "100%" }}></div>
      </div>
    </div>
  );
}

// Hook to trigger loading state when navigating
export function useNavigationLoading() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const startNavigation = (to: string) => {
    setIsNavigating(true);
    setNavigatingTo(to);
  };

  const endNavigation = () => {
    setIsNavigating(false);
    setNavigatingTo(null);
  };

  return { isNavigating, navigatingTo, startNavigation, endNavigation };
}
