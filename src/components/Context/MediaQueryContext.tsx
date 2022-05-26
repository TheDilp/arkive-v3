import { createContext } from "react";
import { useMediaQuery } from "react-responsive";

export const MediaQueryContext = createContext({
  isTabletOrMobile: false,
});

export default function MediaQueryProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <MediaQueryContext.Provider value={{ isTabletOrMobile }}>
      {children}
    </MediaQueryContext.Provider>
  );
}
