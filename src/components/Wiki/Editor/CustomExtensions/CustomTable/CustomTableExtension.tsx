import { TextSelection } from "@remirror/pm/state";
import { NodeViewComponentProps } from "@remirror/react";
import { ComponentType } from "react";
import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  extension,
  ExtensionTag,
  getTextSelection,
  InputRule,
  NodeExtension,
  NodeExtensionSpec,
  nodeInputRule,
  NodeSpecOverride,
  PrimitiveSelection,
  ProsemirrorAttributes,
} from "remirror";
import TableComponent from "../../PreviewComponents/TableComponent";

export interface MapOptions {
  render?: (
    props: CustomTableAttributes
  ) => React.ReactElement<HTMLElement> | null;
  public_view: boolean;
}

type RowShape = {
  [key: string]: any;
};

/**
 * Adds a map preview node to the editor
 */
@extension<MapOptions>({
  defaultOptions: {
    render: () => null,
    public_view: true,
  },
})
export class CustomTableExtension extends NodeExtension<MapOptions> {
  get name() {
    return "customtable" as const;
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = (props) => {
    const { columns, rows } = props.node.attrs;
    return <TableComponent />;
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
        columns: {
          default: 3,
        },
        rows: {
          default: 3,
        },
      },
      selectable: true,
      atom: true,
      allowGapCursor: true,

      ...override,
    };
  }

  createInputRules(): InputRule[] {
    return [
      nodeInputRule({
        regexp: /^::t$/,
        type: this.type,
        beforeDispatch: ({ tr, start }) => {
          const $pos = tr.doc.resolve(start);
          tr.setSelection(TextSelection.near($pos));
        },
        getAttributes: (match) => {
          return {
            secret: "true",
          };
        },
      }),
    ];
  }

  @command()
  insertTable(
    attributes: { columns: number; rows: number },
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

export interface CustomTableAttributes {
  /**
   * Unique identifier for a note
   */
  columns: string;
  rows: number;
  updateId?: (attrs: ProsemirrorAttributes<object>) => void;
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      customtable: CustomTableAttributes;
    }
  }
}
