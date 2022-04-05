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
  const [items, setItems] = useState(["ITEM1", "ITEM2", "ITEM3"]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | undefined>("");

  function handleArrow(kind: string) {
    if (kind === "ArrowDown") {
      setActiveIndex((activeIndex) => {
        if (activeIndex === null) {
          return 0;
        } else if (activeIndex !== null && activeIndex < items.length - 1) {
          return activeIndex + 1;
        } else {
          return 0;
        }
      });
    } else if (kind === "ArrowUp") {
      setActiveIndex((activeIndex) => {
        if (activeIndex === null || activeIndex === 0) {
          return items.length - 1;
        } else if (activeIndex <= items.length - 1) {
          return activeIndex - 1;
        } else {
          return 0;
        }
      });
    }
    return true;
  }

  const options: noReducerOptions = {
    triggers: [
      { name: "hashtag", trigger: "#" },
      { name: "mention", trigger: "@" },
    ],
    onOpen: ({ view, range, trigger, type }) => true,
    onArrow: ({ view, kind }) => handleArrow(kind),
    onFilter: ({ view, filter }) => {
      setFilter(filter);
      if (filter)
        setItems(
          items.filter((item) =>
            item.toLowerCase().includes(filter.toLowerCase())
          )
        );
      return true;
    },
    onEnter: ({ range, view }) => {
      console.log("ASKLDJASLKDJ");
      const { from, to } = range;
      const tr = view.state.tr
        .deleteRange(from, to) // This is the full selection
        .insertText("You can define this!"); // This can be a node view, or something else!
      view.dispatch(tr);
      return true;
    },
    onClose: ({ view }) => {
      setFilter(undefined);
      return true;
    },
  };
  const initialValue = "<p></p>";
  const [value, setValue] = useState(initialValue);
  return (
    <main className="App">
      <div id="editor">
        <HtmlEditor
          schema={schema}
          plugins={[...autocomplete(options), ...plugins]}
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
