import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Board, Document, Map } from "../../custom-types";

type Props = {
  node: any;
};

export default function MentionReactComponent({ node }: Props) {
  console.log(node);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { project_id } = useParams();
  const docs: Document[] | undefined = queryClient.getQueryData(
    `${project_id}-documents`
  );
  const maps: Map[] | undefined = queryClient.getQueryData<Map[]>(
    `${project_id}-maps`
  );
  const boards: Board[] | undefined = queryClient.getQueryData<Board[]>(
    `${project_id}-boards`
  );
  let item: Document | Map | Board | undefined;
  if (node.attrs.name === "at") {
    item = docs ? docs.find((doc) => doc.id === node.attrs.id) : undefined;
  } else if (node.attrs.name === "hash") {
    item = maps ? maps.find((map) => map.id === node.attrs.id) : undefined;
  } else {
    item = boards
      ? boards.find((board) => board.id === node.attrs.id)
      : undefined;
  }

  return (
    <Link
      className="Lato text-white "
      style={{
        fontWeight: "700",
      }}
      to={
        node.attrs.name === "at"
          ? `../${node.attrs.id}`
          : node.attrs.name === "hash"
          ? `../../maps/${node.attrs.id}`
          : `../../boards/${node.attrs.id}`
      }
    >
      {node.attrs.name === "hash" ? (
        <i className="pi pi-map-marker underline"></i>
      ) : (
        ""
      )}
      {item ? item.title : node.attrs.label}
    </Link>
  );
}
