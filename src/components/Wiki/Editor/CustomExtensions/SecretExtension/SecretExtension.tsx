import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  extension,
  ExtensionTag,
  findNodeAtSelection,
  InputRule,
  isElementDomNode,
  isTextSelection,
  keyBinding,
  KeyBindingProps,
  NodeExtension,
  NodeExtensionSpec,
  nodeInputRule,
  NodeSpecOverride,
  NodeViewMethod,
  omitExtraAttributes,
  ProsemirrorNode,
  toggleWrap,
} from "@remirror/core";
import { Fragment, Slice } from "@remirror/pm/model";
import { TextSelection } from "@remirror/pm/state";
import { EditorView } from "@remirror/pm/view";

interface SecretOptions {
  secret?: string;
  classNames?: string;
}

/**
 * Adds a callout to the editor.
 */
@extension<SecretOptions>({
  defaultOptions: {
    secret: "true",
    classNames: "secretBlock",
  },
})
export class SecretExtension extends NodeExtension<SecretOptions> {
  get name() {
    return "secret" as const;
  }

  readonly tags = [ExtensionTag.Block];

  /**
   * Defines the callout html structure.
   * Adds the returned DOM node form `renderEmoji`  into it.
   */
  createNodeViews(): NodeViewMethod {
    return (
      node: ProsemirrorNode,
      view: EditorView,
      getPos: boolean | (() => number)
    ) => {
      const { secret, classNames } = node.attrs;
      const dom = document.createElement("div");
      dom.setAttribute("secret", secret);
      dom.setAttribute("class", classNames);

      const contentDOM = document.createElement("div");

      const secretIcon = document.createElement("i");
      secretIcon.classList.add("pi", "pi-eye-slash");
      dom.append(secretIcon);
      dom.append(contentDOM);
      return { dom, contentDOM };
    };
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    const { classNames, secret } = this.options;
    return {
      content: "block+",
      defining: true,
      draggable: false,
      ...override,
      attrs: {
        ...extra.defaults(),
        classNames: { default: classNames },
        secret: { default: secret },
      },
      parseDOM: [
        {
          tag: `p[secret="${secret}"]`,
          getAttrs: (node) => {
            if (!isElementDomNode(node)) {
              return false;
            }

            const content = node.textContent;
            return { ...extra.parse(node), secret, classNames, content };
          },
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        const { ...rest } = omitExtraAttributes(node.attrs, extra);
        const attributes = {
          ...extra.dom(node),
          ...rest,
          classNames,
        };
        return ["p", attributes, 0];
      },
    };
  }

  /**
   * Create an input rule that listens for input of 3 colons followed
   * by a valid callout type, to create a callout node
   * If the callout type is invalid, the defaultType callout is created
   */
  createInputRules(): InputRule[] {
    return [
      nodeInputRule({
        regexp: /^::s$/,
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

  /**
   * Toggle the callout at the current selection. If you don't provide the
   * type it will use the options.defaultType.
   *
   * If none exists one will be created or the existing callout content will be
   * lifted out of the callout node.
   *
   * ```ts
   * if (commands.toggleCallout.enabled()) {
   *   commands.toggleCallout({ type: 'success' });
   * }
   * ```
   */
  @command()
  toggleSecret(attributes?: {
    secret: string;
    classNames: string;
  }): CommandFunction {
    return toggleWrap(this.type, attributes);
  }

  /**
   * Update the callout at the current position. Primarily this is used
   * to change the type.
   *
   * ```ts
   * if (commands.updateCallout.enabled()) {
   *   commands.updateCallout({ type: 'error' });
   * }
   * ```
   */
  // @command(toggleCalloutOptions)
  // updateCallout(attributes: CalloutAttributes, pos?: number): CommandFunction {
  //   return updateNodeAttributes(this.type)(attributes, pos);
  // }

  /**
   * Attach the keyboard shortcut for making text bold to this mark and also to
   * the `toggleBold` command.
   */
  @keyBinding({ shortcut: "Mod-g", command: "toggleSecret" })
  shortcut(props: KeyBindingProps): boolean {
    return this.toggleSecret()(props);
  }

  @keyBinding({ shortcut: "Enter" })
  handleEnterKey({ dispatch, tr }: KeyBindingProps): boolean {
    if (!(isTextSelection(tr.selection) && tr.selection.empty)) {
      return false;
    }

    const { nodeBefore, parent } = tr.selection.$from;

    if (!nodeBefore || !nodeBefore.isText || !parent.type.isTextblock) {
      return false;
    }

    const regex = /^::s$/;
    const { text, nodeSize } = nodeBefore;
    const { textContent } = parent;

    if (!text) {
      return false;
    }

    const matchesNodeBefore = text.match(regex);
    const matchesParent = textContent.match(regex);

    if (!matchesNodeBefore || !matchesParent) {
      return false;
    }

    const pos = tr.selection.$from.before();
    const end = pos + nodeSize + 1;
    // +1 to account for the extra pos a node takes up

    if (dispatch) {
      const slice = new Slice(
        Fragment.from(this.type.create({ type: "secret" })),
        0,
        1
      );
      tr.replace(pos, end, slice);

      // Set the selection to within the callout
      tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1)));
      dispatch(tr);
    }

    return true;
  }

  /**
   * Handle the backspace key when deleting content.
   */
  @keyBinding({ shortcut: "Backspace" })
  handleBackspace({ dispatch, tr }: KeyBindingProps): boolean {
    // Aims to stop merging callouts when deleting content in between

    // If the selection is not empty return false and let other extension
    // (ie: BaseKeymapExtension) to do the deleting operation.
    if (!tr.selection.empty) {
      return false;
    }

    const { $from } = tr.selection;

    // If not at the start of current node, no joining will happen
    if ($from.parentOffset !== 0) {
      return false;
    }

    const previousPosition = $from.before($from.depth) - 1;

    // If nothing above to join with
    if (previousPosition < 1) {
      return false;
    }

    const previousPos = tr.doc.resolve(previousPosition);

    // If resolving previous position fails, bail out
    if (!previousPos?.parent) {
      return false;
    }

    const previousNode = previousPos.parent;
    const { node, pos } = findNodeAtSelection(tr.selection);

    // If previous node is a callout, cut current node's content into it
    if (node.type !== this.type && previousNode.type === this.type) {
      const { content, nodeSize } = node;
      tr.delete(pos, pos + nodeSize);
      tr.setSelection(TextSelection.near(tr.doc.resolve(previousPosition - 1)));
      tr.insert(previousPosition - 1, content);

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      secret: SecretExtension;
    }
  }
}
