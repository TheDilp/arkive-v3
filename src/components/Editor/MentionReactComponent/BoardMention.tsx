import { Link } from "react-router-dom";
type Props = {
  title: string;
  nodeId: string;
  nodeLabel: string;
};
export default function BoardMention({ title, nodeId, nodeLabel }: Props) {
  return (
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
  );
}
