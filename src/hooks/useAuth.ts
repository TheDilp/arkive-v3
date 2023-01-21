import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | boolean>(false);
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (res) => {
      if (res) setUser(res.uid);
      if (!res) navigate("/auth/signin");
    });
  }, []);

  return user;
}
