import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";

type Props = {
  nodeId: string | undefined;
  nodeLabel: string;
  title?: string;
  project_id: string | undefined;
};
export default function BoardMention({ title, nodeId, nodeLabel, project_id }: Props) {
  return nodeId ? (
    <Link
      className="inline-flex font-Lato text-sm font-bold text-white underline transition-colors hover:text-sky-400"
      id={`link-${nodeId}`}
      to={!project_id ? `/view/boards/${nodeId}` : `/project/${project_id}/boards/${nodeId}`}>
      <Icon fontSize={15} icon={IconEnum.edit} />
      {title || nodeLabel}
    </Link>
  ) : (
    <div className="Lato text-white">
      <Icon icon={IconEnum.edit} />
      {nodeLabel}
    </div>
  );
}
