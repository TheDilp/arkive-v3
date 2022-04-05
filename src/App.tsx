import { HtmlEditor } from "@aeaton/react-prosemirror";
import { plugins, schema } from "@aeaton/react-prosemirror-config-default";
import autocomplete, { Options } from "prosemirror-autocomplete";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import CustomEditor from "./components/Editor/CustomEditor";
import { mockItem } from "./customTypes";
function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [mockData, setMockData] = useState<mockItem[]>([]);
  const [filter, setFilter] = useState<string | undefined>("");
  const [filteredData, setFilteredData] = useState<mockItem[]>([]);
  const selectedRef = useRef(0);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => {
        setMockData(json);
        setFilteredData(json);
      });
  }, []);

  function handleArrow(kind: string) {
    if (kind === "ArrowDown") {
      if (activeIndex <= filteredData.length - 1) {
        setActiveIndex((activeIndex) => activeIndex + 1);
      } else {
        setActiveIndex(0);
      }
    }
    return true;
  }
  type noReducerOptions = Omit<Options, "reducer">;
  const suggestionsRef = useRef() as React.MutableRefObject<HTMLUListElement>;
  const options: noReducerOptions = {
    triggers: [
      { name: "hashtag", trigger: "#" },
      { name: "mention", trigger: "@" },
    ],
    onOpen: ({ view, range, trigger, type }) => true,
    onArrow: ({ view, kind }) => handleArrow(kind),
    onEnter: ({ view, range, trigger, type }) => {
      const { from, to } = range;
      const tr = view.state.tr
        .deleteRange(from, to) // This is the full selection
        .insertText(filteredData[selectedRef.current].title); // This can be a node view, or something else!
      view.dispatch(tr);
      return true;
    },
    onFilter: ({ view, filter }) => {
      setFilter(filter);
      return true;
    },
    onClose: ({ view }) => {
      setFilter(undefined);
      return true;
    },
  };

  useEffect(() => {
    if (activeIndex) selectedRef.current = activeIndex;
  }, [activeIndex]);

  const initialValue = "<p></p>";
  const [value, setValue] = useState(initialValue);
  return (
    <main className="App">
      <div id="editor">
        {mockData.length > 0 && filteredData.length > 0 && (
          <HtmlEditor
            schema={schema}
            plugins={[...autocomplete(options), ...plugins]}
            value={initialValue}
            handleChange={setValue}
            debounce={250}
          >
            <CustomEditor
              activeIndex={activeIndex}
              filter={filter}
              filteredData={filteredData}
              setFilteredData={setFilteredData}
              setFilter={setFilter}
              setMockData={setMockData}
              suggestionsRef={suggestionsRef}
            />
          </HtmlEditor>
        )}
      </div>
    </main>
  );
}

export default App;
