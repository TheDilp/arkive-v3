import ls from "localstorage-slim";

export const setItem = (key: string, value: any, ttl?: number) => {
  if (ttl) {
    ls.set(key, value, { ttl });
  } else {
    ls.set(key, value);
  }
};

export const getItem = (key: string) => ls.get(key);

export const removeItem = (key: string) => {
  ls.remove(key);
};

export const clearAll = (keys: string) => {
  if (!keys?.length) {
    ls.clear();
  } else {
    const len = keys?.length;
    for (let i = 0; i < len; i += 1) {
      ls.remove(keys[i]);
    }
  }
};

export default {
  setItem,
  getItem,
  removeItem,
  clearAll,
};
