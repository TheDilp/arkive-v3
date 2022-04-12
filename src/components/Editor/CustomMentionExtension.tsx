import { Link } from "react-router-dom";
import { MentionAtomExtension } from "remirror/extensions";

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
  return (
    <Link
      className="Lato text-white"
      style={{
        fontWeight: "700",
      }}
      to={`../${node.attrs.id}`}
    >
      {node.attrs.label}
    </Link>
  );
};

export default CustomMentionExtension;
