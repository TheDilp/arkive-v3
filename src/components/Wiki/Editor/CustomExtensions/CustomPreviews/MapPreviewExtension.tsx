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
import PublicPreview from "../../../../PublicView/Wiki/PublicEditor/PublicPreview/PublicPreview";
import MapPreview from "../../PreviewComponents/MapPreview";

export interface MapOptions {
  render?: (
    props: MapPreviewAttributes
  ) => React.ReactElement<HTMLElement> | null;
  public_view: Boolean;
}

/**
 * Adds a map preview node to the editor
 */
@extension<MapOptions>({
  defaultOptions: {
    render: () => null,
    public_view: true,
  },
})
export class MapPreviewExtension extends NodeExtension<MapOptions> {
  get name() {
    return "mappreview" as const;
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = (props) => {
    const { id, width, height } = props.node.attrs;
    if (this.options.public_view) {
      return <PublicPreview id={id} width={width} height={height} />;
    } else {
      return (
        <MapPreview
          id={id}
          width={width}
          height={height}
          updateId={props.updateAttributes}
        />
      );
    }
  };

  createTags() {
    return [ExtensionTag.InlineNode];
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
        public_view: { default: true },
      },
      selectable: true,
      atom: true,
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
}

export interface MapPreviewAttributes {
  /**
   * Unique identifier for a note
   */
  id: string;
  width: number;
  height: number;
  updateId?: (attrs: ProsemirrorAttributes<object>) => void;
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      mappreview: MapPreviewExtension;
    }
  }
}
