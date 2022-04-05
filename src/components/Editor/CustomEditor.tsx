import { Editor, Toolbar } from "@aeaton/react-prosemirror";
import { toolbar } from "@aeaton/react-prosemirror-config-default";
import { useState } from "react";
import { mockItem } from "../../customTypes";
import { useEditorView } from "@aeaton/react-prosemirror";
type Props = {
  activeIndex: number;
  filter: string | undefined;
  filteredData: mockItem[];
  setMockData: (mockData: mockItem[]) => void;
  setFilteredData: (filteredData: mockItem[]) => void;
  setFilter: (filter: string | undefined) => void;
  suggestionsRef: React.MutableRefObject<HTMLUListElement>;
};

export default function CustomEditor({
  activeIndex,
  filter,
  filteredData,
  setFilter,
  setFilteredData,
  setMockData,
  suggestionsRef,
}: Props) {
  const view = useEditorView();
  return (
    <div>
      <Toolbar toolbar={toolbar} />
      <Editor autoFocus />

      {filter && (
        <ul id="suggestion" ref={suggestionsRef}>
          {filteredData.map((item: mockItem, index) => (
            <li
              key={index}
              className="suggestion-item"
              style={{
                backgroundColor:
                  activeIndex === index ? "lightblue" : "lightgreen",
              }}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
