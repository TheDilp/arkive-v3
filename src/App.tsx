import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkAutoComplete from "@editorjs/link-autocomplete";
import ContentAlignmentTool from "editorjs-text-alignment-blocktune";
function App() {
  const editorRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [editor, setEditor] = useState<EditorJS | null>(null);

  useEffect(() => {
    if (editorRef && editorRef.current) {
      if (!editor)
        setEditor(
          new EditorJS({
            holder: editorRef.current,
            tools: {
              header: { class: Header, tunes: ["anyTuneName"] },
              linkTool: {
                class: LinkAutoComplete,
                tunes: ["anyTuneName"],
                config: {
                  // endpoint: "youtube.com", // Your backend endpoint for url data fetching,
                },
              },
              anyTuneName: {
                class: ContentAlignmentTool,
                config: {
                  default: "left",
                  blocks: {
                    header: "left",
                    list: "left",
                  },
                },
              },
            },
          })
        );
    }
    return () => {
      if (editor) editor.destroy();
    };
  }, [editorRef.current]);

  return (
    <main className="App">
      <div id="editor" ref={editorRef}></div>
    </main>
  );
}

export default App;
