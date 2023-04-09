export default function useIsLocal() {
  const isLocal = import.meta.env.VITE_LOCAL === "true";
  return isLocal;
}
