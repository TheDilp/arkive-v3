import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { MentionAtomExtension } from "remirror/extensions";
import { Document } from "../../custom-types";

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
      className="Lato text-white"
      style={{
        fontWeight: "700",
      }}
      to={`../${node.attrs.id}`}
    >
      {doc ? doc?.title : node.attrs.label}
    </Link>
  );
};

export default CustomMentionExtension;
