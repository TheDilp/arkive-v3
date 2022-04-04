import { useRef, useState } from "react";
import "./App.css";
function App() {
  const [state, setState] = useState({ text: "", lastWord: "" });
  const [menuState, setMenuState] = useState({ show: false, x: 0, y: 0 });
  const menu = ["ITEM1", "ITEM2", "ITEM3"];
  const inputRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  return (
    <main className="App">
      <div id="editor">
        <div
          contentEditable={true}
          ref={inputRef}
          onChange={(e) =>
            setState({
              text: e.currentTarget.innerText,
              lastWord: e.currentTarget.innerText,
            })
          }
          onKeyDown={(e) => {
            //  Create dropdown menu on slash command in textarea
            if (e.key === "/") {
              const range = window.getSelection()?.getRangeAt(0).cloneRange();
              range?.collapse(true);
              const rect = range?.getClientRects()[0];
              console.log(rect);
              if (rect) setMenuState({ show: true, x: rect?.x, y: rect?.y });
            }

            // if (state.text.)
            // if (e.key === "/") {
            //   setMenuState({ ...menuState, show: true });
            // } else if (e.key === "Space" || e.key === "Enter") {
            //   setState({ ...state, lastWord: "" });
            // }
          }}
        ></div>
        {menuState.show && (
          <ul
            style={{
              position: "absolute",
              top: menuState.y,
              left: menuState.x,
            }}
          >
            {menu.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default App;
