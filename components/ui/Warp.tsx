"use client";

import { useUniverse } from "@/lib/store";

/**
 * A full-screen fade that covers the jump between the universe and a project
 * page. It lives in the root layout, so it stays on screen while the route changes.
 */
export function Warp() {
  const warp = useUniverse((s) => s.warp);
  return <div className="warp" data-on={warp} aria-hidden />;
}
