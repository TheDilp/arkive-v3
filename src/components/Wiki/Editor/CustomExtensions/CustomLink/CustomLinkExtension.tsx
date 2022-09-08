import { LinkExtension } from "remirror/extensions";
const CustomLinkExtenstion = new LinkExtension({
  autoLink: true,
  defaultTarget: "_blank",
  selectTextOnClick: true
});



export default CustomLinkExtenstion;
