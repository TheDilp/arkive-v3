import RemirrorContext from "./components/RemirrorContext";
import "./App.css";

function App() {
  return (
    <main className="App" style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "80%", display: "flex", justifyContent: "center" }}>
        <RemirrorContext />
      </div>
    </main>
  );
}

export default App;
