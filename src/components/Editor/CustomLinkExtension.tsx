import { LinkExtension } from "remirror/extensions";
const CustomLinkExtenstion = new LinkExtension({
  autoLink: true,
});

CustomLinkExtenstion.addHandler("onClick", (e, data) => {
  if (e.ctrlKey) window.location.assign(data.href);
  return true;
});

export default CustomLinkExtenstion;
