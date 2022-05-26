import { createContext } from "react";
import { useMediaQuery } from "react-responsive";

export const MediaQueryContext = createContext({
  isTabletOrMobile: false,
  isLaptop: false,
});

export default function MediaQueryProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isLaptop = useMediaQuery({ query: "(max-width: 1440px)" });
  return (
    <MediaQueryContext.Provider value={{ isTabletOrMobile, isLaptop }}>
      {children}
    </MediaQueryContext.Provider>
  );
}
