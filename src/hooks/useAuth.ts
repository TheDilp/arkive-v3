export function useAuth() {
  // @ts-ignore
  return window?.Clerk?.user;
}
