import { LinkExtension } from "remirror/extensions";
const CustomLinkExtenstion = new LinkExtension();

CustomLinkExtenstion.addHandler("onClick", (e, data) => {
  window.location.replace(data.href);
  return true;
});

export default CustomLinkExtenstion;
