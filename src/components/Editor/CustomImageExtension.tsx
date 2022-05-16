import { NodeView } from "@remirror/pm/view";
import {
  ApplySchemaAttributes,
  EditorView,
  NodeExtensionSpec,
  NodeSpecOverride,
  NodeViewMethod,
  ProsemirrorNode,
} from "remirror";
import { ImageExtension } from "remirror/extensions";
import { CustomResizableImageView } from "./CustomResizableImageView";
export class CustomImageExtension extends ImageExtension {
  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    const spec = super.createNodeSpec(extra, override);

    return {
      ...spec,
      attrs: {
        ...spec.attrs,
        resizeable: { default: true },
        figtext: {
          default:
            "THIS IS A FIGURE TEXTQWOPEIQOPWEIOPQWIEOPQIWEOPQIWEOPIQWEOPIQWOPEIQWOPEIQOPWIEQOPWIEPQOWEIWOPIEOPQWIE",
        },
      },
      toDOM: (node) => [
        "figure",

        spec.toDOM!(node),
        ["figcaption", node.attrs.figtext],
      ],
    };
  }
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
