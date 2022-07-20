import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  extension,
  ExtensionTag,
  MarkExtension,
  MarkExtensionSpec,
  MarkSpecOverride,
  PrimitiveSelection,
  toggleMark,
} from "@remirror/core";

export interface SecretOptions {
  secret: boolean;
}

@extension<SecretOptions>({
  defaultOptions: {
    secret: true,
  },
})
export class SecretExtension extends MarkExtension<SecretOptions> {
  get name() {
    return "secret" as const;
  }

  createTags() {
    return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
  }

  createMarkSpec(
    extra: ApplySchemaAttributes,
    override: MarkSpecOverride
  ): MarkExtensionSpec {
    return {
      ...override,
      attrs: extra.defaults(),
      parseDOM: [
        {
          tag: "p",
          getAttrs: extra.parse,
        },
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        return ["p", extra.dom(node), 0];
      },
    };
  }

  @command()
  toggleSecret(selection?: PrimitiveSelection): CommandFunction {
    return toggleMark({ type: this.type, selection });
  }
}
