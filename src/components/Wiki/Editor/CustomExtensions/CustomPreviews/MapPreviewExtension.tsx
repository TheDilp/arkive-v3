import { NodeViewComponentProps, propIsFunction } from "@remirror/react";
import { ComponentType } from "react";
import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  extension,
  ExtensionTag,
  getTextSelection,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  PrimitiveSelection,
  ProsemirrorAttributes,
} from "remirror";
import PublicMapPreview from "../../../../PublicView/Wiki/PublicEditor/PublicPreview/PublicMapPreview";
import BoardPreview from "../../PreviewComponents/BoardPreview";
import MapPreview from "../../PreviewComponents/MapPreview";

export interface MapOptions {
  render?: (
    props: MapPreviewAttributes
  ) => React.ReactElement<HTMLElement> | null;
  public_view: Boolean;
  type: null | "map" | "board" | "timeline";
}

/**
 * Adds a map preview node to the editor
 */
@extension<MapOptions>({
  defaultOptions: {
    render: () => null,
    public_view: true,
    type: null,
  },
})
export class MapPreviewExtension extends NodeExtension<MapOptions> {
  get name() {
    return "mappreview" as const;
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = (props) => {
    const { id, width, height, x, y, zoom, type } = props.node.attrs;
    if (type === "map") {
      if (this.options.public_view) {
        return <PublicMapPreview id={id} width={width} height={height} x={x} y={y} zoom={zoom} />;
      } else {
        return (
          <MapPreview
            id={id}
            width={width}
            height={height}
            x={x}
            y={y}
            zoom={zoom}
            updateAttributes={props.updateAttributes}
          />
        );
      }
    } else if (type === "board") {
      if (this.options.public_view) {
        return <BoardPreview id={id} width={width} height={height} x={x} y={y} zoom={zoom} />;
      } else {
        return (
          <BoardPreview
            id={id}
            width={width}
            height={height}
            x={x}
            y={y}
            zoom={zoom}
            updateAttributes={props.updateAttributes}
          />
        );
      }
    } else {
      return null;
    }
  };

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      attrs: {
        ...extra.defaults(),
        id: { default: null },
        width: { default: 615 },
        height: { default: 480 },
        x: { default: 0 },
        y: { default: 0 },
        zoom: { default: 1 },
        public_view: { default: true },
        type: { default: this.options.type },
      },
      selectable: true,
      atom: true,
      allowGapCursor: true,

      ...override,
    };
  }

  @command()
  insertMapPreview(
    attributes: { id: string; type: null | "map" | "board" | "timeline" },
    selection?: PrimitiveSelection
  ): CommandFunction {
    return ({ tr, dispatch }) => {
      if (dispatch) {
        const { from, to } = getTextSelection(
          selection ?? tr.selection,
          tr.doc
        );
        const node = this.type.create(attributes);
        if (node)
          dispatch?.(tr.replaceRangeWith(from, to, node));
      }
      return true;
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
  x: number;
  y: number;
  zoom: number;
  updateAttributes?: (attrs: ProsemirrorAttributes<object>) => void;
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      mappreview: MapPreviewExtension;
    }
  }
}
