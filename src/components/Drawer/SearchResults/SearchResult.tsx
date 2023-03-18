import { SearchResultType } from "../../../types/generalTypes";

type Props = {
  item: SearchResultType;
};

export default function SearchResult({ item }: Props) {
  return (
    <span className="flex flex-col">
      {"title" in item ? item.title : null}
      {"text" in item ? item?.text || "Map Pin" : null}
      {"label" in item && "source" in item ? item.label || "Edge" : null}
      {"label" in item && !("source" in item) ? item.label || "Node" : null}
      <span className="text-xs">
        {"source" in item ? `(${item.source?.label || "Unnamed node"} - ${item.target?.label || "Unnamed node"})` : null}
        {"text" in item ? `(${item.parent.title})` : null}
      </span>
    </span>
  );
}
