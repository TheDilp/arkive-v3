import { LinkExtension } from "remirror/extensions";

const CustomLinkExtenstion = new LinkExtension({ autoLink: true });

CustomLinkExtenstion.addHandler("onClick", (_, data) => {
  window.location.replace(data.href);
  return true;
});
export default CustomLinkExtenstion;
