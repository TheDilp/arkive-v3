export const removeNull = (obj: JSON) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));

export const onlyUniqueStrings = (
  value: string,
  index: number,
  self: string[],
) => {
  return self.indexOf(value) === index;
};
