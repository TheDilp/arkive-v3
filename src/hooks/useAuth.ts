import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<string | boolean>(false);
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (res) => {
      if (res) setUser(res.uid);
      if (!res) window.location.href = "https://home.thearkive.app";
    });
  }, []);

  return user;
}
