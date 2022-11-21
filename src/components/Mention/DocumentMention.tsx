import { RemirrorRenderer } from "@remirror/react";
import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import { RemirrorJSON } from "remirror";
import { markMap, typeMap } from "../../utils/EditorExtensions";
import { toaster } from "../../utils/toast";
import Editor from "../../pages/Editor/Editor";
import { Tooltip } from "../Tooltip/Tooltip";
type Props = {
  title: string;
  content: RemirrorJSON | undefined;
  id: string | undefined;
  label: string;
  disableTooltip?: boolean;
};
export default function DocumentMention({ title, content, id, label, disableTooltip }: Props) {
  return id && content ? (
    <Tooltip disabled={disableTooltip ?? false} label={<TooltipContent title={title} content={content} />}>
      <Link className="text-base font-bold text-white font-Lato" id={`link-${id}`} to={`../doc/${id}`}>
        {title || label}
      </Link>
    </Tooltip>
  ) : (
    <span
      className="text-white underline cursor-pointer font-Lato"
      onClick={() => {
        toaster("warning", "Document not found.");
      }}>
      {title || label}
    </span>
  );
}

const TooltipContent = ({ content, title }: Pick<Props, "content" | "title">) => {
  console.log(content);

  return (
    <Card title={<div className="p-0 text-center">{title}</div>} className="overflow-y-auto w-96 h-96">
      {content ? (
        <div className="whitespace-pre-line">
          <Editor content={content} editable={false} />
        </div>
      ) : null}
    </Card>
  );
};
