import { Callout, Doc, Heading, RemirrorRenderer, TextHandler } from "@remirror/react";
import { ComponentType } from "react";
import { Link } from "react-router-dom";
import { RemirrorJSON } from "remirror";

import { removeKeys } from "../../utils/transform";
import BoardMention from "../Mention/BoardMention";
import DocumentMention from "../Mention/DocumentMention";
import MapMention from "../Mention/MapMention";

export type MarkMap = Partial<Record<string, string | ComponentType<any>>>;

const typeMap: MarkMap = {
  bulletList: "ul",
  doc: Doc,
  hardBreak: "br",
  heading: Heading,
  listItem: "li",
  paragraph: "p",
  orderedList: "ol",
  text: TextHandler,
  blockquote: "blockquote",
  callout: Callout,
  horizontalRule: "hr",
  image: "img",
  mentionAtom: (...props: any) => {
    if (props?.[0]?.node) {
      const { attrs } = props[0].node;
      if (attrs) {
        const { id, label, name: type } = attrs;
        if (type === "documents") {
          return <DocumentMention id={id} label={label} title={label} />;
        }
        if (type === "maps") {
          return <MapMention nodeId={id} nodeLabel={label} />;
        }
        if (type === "boards") {
          return <BoardMention nodeId={id} nodeLabel={label} />;
        }
        return (
          <Link className="font-Lato text-sm font-bold text-white underline" to={`../../${type}/${id}`}>
            {label}
          </Link>
        );
      }
    }
    return null;
  },
  secret: (...props: any) => (
    <div className="secretBlock">
      <i className="pi pi-eye slash" />
      {props?.[0] ? props[0].children : null}
    </div>
  ),
};

const markMap: MarkMap = {
  italic: "em",
  bold: "strong",
  underline: "u",
};

export default function StaticRender({ content }: { content: RemirrorJSON }) {
  return (
    <div className="staticRendererContainer">
      <RemirrorRenderer json={removeKeys(content, ["style"]) as RemirrorJSON} markMap={markMap} typeMap={typeMap} />
    </div>
  );
}
