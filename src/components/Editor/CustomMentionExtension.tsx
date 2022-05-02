import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { MentionAtomExtension } from "remirror/extensions";
import { Document, Map } from "../../custom-types";

const CustomMentionExtension = new MentionAtomExtension({
  extraTags: ["link"],
  mentionTag: "span",

  matchers: [
    {
      name: "at",
      char: "@",
      appendText: "",
      supportedCharacters: /[^\s][\w\d_ ]+/,
    },
    {
      name: "hash",
      char: "#",
      appendText: "",
      supportedCharacters: /[^\s][\w\d_ ]+/,
    },
  ],
});

CustomMentionExtension.ReactComponent = ({ node }) => {
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
  let item: Document | Map | undefined;
  if (node.attrs.name === "at") {
    item = docs ? docs.find((doc) => doc.id === node.attrs.id) : undefined;
  } else {
    item = maps ? maps.find((map) => map.id === node.attrs.id) : undefined;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {}, [docs]);

  return (
    <Link
      className="Lato text-white "
      style={{
        fontWeight: "700",
      }}
      to={
        node.attrs.name === "at"
          ? `../${node.attrs.id}`
          : `../../maps/${node.attrs.id}`
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
};

export default CustomMentionExtension;
