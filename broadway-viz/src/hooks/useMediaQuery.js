import { useState, useEffect } from 'react';

/**
 * Returns true when the media query matches. Used to disable immersive
 * cursor/parallax on touch devices and small screens for battery and performance.
 */
export function useMediaQuery(query) {
  const [match, setMatch] = useState(
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia(query);
    setMatch(m.matches);
    const handler = () => setMatch(m.matches);
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, [query]);

  return match;
}

/** Desktop/trackpad: has hover and precise pointer. Disable baton cursor & heavy parallax on touch. */
export function useIsDesktop() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
