import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(window?.matchMedia(query)?.matches);
  useEffect(
    () => {
      const mediaQuery = window.matchMedia(query);
      // Update the state with the current value
      setMatches(mediaQuery.matches);
      // Create an event listener
      const handler = (event: any) => setMatches(event.matches);
      // Attach the event listener to know when the matches value changes
      mediaQuery.addEventListener("change", handler);
      // Remove the event listener on cleanup
      return () => mediaQuery.removeEventListener("change", handler);
    },
    [query], // Empty array ensures effect is only run on mount and unmount
  );
  return matches;
};

export const useBreakpoint = () => ({
  isXs: useMediaQuery("(max-width: 640px)"),
  isSm: useMediaQuery("(max-width: 768px)"),
  isMd: useMediaQuery("(max-width: 1024px)"),
  isLg: useMediaQuery("(max-width: 1280px)"),
  isXl: useMediaQuery("(min-width: 1281px)"),
});
