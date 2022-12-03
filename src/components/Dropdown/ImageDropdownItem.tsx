import React from "react";
import { useParams } from "react-router-dom";

import { baseURLS } from "../../types/CRUDenums";

type Props = string[];

export default function ImageDropdownItem(props: Props) {
  const { project_id } = useParams();
  const [image] = props;
  return (
    <div className="flex max-w-[200px] items-center justify-between">
      <span className="truncate">{image}</span>
      <img alt={project_id} className="h-12 w-12" src={`${baseURLS.baseServer}getimage/maps/${project_id}/${image}`} />
    </div>
  );
}
