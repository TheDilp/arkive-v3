import { DocumentType } from "../types/ItemTypes/documentTypes";

export function recursiveDescendantFilter(
  doc: DocumentType,
  index: number,
  array: DocumentType[],
  selected_id: string,
): boolean {
  if (doc.parent === null) {
    return true;
  }
  const parent = array.find((d) => d.id === doc.parentId);
  if (parent) {
    if (parent.id === selected_id) {
      return false;
    }
    return recursiveDescendantFilter(parent, index, array, selected_id);
  }
  return false;
}
