import {
  ResizableNodeView,
  ResizableRatioType,
} from "prosemirror-resizable-view";
import { Shape } from "@remirror/core";
import { EditorView, NodeView, ProsemirrorNode } from "@remirror/pm";
import { MapPreviewAttributes } from "./MapPreviewExtension";

/**
 * ResizableIframeView is a NodeView for iframe. You can resize the iframe by
 * dragging the handle over the iframe.
 */
export class ResizableWrapper extends ResizableNodeView implements NodeView {
  readonly options: MapPreviewAttributes;
  constructor(
    node: ProsemirrorNode,
    view: EditorView,
    getPos: () => number,
    iframeOptions: any
  ) {
    const { width, height } = node.attrs as MapPreviewAttributes;
    const initialSize = width && height ? { width, height } : undefined;

    super({
      node,
      view,
      getPos,
      aspectRatio: ResizableRatioType.Flexible,
      options: iframeOptions,
      initialSize,
    });
    this.options = iframeOptions;
  }

  createElement({
    node,
    options,
  }: {
    node: ProsemirrorNode;
    options?: Shape;
  }): HTMLIFrameElement {
    const { src, type, allowFullScreen, frameBorder } = node.attrs;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", src);
    iframe.dataset.embedType = type;
    iframe.setAttribute("allowfullscreen", allowFullScreen ? "true" : "false");
    iframe.setAttribute("frameBorder", frameBorder?.toString());

    if (options?.class) {
      iframe.classList.add(options.class);
      iframe.classList.add(`${options.class}-${type as string}`);
    }

    iframe.style.width = "100%";
    iframe.style.height = "100%";

    return iframe;
  }
}
