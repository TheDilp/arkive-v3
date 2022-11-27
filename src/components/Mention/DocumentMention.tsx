import { Card } from "primereact/card";
import { Link } from "react-router-dom";
import { RemirrorJSON } from "remirror";

import Editor from "../../pages/Editor/Editor";
import { toaster } from "../../utils/toast";
import { Tooltip } from "../Tooltip/Tooltip";

type Props = {
  title: string;
  content: RemirrorJSON | undefined;
  id: string | undefined;
  label: string;
  isDisabledTooltip?: boolean;
};

function TooltipContent({ content, title }: Pick<Props, "content" | "title">) {
  return (
    <Card className="overflow-y-auto h-96 w-96" title={<div className="p-0 text-center">{title}</div>}>
      {content ? (
        <div className="whitespace-pre-line">
          <Editor content={content} editable={false} />
        </div>
      ) : null}
    </Card>
  );
}
export default function DocumentMention({ title, content, id, label, isDisabledTooltip }: Props) {
  return id && content ? (
    <Tooltip disabled={isDisabledTooltip ?? false} label={<TooltipContent content={content} title={title} />}>
      <Link className="text-base font-bold text-white font-Lato" id={`link-${id}`} to={`../doc/${id}`}>
        {title || label}
      </Link>
    </Tooltip>
  ) : (
    <button
      className="text-white underline cursor-pointer font-Lato"
      onClick={() => {
        toaster("warning", "Document not found.");
      }}
      type="button">
      {title || label}
    </button>
  );
}
