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
    updateCallout,
    insertHorizontalRule,
    updateLink,
    insertImage,
    focus,
  } = useCommands();
  const active = useActive();

  function calloutToggle(type: string) {
    if (active.callout()) {
      if (!active.callout({ type })) {
        updateCallout({ type });
      } else if (active.callout({ type })) {
        toggleCallout({ type });
      }
    } else {
      toggleCallout({ type });
    }
  }

  return (
    <div className="menuBar">
      <div className="menuBarGroup">
        <button
          className={`menuBarButton ${
            active.bold() ? "menuBarButtonActive" : ""
          }`}
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
          className={`menuBarButton ${
            active.underline() ? "menuBarButtonActive" : ""
          }`}
          onClick={() => {
            toggleUnderline();
            focus();
          }}
        >
          <s>U</s>
        </button>
      </div>
      <div className="menuBarGroup">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            className={`menuBarButton ${
              active.heading({ level }) ? "menuBarButtonActive" : ""
            }`}
            onClick={() => {
              toggleHeading({ level });
              focus();
            }}
          >
            {`H${level}`}
          </button>
        ))}
      </div>
      <div className="menuBarGroup">
        <button
          className={`menuBarButton ${
            active.bulletList() ? "menuBarButtonActive" : ""
          }`}
          onClick={() => {
            toggleBulletList();
            focus();
          }}
        >
          <span>BL</span>
        </button>
        <button
          className={`menuBarButton ${
            active.orderedList() ? "menuBarButtonActive" : ""
          }`}
          onClick={() => {
            toggleOrderedList();
            focus();
          }}
        >
          <span>OL</span>
        </button>
      </div>

      <div className="menuBarGroup">
        <span className="calloutContainer">
          <span>CL</span>
          <div className="calloutMenu">
            <div
              className="calloutOption calloutInfo"
              onClick={() => {
                calloutToggle("info");
                focus();
              }}
            >
              Info
            </div>
            <div
              className="calloutOption calloutWarning"
              onClick={() => {
                calloutToggle("warning");
                focus();
              }}
            >
              Warning
            </div>
            <div
              className="calloutOption calloutSuccess"
              onClick={() => {
                calloutToggle("success");
                focus();
              }}
            >
              Success
            </div>
            <div
              className={`calloutOption calloutError ${active.callout({
                type: "error",
              })}`}
              onClick={() => {
                calloutToggle("error");
                focus();
              }}
            >
              Error
            </div>
          </div>
        </span>

        <button
          className={`menuBarButton ${
            active.image() ? "menuBarButtonActive" : ""
          }`}
          onClick={() => {
            insertImage({ src: "https://picsum.photos/200/300" });
            focus();
          }}
        >
          IMG
        </button>
        <button
          className={`menuBarButton ${
            active.horizontalRule() ? "menuBarButtonActive" : ""
          }`}
          onClick={() => {
            insertHorizontalRule();
            focus();
          }}
        >
          ---
        </button>
        <button
          className={`menuBarButton ${
            active.link() ? "menuBarButtonActive" : ""
          }`}
          onClick={() => {
            updateLink({ href: "https://remirror.io" });
            focus();
          }}
        >
          LINK
        </button>
      </div>
    </div>
  );
}
