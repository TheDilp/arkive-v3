export function removeNull(obj: JSON) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => {
      if ((k === "content" || k === "properties") && v === null) return false;
      return true;
    }),
  );
}

export function onlyUniqueStrings(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

export function hasValueDeep(json: any, findValue: string): boolean {
  let hasValue = false;
  if (typeof json === "object" && !Array.isArray(json)) {
    const values = Object.values(json);
    values.forEach((value) => {
      if (hasValue) return hasValue;
      if (value !== null) {
        if (typeof value === "string") {
          hasValue = value.includes(findValue);
          if (hasValue) return hasValue;
        }
        if (typeof value === "object") {
          hasValue = hasValue || hasValueDeep(value, findValue);
          if (hasValue) return hasValue;
        }
      }
      if (hasValue) return hasValue;
      return hasValue;
    });
  }
  if (Array.isArray(json)) {
    for (let index = 0; index < json.length; index += 1) {
      hasValue = hasValue || hasValueDeep(json[index], findValue);
      if (hasValue) return hasValue;
    }
  }
  return hasValue;
}
