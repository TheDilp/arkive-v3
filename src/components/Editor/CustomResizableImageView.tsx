import {
  ResizableNodeView,
  ResizableRatioType,
} from "prosemirror-resizable-view";
import { setStyle } from "@remirror/core";
import { EditorView, NodeView, ProsemirrorNode } from "@remirror/pm";

/**
 * ResizableImageView is a NodeView for image. You can resize the image by
 * dragging the handle over the image.
 */
export class CustomResizableImageView
  extends ResizableNodeView
  implements NodeView
{
  constructor(node: ProsemirrorNode, view: EditorView, getPos: () => number) {
    super({ node, view, getPos, aspectRatio: ResizableRatioType.Fixed });
  }

  createElement({ node }: { node: ProsemirrorNode }): HTMLImageElement {
    const contEl = document.createElement("figure");
    const imageEl = document.createElement("img");
    imageEl.setAttribute("src", node.attrs.src);

    if (node.attrs.figtext) {
      const figEl = document.createElement("figcaption");
      setStyle(figEl, {
        backgroundColor: "#3d3d3d",
        color: "#f1f1f1",
      });
      figEl.innerText = node.attrs.figtext || "";
      contEl.appendChild(figEl);
    }

    contEl.appendChild(imageEl);

    setStyle(imageEl, {
      width: "100%",
      minWidth: "50px",
      objectFit: "contain", // maintain image's aspect ratio
    });
    setStyle(contEl, {
      textAlign: "center",
      margin: "0",
    });

    return contEl;
  }
}
