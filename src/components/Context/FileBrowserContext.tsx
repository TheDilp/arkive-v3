import {
  createContext,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { ImageProps } from "../../custom-types";
interface FileBrowserContextState {
  layout: string;
  setLayout: (layout: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  selected: ImageProps[];
  setSelected: (image: SetStateAction<ImageProps[]>) => void;
  tableRef: any;
}
export const FileBrowserContext = createContext<FileBrowserContextState>({
  layout: "list",
  setLayout: () => {},
  filter: "",
  setFilter: () => {},
  selected: [],
  setSelected: () => {},
  tableRef: null,
});

export default function FilebrowserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [layout, setLayout] = useState("list");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<ImageProps[]>([]);
  const tableRef = useRef() as any;
  return (
    <FileBrowserContext.Provider
      value={{
        layout,
        setLayout,
        filter,
        setFilter,
        selected,
        setSelected,
        tableRef,
      }}
    >
      {children}
    </FileBrowserContext.Provider>
  );
}
