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
  const doc = docs ? docs.find((doc) => doc.id === node.attrs.id) : null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {}, [docs]);

  return (
    <Link
      className="Lato text-white "
      style={{
        fontWeight: "700",
      }}
      to={`../${node.attrs.id}`}
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
