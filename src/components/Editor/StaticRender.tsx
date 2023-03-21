import { Callout, Doc, Heading, RemirrorRenderer, TextHandler } from "@remirror/react";
import { ComponentType } from "react";
import { Link, useParams } from "react-router-dom";
import { RemirrorJSON } from "remirror";

import { removeKeys } from "../../utils/transform";
import BoardMention from "../Mention/BoardMention";
import DocumentMention from "../Mention/DocumentMention";
import MapMention from "../Mention/MapMention";
import WordMention from "../Mention/WordMention";

export type MarkMap = Partial<Record<string, string | ComponentType<any>>>;

const typeMap = (project_id: string): MarkMap => ({
  bulletList: "ul",
  doc: Doc,
  hardBreak: "br",
  heading: Heading,
  link: "a",
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
        if (type === "documents") return <DocumentMention id={id} label={label} project_id={project_id} title={label} />;

        if (type === "maps") return <MapMention nodeId={id} nodeLabel={label} project_id={project_id} />;

        if (type === "boards") return <BoardMention nodeId={id} nodeLabel={label} project_id={project_id} />;
        if (type === "words") return <WordMention id={id} label={label} title={label} />;

        return (
          <Link className="font-Lato text-sm font-bold text-white underline" to={`../../${type}/${id}`}>
            {label}
          </Link>
        );
      }
    }
    return null;
  },
  secret: () => null,
});

const markMap: MarkMap = {
  italic: "em",
  bold: "strong",
  underline: "u",
  link: "a",
};

export default function StaticRender({ content }: { content: RemirrorJSON }) {
  const { project_id } = useParams();
  const parsedContent = removeKeys(content, ["style", "resizable"]);
  return (
    <div className="staticRendererContainer">
      <RemirrorRenderer json={parsedContent as RemirrorJSON} markMap={markMap} typeMap={typeMap(project_id as string)} />
    </div>
  );
}
