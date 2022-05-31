import { Link } from "react-router-dom";
type Props = {
  title?: string;
  nodeId: string | undefined;
  nodeLabel: string;
};
export default function PublicMapMention({ title, nodeId, nodeLabel }: Props) {
  return (
    <Link
      className={`Lato text-white fontWeight700`}
      id={`link-${nodeId}`}
      to={`../maps/${nodeId}`}
    >
      <i className="pi pi-map-marker underline"></i>
      {title || nodeLabel}
    </Link>
  );
}
