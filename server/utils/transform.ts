export const removeNull = (obj: JSON) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
