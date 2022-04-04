import { useRef, useState } from "react";
import "./App.css";
import { Editor, rootCtx, themeToolCtx, commandsCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { ReactEditor, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import {
  slashPlugin,
  slash,
  createDropdownItem,
  defaultActions,
} from "@milkdown/plugin-slash";
function App() {
  const [value, setValue] = useState("# hello markdown");
  const editor = useEditor(
    (root) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
        })
        .use(nord)
        .use(commonmark)
        .use(slash)
    // .use(
    //   slash.configure(slashPlugin, {
    //     config: (ctx) => {
    //       // Get default slash plugin items
    //       const actions = defaultActions(ctx);

    //       // Define a status builder
    //       return ({ isTopLevel, content, parentNode }) => {
    //         // You can only show something at root level
    //         if (!isTopLevel) return null;

    //         // Empty content ? Set your custom empty placeholder !
    //         if (!content) {
    //           return { placeholder: "Type / to use the slash commands..." };
    //         }

    //         // Define the placeholder & actions (dropdown items) you want to display depending on content
    //         if (content.startsWith("/")) {
    //           // Add some actions depending on your content's parent node
    //           if (parentNode.type.name === "customNode") {
    //             actions.push({
    //               id: "custom",
    //               dom: createDropdownItem(
    //                 ctx.get(themeToolCtx),
    //                 "Custom",
    //                 "h1"
    //               ),
    //               command: () => ctx.get(commandsCtx).call("@"),
    //               keyword: ["mentionLink"],
    //               enable: () => true,
    //             });
    //           }

    //           return content === "/"
    //             ? {
    //                 placeholder: "Type to filter...",
    //                 actions,
    //               }
    //             : {
    //                 actions: actions.filter(({ keyword }) =>
    //                   keyword.some((key) =>
    //                     key.includes(content.slice(1).toLocaleLowerCase())
    //                   )
    //                 ),
    //               };
    //         }
    //       };
    //     },
    //   })
    // )
  );
  return (
    <main className="App">
      <div id="editor">
        <ReactEditor editor={editor} />
      </div>
    </main>
  );
}

export default App;
