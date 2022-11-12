export const removeNull = (obj: JSON) =>
  Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => {
      if ((k === "content" || k === "properties") && v === null) return false;
      return true;
    }),
  );

export const onlyUniqueStrings = (
  value: string,
  index: number,
  self: string[],
) => {
  return self.indexOf(value) === index;
};
