import { SearchResultType } from "../../../types/generalTypes";

type Props = {
  item: SearchResultType;
};

export default function SearchResult({ item }: Props) {
  let title = "";
  if ("document" in item && item?.document?.title && "title" in item && item?.title)
    title = `${item?.title} (${item?.document?.title})`;
  else if ("title" in item && item?.title) title = item.title;
  else if ("text" in item && item?.text) title = item.text;
  else if ("label" in item && "source" in item) title = item.label || "Edge";
  else if ("label" in item && !("source" in item)) title = item.label || "Node";
  return (
    <span className="flex flex-col text-sm">
      {title}
      <span className="text-xs">
        {"source" in item ? `(${item.source?.label || "Unnamed node"} - ${item.target?.label || "Unnamed node"})` : null}
        {"text" in item ? `(${item.parent.title})` : null}
      </span>
    </span>
  );
}
