import { keyBinding, KeyBindingProps } from "remirror";
import { TableExtension } from "remirror/extensions";

export default class CustomTableExtension extends TableExtension {
  @keyBinding({ shortcut: "Mod-Alt-w", command: "addRowBefore" })
  addRowBefore(props: KeyBindingProps): boolean {
    return this.addTableRowBefore()(props);
  }
  @keyBinding({ shortcut: "Mod-Alt-s", command: "addRowAfter" })
  addRowAfter(props: KeyBindingProps): boolean {
    return this.addTableRowAfter()(props);
  }

  @keyBinding({ shortcut: "Mod-Alt-a", command: "addColumnBefore" })
  addColumnBefore(props: KeyBindingProps): boolean {
    return this.addTableColumnBefore()(props);
  }
  @keyBinding({ shortcut: "Mod-Alt-d", command: "addColumnAfter" })
  addColumnAfter(props: KeyBindingProps): boolean {
    return this.addTableColumnAfter()(props);
  }
  @keyBinding({ shortcut: "Mod-Alt-e", command: "deleteColumn" })
  deleteColumn(props: KeyBindingProps): boolean {
    return this.deleteTableColumn()(props);
  }
  @keyBinding({ shortcut: "Mod-Alt-f", command: "deleteRow" })
  deleteRow(props: KeyBindingProps): boolean {
    return this.deleteTableRow()(props);
  }
  @keyBinding({ shortcut: "Mod-Alt-.", command: "deleteTable" })
  deleteTables(props: KeyBindingProps): boolean {
    return this.deleteTable()(props);
  }
}
