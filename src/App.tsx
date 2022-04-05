import { Editor, HtmlEditor, Toolbar } from "@aeaton/react-prosemirror";
import {
  plugins,
  schema,
  toolbar,
} from "@aeaton/react-prosemirror-config-default";
import autocomplete, { Options } from "prosemirror-autocomplete";
import { useState } from "react";
import "./App.css";
type noReducerOptions = Omit<Options, "reducer">;
function App() {
  const items = ["ITEM1", "ITEM2", "ITEM3"];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | undefined>("");
  const options: noReducerOptions = {
    triggers: [
      { name: "hashtag", trigger: "#" },
      { name: "mention", trigger: "@" },
    ],
    onOpen: ({ view, range, trigger, type }) => true,
    onArrow: ({ view, kind }) => true,
    onFilter: ({ view, filter }) => {
      setFilter(filter);
      console.log(filter);
      return true;
    },
    // onEnter: ({ view }) => handleSelect(),
    onClose: ({ view }) => {
      setFilter(undefined);
      return true;
    },
  };
  const initialValue = "<p></p>";
  const [value, setValue] = useState(initialValue);
  return (
    <main className="App">
      <div
        id="editor"
        onKeyDown={(e) => {
          if (filter) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (activeIndex === null) {
                setActiveIndex(0);
              } else if (
                activeIndex !== null &&
                activeIndex < items.length - 1
              ) {
                setActiveIndex(activeIndex + 1);
              } else if (activeIndex === items.length - 1) {
                setActiveIndex(0);
              }
            }
          }
        }}
      >
        <HtmlEditor
          schema={schema}
          plugins={[...plugins, ...autocomplete(options)]}
          value={initialValue}
          handleChange={setValue}
          debounce={250}
        >
          <Toolbar toolbar={toolbar} />
          <Editor autoFocus />
        </HtmlEditor>
        {filter && (
          <div id="suggestion">
            {items
              .filter((item) =>
                item.toLowerCase().includes(filter.toLowerCase())
              )
              .map((item, index) => (
                <div
                  style={{
                    backgroundColor: activeIndex === index ? "green" : "blue",
                  }}
                >
                  {item}
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
