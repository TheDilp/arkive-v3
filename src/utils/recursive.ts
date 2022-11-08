import { DocumentType } from "../types/documentTypes";

export function recursiveDescendantFilter(
  doc: DocumentType,
  index: number,
  array: DocumentType[],
  selected_id: string
): boolean {
  if (doc.parent === null) {
    return true;
  } else {
    const parent = array.find((d) => d.id === doc.parent);
    if (parent) {
      if (parent.id === selected_id) {
        return false;
      } else {
        return recursiveDescendantFilter(parent, index, array, selected_id);
      }
    } else {
      return false;
    }
  }
}
