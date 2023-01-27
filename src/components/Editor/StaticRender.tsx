import { Callout, Doc, Heading, RemirrorRenderer, TextHandler } from "@remirror/react";
import { ComponentType } from "react";
import { Link, useParams } from "react-router-dom";
import { RemirrorJSON } from "remirror";

import { removeKeys } from "../../utils/transform";
import BoardMention from "../Mention/BoardMention";
import DocumentMention from "../Mention/DocumentMention";
import MapMention from "../Mention/MapMention";

export type MarkMap = Partial<Record<string, string | ComponentType<any>>>;

const typeMap = (project_id: string, isPublic: boolean): MarkMap => ({
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
        if (type === "documents") {
          return <DocumentMention id={id} isPublic={isPublic} label={label} project_id={project_id} title={label} />;
        }
        if (type === "maps") {
          return <MapMention isPublic={isPublic} nodeId={id} nodeLabel={label} project_id={project_id} />;
        }
        if (type === "boards") {
          return <BoardMention isPublic={isPublic} nodeId={id} nodeLabel={label} project_id={project_id} />;
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
  secret: () => null,
});

const markMap: MarkMap = {
  italic: "em",
  bold: "strong",
  underline: "u",
  link: "a",
};

export default function StaticRender({ content, isPublic = true }: { content: RemirrorJSON; isPublic?: boolean }) {
  const { project_id } = useParams();

  const parsedContent = removeKeys(content, ["style", "resizable"]);
  return (
    <div className="staticRendererContainer">
      <RemirrorRenderer
        json={parsedContent as RemirrorJSON}
        markMap={markMap}
        typeMap={typeMap(project_id as string, isPublic)}
      />
    </div>
  );
}
