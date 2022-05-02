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
      supportedCharacters: /[^\s][\w\d_ ]+/,
    },
    {
      name: "hash",
      char: "#",
      supportedCharacters: /[^\s][\w\d_ ]+/,
    },
  ],
});

CustomMentionExtension.ReactComponent = ({ node }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { project_id } = useParams();

  let item: Document | Map | undefined;
  if (node.attrs.name === "at") {
    const items = queryClient.getQueryData<Document[]>(
      `${project_id}-documents`
    );
    item = items?.find((doc) => doc.id === node.attrs.id);
  } else {
    const items = queryClient.getQueryData<Map[]>(`${project_id}-maps`);
    item = items?.find((map) => map.id === node.attrs.id);
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
          : `../../maps/${node.attrs.id}`
      }
    >
      {node.attrs.name === "hash" ? (
        <Icon icon="mdi:map-marker" className="underline" />
      ) : (
        ""
      )}
      {item ? item?.title : node.attrs.label}
    </Link>
  );
};

export default CustomMentionExtension;
