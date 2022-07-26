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
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      secret: SecretExtension;
    }
  }
}
