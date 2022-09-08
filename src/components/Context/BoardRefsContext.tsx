import { createContext, MutableRefObject, ReactNode, useRef } from "react";

export const BoardRefsContext = createContext<{
  cyRef: null | MutableRefObject<any>;
  ehRef: null | MutableRefObject<any>;
  grRef: null | MutableRefObject<any>;
  cbRef: null | MutableRefObject<any>;
}>({
  cyRef: null,
  ehRef: null,
  grRef: null,
  cbRef: null,
});

export default function BoardRefsProvider({
  children,
}: {
  children: ReactNode;
}) {

  const cyRef = useRef() as MutableRefObject<any>;
  const ehRef = useRef() as MutableRefObject<any>;
  const grRef = useRef() as MutableRefObject<any>;
  const cbRef = useRef() as MutableRefObject<any>;
  return (
    <BoardRefsContext.Provider value={{ cyRef, ehRef, grRef, cbRef }}>
      {children}
    </BoardRefsContext.Provider>
  );
}
