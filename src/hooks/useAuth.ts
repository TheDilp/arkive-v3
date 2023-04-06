import { useUser } from "@clerk/clerk-react";

export function useAuth() {
  const { user } = useUser();
  return user;
}
