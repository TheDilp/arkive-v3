import { NodeView } from "@remirror/pm/view";
import {
  ApplySchemaAttributes,
  EditorView,
  NodeExtensionSpec,
  NodeSpecOverride,
  NodeViewMethod,
  ProsemirrorNode,
} from "remirror";
import { ImageExtension, ResizableImageView } from "remirror/extensions";
import { CustomResizableImageView } from "./CustomResizableImageView";
export class CustomImageExtension extends ImageExtension {
  //   createNodeSpec(
  //     extra: ApplySchemaAttributes,
  //     override: NodeSpecOverride
  //   ): NodeExtensionSpec {
  //     const spec = super.createNodeSpec(extra, override);

  //     return {
  //       ...spec,
  //       attrs: {
  //         ...spec.attrs,
  //         resizeable: { default: true },
  //         figcaptionText: { default: "Test" },
  //       },
  //       toDOM: (node) => [
  //         "div",
  //         {
  //           style:
  //             "border: 2px solid #479e0c; padding: 8px; margin: 8px; text-align: center;",
  //         },
  //         spec.toDOM!(node),
  //         [
  //           "figcaption",
  //           { style: "background-color: #3d3d3d; color: #f1f1f1; padding: 8px;" },
  //           node.attrs.figcaptionText,
  //         ],
  //       ],
  //     };
  //   }
  createNodeViews(): NodeViewMethod | Record<string, NodeViewMethod> {
    return (
      node: ProsemirrorNode,
      view: EditorView,
      getPos: boolean | (() => number)
    ) => {
      return new CustomResizableImageView(node, view, getPos as () => number);
    };
  }
}
