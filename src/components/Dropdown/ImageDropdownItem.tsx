import { useParams } from "react-router-dom";

type Props = string;

export function MapImageDropdownItem(props: Props) {
  const { project_id } = useParams();
  const image = props;
  const name = image.split("/").pop();
  return (
    <div className="flex max-w-[200px] items-center justify-between">
      <span className="truncate">{name}</span>
      {image !== "None" ? <img alt={project_id} className="h-12 w-12" src={image} /> : null}
    </div>
  );
}

export function ImageDropdownItem(props: Props) {
  const { project_id } = useParams();
  const image = props;
  const name = image.split("/").pop();
  return (
    <div className="flex max-w-[200px] items-center justify-between">
      <span className="truncate">{name}</span>
      {image !== "None" ? <img alt={project_id} className="h-12 w-12" src={image} /> : null}
    </div>
  );
}
