import autocomplete, { Options } from "prosemirror-autocomplete";
import { useEffect, useLayoutEffect, useState } from "react";
import { shift, flip, autoUpdate, inline } from "@floating-ui/react-dom";
import "./App.css";
import { HtmlEditor, Toolbar, Editor } from "@aeaton/react-prosemirror";
import {
  plugins,
  schema,
  toolbar,
} from "@aeaton/react-prosemirror-config-default";
import {
  useFloating,
  useInteractions,
  useListNavigation,
} from "@floating-ui/react-dom-interactions";
type noReducerOptions = Omit<Options, "reducer">;
function App() {
  const items = ["ITEM1", "ITEM2", "ITEM3"];
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
  const { x, y, reference, floating, strategy, update, refs } = useFloating({
    placement: "bottom",
    middleware: [inline(), shift(), flip()],
  });

  const { context } = useFloating();
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useListNavigation(context),
  ]);

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    // Only call this when the floating element is rendered
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  return (
    <main className="App">
      <button
        id="button"
        aria-describedby="tooltip"
        // onMouseEnter={() => {
        //   if (refs.floating.current)
        //     refs.floating.current.style.display = "block";
        // }}
        // onMouseLeave={() => {
        //   if (refs.floating.current)
        //     refs.floating.current.style.display = "none";
        // }}
      >
        My button
      </button>
      <div
        id="tooltip"
        role="tooltip"
        ref={floating}
        style={{
          position: strategy,
          top: y ?? "",
          left: x ?? "",
        }}
      >
        {filter &&
          items.filter((i) => i.toLowerCase().includes(filter.toLowerCase()))}
      </div>
      <div id="editor" ref={reference}>
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
      </div>
    </main>
  );
}

export default App;
