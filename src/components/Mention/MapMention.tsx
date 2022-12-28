import { Link } from "react-router-dom";

type Props = {
  title?: string;
  nodeId: string | undefined;
  nodeLabel: string;
};
export default function MapMention({ title, nodeId, nodeLabel }: Props) {
  return nodeId ? (
    <Link className="font-Lato text-sm font-bold text-white underline" to={`../../maps/${nodeId}`}>
      <i className="pi pi-map-marker mentionMapIcon" />
      {title || nodeLabel}
    </Link>
  ) : (
    <div className="Lato text-white">{nodeLabel}</div>
  );
}
