import {
  ApplySchemaAttributes,
  chainCommands,
  convertCommand,
  EditorView,
  extension,
  ExtensionTag,
  findParentNodeOfType,
  isElementDomNode,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  nodeInputRule,
  NodeSpecOverride,
  NodeViewMethod,
  omitExtraAttributes,
} from "@remirror/core";
import { InputRule } from "@remirror/pm/inputrules";
import { TextSelection } from "@remirror/pm/state";
import { exitCode } from "@remirror/pm/commands";
import { ProsemirrorNode } from "@remirror/pm/suggest";
interface ColumnsOptions {
  count: number;
}

/**
 * Add column support to the nodes in your editor.
 */
@extension<ColumnsOptions>({
  defaultOptions: {
    count: 2,
  },
})
export class CustomColumnsExtension extends NodeExtension<ColumnsOptions> {
  get name() {
    return "customcolumns" as const;
  }

  createTags() {
    return [ExtensionTag.Block];
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      ...override,
      content: "block+",
      defining: true,
      draggable: false,
      attrs: {
        ...extra.defaults(),
        count: { default: this.options.count },
      },
      parseDOM: [
        {
          tag: `div`,
          getAttrs: (node) => {
            if (!isElementDomNode(node)) {
              return false;
            }

            const content = node.textContent;
            return { ...extra.parse(node), content };
          },
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        const { ...rest } = omitExtraAttributes(node.attrs, extra);
        const attributes = {
          ...extra.dom(node),
          ...rest,
          class: "flex flex-wrap columnContainer",
        };
        return ["div", attributes, 0];
      },
    };
  }

  createKeymap(): KeyBindings {
    const newColumn = chainCommands(convertCommand(exitCode), ({ tr }) => {
      const columnWrapperNode = findParentNodeOfType({
        types: this.type,
        selection: tr.selection,
      });

      if (columnWrapperNode) {
        if (columnWrapperNode.node.childCount < 4) {
          this.store.commands.insertParagraph(" ");
        } else {
          this.store.commands.insertHardBreak();
        }
      }
      return true;
    });
    const enterCommand = chainCommands(convertCommand(exitCode), () => {
      this.store.commands.insertHardBreak();
      return true;
    });
    return {
      "Mod-Enter": newColumn,
      Enter: enterCommand,
    };
  }
  createInputRules(): InputRule[] {
    return [
      nodeInputRule({
        regexp: /^::c\d$/,
        type: this.type,
        beforeDispatch: ({ tr, start }) => {
          const $pos = tr.doc.resolve(start);
          tr.setSelection(TextSelection.near($pos));
        },
        getAttributes: (match) => {
          let count = match[0]?.match(/\d/)?.[0];
          if (count) {
            return {
              count,
            };
          } else {
            return {
              count: 2,
            };
          }
        },
      }),
    ];
  }
}
export interface CustomColumnsAttributes {
  /**
   * Unique identifier for a note
   */
  count: number;
  // updateId?: (attrs: ProsemirrorAttributes<object>) => void;
}
declare global {
  namespace Remirror {
    interface AllExtensions {
      customcolumns: CustomColumnsExtension;
    }
  }
}
