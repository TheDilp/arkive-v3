import { useState } from "react";
import "./App.css";
function App() {
  const [state, setState] = useState("");
  const [menuState, setMenuState] = useState({ show: false, x: 0, y: 0 });
  const menu = ["ITEM1", "ITEM2", "ITEM3"];
  return (
    <main className="App">
      <div id="editor">
        <textarea
          value={state}
          onChange={(e) => setState(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "/") {
              console.log(e.currentTarget.selectionStart);
              // setMenuState({show: true, })
            }
          }}
        ></textarea>
        {menuState.show && (
          <ul>
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
