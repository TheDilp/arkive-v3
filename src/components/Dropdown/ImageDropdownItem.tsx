import { useParams } from "react-router-dom";

import { getImageLink, getMapImageLink } from "../../utils/CRUD/CRUDUrls";

type Props = string;

export function MapImageDropdownItem(props: Props) {
  const { project_id } = useParams();
  const image = props;
  return (
    <div className="flex max-w-[200px] items-center justify-between">
      <span className="truncate">{image}</span>
      {image !== "None" ? (
        <img alt={project_id} className="h-12 w-12" src={getMapImageLink(image, project_id as string)} />
      ) : null}
    </div>
  );
}

export function ImageDropdownItem(props: Props) {
  const { project_id } = useParams();
  const image = props;
  return (
    <div className="flex max-w-[200px] items-center justify-between">
      <span className="truncate">{image}</span>
      {image !== "None" ? <img alt={project_id} className="h-12 w-12" src={getImageLink(image, project_id as string)} /> : null}
    </div>
  );
}
