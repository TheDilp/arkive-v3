import { RemirrorRenderer } from "@remirror/react";
import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import { RemirrorJSON } from "remirror";
import { markMap, typeMap } from "../../utils/EditorExtensions";
import { toaster } from "../../utils/toast";
import { Tooltip } from "../Tooltip/Tooltip";
type Props = {
  title: string;
  content: RemirrorJSON | undefined;
  id: string | undefined;
  label: string;
  disableTooltip?: boolean;
};
export default function DocumentMention({
  title,
  content,
  id,
  label,
  disableTooltip,
}: Props) {
  return id && content ? (
    <Tooltip
      disabled={disableTooltip ?? false}
      label={<TooltipContent title={title} content={content} />}>
      <Link
        className="font-Lato text-white fontWeight700 text-base"
        id={`link-${id}`}
        to={`../doc/${id}`}>
        {title || label}
      </Link>
    </Tooltip>
  ) : (
    <span
      className="font-Lato text-white underline cursor-pointer"
      onClick={() => {
        toaster("warning", "Document not found.");
      }}>
      {title || label}
    </span>
  );
}

const TooltipContent = ({
  content,
  title,
}: Pick<Props, "content" | "title">) => {
  return (
    <Card
      title={<div className="text-center p-0">{title}</div>}
      className="w-96 h-96 overflow-y-scroll">
      {content ? (
        <p className="whitespace-pre-line">
          <RemirrorRenderer
            json={content}
            typeMap={typeMap}
            markMap={markMap}
            skipUnknownMarks
            skipUnknownTypes
          />
        </p>
      ) : null}
    </Card>
  );
};
