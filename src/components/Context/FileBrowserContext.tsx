import { createContext, ReactNode, SetStateAction, useState } from "react";
import { ImageProps } from "../../custom-types";

export const FileBrowserContext = createContext<{
  layout: string;
  setLayout: (layout: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  selected: ImageProps[];
  setSelected: (image: SetStateAction<ImageProps[]>) => void;
}>({
  layout: "list",
  setLayout: () => {},
  filter: "",
  setFilter: () => {},
  selected: [],
  setSelected: () => {},
});

export default function FilebrowserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [layout, setLayout] = useState("list");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<ImageProps[]>([]);

  return (
    <FileBrowserContext.Provider
      value={{ layout, setLayout, filter, setFilter, selected, setSelected }}
    >
      {children}
    </FileBrowserContext.Provider>
  );
}
