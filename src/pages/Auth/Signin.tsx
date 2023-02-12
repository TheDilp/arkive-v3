import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toaster } from "../../utils/toast";

export default function Signin() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  function changeLoginData({ name, value }: { name: string; value: string }) {
    setLoginData((prev) => ({ ...prev, [name]: value }));
  }
  async function loginUser() {
    setLoading(true);
    if (loginData.email && loginData.password) {
      signInWithEmailAndPassword(auth, loginData.email, loginData.password)
        .then(() => {
          setLoading(false);
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toaster("error", `${errorCode}: ${errorMessage}`);
          setLoading(false);
        });
    } else {
      if (!loginData.email) toaster("error", "No email entered.");
      if (!loginData.password) toaster("error", "No password entered.");
    }
  }
  // if (user) return <Navigate to="/" />;
  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-center font-Lato text-2xl">Welcome back</h3>
      <InputText
        name="email"
        onChange={(e) => changeLoginData(e.target)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") await loginUser();
        }}
        placeholder="Email"
        type="email"
      />
      <Password
        feedback={false}
        inputClassName="w-full"
        name="password"
        onChange={(e) => changeLoginData(e.target)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") await loginUser();
        }}
        placeholder="Password"
        type="password"
      />
      <Link className="flex w-full justify-end " to="/auth/signup">
        <small className="group cursor-pointer text-right text-xs text-zinc-500 transition-colors hover:text-sky-200">
          Don&apos;t have an account?
          <span className="text-zinc-500 transition-colors group-hover:text-sky-200"> Sign up</span>
        </small>
      </Link>
      <Button
        className="p-button-success p-button-outlined"
        disabled={loading}
        icon="pi pi-sign-in"
        iconPos="right"
        label="Sign in"
        loading={loading}
        onClick={async () => loginUser()}
      />
    </div>
  );
}
