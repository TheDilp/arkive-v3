import { NodeViewComponentProps, useCommands } from "@remirror/react";
import { ComponentType } from "react";
import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  extension,
  ExtensionTag,
  getTextSelection,
  isElementDomNode,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  omitExtraAttributes,
  PrimitiveSelection,
} from "remirror";
import { CreateEventHandlers } from "remirror/extensions";
import MapPreview from "../../PreviewComponents/MapPreview";

export interface MapOptions {
  render?: (
    props: MapPreviewAttributes
  ) => React.ReactElement<HTMLElement> | null;
  onClick: (e: any) => void;
}

/**
 * Adds a map preview node to the editor
 */
@extension<MapOptions>({
  defaultOptions: {
    render: MapPreview,
    onClick: (e) => console.log(e),
  },
})
export class MapPreviewExtension extends NodeExtension<MapOptions> {
  get name() {
    return "mappreview" as const;
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = (props) => {
    return this.options.render({
      ...props,
      id: props.node.attrs.id,
      width: props.node.attrs.width,
      height: props.node.attrs.height,
    });
  };

  createTags() {
    return [ExtensionTag.InlineNode, ExtensionTag.Alignment];
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      inline: true,
      attrs: {
        ...extra.defaults(),
        id: { default: null },
        width: { default: 615 },
        height: { default: 480 },
      },
      selectable: true,
      atom: true,
      content: "inline+",

      ...override,
    };
  }

  @command()
  insertMapPreview(
    attributes: MapPreviewAttributes,
    selection?: PrimitiveSelection
  ): CommandFunction {
    return ({ tr, dispatch }) => {
      if (dispatch) {
        const { from, to } = getTextSelection(
          selection ?? tr.selection,
          tr.doc
        );
        const node = this.type.create(attributes);
        dispatch?.(tr.replaceRangeWith(from, to, node));
      } else {
      }
      return true;
    };
  }
  createEventHandlers(): CreateEventHandlers {
    return {
      click: (event, clickState) => {
        // Check if this is a direct click which must be the case for atom
        // nodes.
        if (!clickState.direct) {
          return;
        }

        const nodeWithPosition = clickState.getNode(this.type);

        if (!nodeWithPosition) {
          return;
        }
        if (event.ctrlKey) {
        }
        return true;
      },
    };
  }
}

export interface MapPreviewAttributes {
  /**
   * Unique identifier for a note
   */
  id: string;
  width: number;
  height: number;
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      mappreview: MapPreviewExtension;
    }
  }
}
