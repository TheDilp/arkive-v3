import { Link } from "react-router-dom";
type Props = {
  nodeId: string | undefined;
  nodeLabel: string;
  title?: string;
};
export default function BoardMention({ title, nodeId, nodeLabel }: Props) {
  return nodeId ? (
    <Link
      className={`Lato text-white test`}
      id={`link-${nodeId}`}
      style={{
        fontWeight: "700",
      }}
      to={`../../boards/${nodeId}`}
    >
      {title || nodeLabel}
    </Link>
  ) : (
    <div className="Lato text-white">{nodeLabel}</div>
  );
}
