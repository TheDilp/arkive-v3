import { useActive, useCommands } from "@remirror/react";
import "../styles/MenuBar.css";

export default function MenuBar() {
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBulletList,
    toggleOrderedList,
    toggleHeading,
    toggleCallout,
    insertHorizontalRule,
    updateLink,
    insertImage,
    focus,
  } = useCommands();
  const active = useActive();
  return (
    <div className="menuBar">
      <div className="menuBarGroup">
        <button
          className="menuBarButton"
          onClick={() => {
            toggleBold();
            focus();
          }}
        >
          <b>B</b>
        </button>
        <button
          className={`menuBarButton ${
            active.italic() ? "menuBarButtonActive" : ""
          }`}
          onClick={() => {
            toggleItalic();
            focus();
          }}
        >
          <i>I</i>
        </button>
        <button
          className="menuBarButton"
          onClick={() => {
            toggleUnderline();
            focus();
          }}
        >
          <s>U</s>
        </button>
      </div>
      <div className="menuBarGroup">
        <button
          className="menuBarButton"
          onClick={() => {
            toggleBulletList();
            focus();
          }}
        >
          <span>BL</span>
        </button>
        <button
          className="menuBarButton"
          onClick={() => {
            toggleOrderedList();
            focus();
          }}
        >
          <span>OL</span>
        </button>
      </div>
      <button
        className="menuBarButton"
        onClick={() => {
          insertImage({ src: "https://picsum.photos/200/300" });
          focus();
        }}
      >
        IMG
      </button>
      <button
        className="menuBarButton"
        onClick={() => {
          insertHorizontalRule();
          focus();
        }}
      >
        ---
      </button>
      <button
        className="menuBarButton"
        onClick={() => {
          updateLink({ href: "https://remirror.io" });
          focus();
        }}
      >
        LINK
      </button>
      <button
        className="menuBarButton"
        onClick={() => {
          toggleCallout({ type: "warning" });
        }}
      >
        !
      </button>
      <select
        className="menuBarButton"
        onChange={(e) => {
          let level = parseInt(e.target.value);
          toggleHeading({ level });
          focus();
        }}
      >
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
        <option value={4}>H4</option>
        <option value={5}>H5</option>
        <option value={6}>H6</option>
      </select>
    </div>
  );
}
