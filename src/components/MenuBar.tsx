import { useCommands } from "@remirror/react";
import React from "react";

type Props = {};

export default function MenuBar({}: Props) {
  const {
    toggleBold,
    toggleItalic,
    toggleBulletList,
    toggleOrderedList,
    toggleHeading,
    insertImage,
    focus,
  } = useCommands();
  return (
    <div>
      <button
        onClick={() => {
          toggleBold();
          focus();
        }}
      >
        <b>B</b>
      </button>
      <button
        onClick={() => {
          toggleItalic();
          focus();
        }}
      >
        <i>I</i>
      </button>
      <button
        onClick={() => {
          toggleBulletList();
          focus();
        }}
      >
        <span>BL</span>
      </button>
      <button
        onClick={() => {
          toggleOrderedList();
          focus();
        }}
      >
        <span>OL</span>
      </button>
      <button
        onClick={() => {
          insertImage({ src: "https://picsum.photos/200/300" });
          focus();
        }}
      >
        IMG
      </button>
      <select
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
