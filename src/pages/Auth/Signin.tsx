import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link } from "react-router-dom";

import { toaster } from "../../utils/toast";

export default function Signin() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  // const user = getItem("user");

  function changeLoginData({ name, value }: { name: string; value: string }) {
    setLoginData((prev) => ({ ...prev, [name]: value }));
  }
  async function loginUser() {
    if (loginData.email && loginData.password) {
      //
    } else {
      if (!loginData.email) toaster("error", "No email entered.");
      if (!loginData.password) toaster("error", "No password entered.");
    }
  }
  // if (user) return <Navigate to="/" />;
  return (
    <div className="flex flex-col gap-y-2">
      <InputText name="email" onChange={(e) => changeLoginData(e.target)} placeholder="Email" type="email" />
      <InputText
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
        icon="pi pi-sign-in"
        iconPos="right"
        label="Sign in"
        onClick={async () => loginUser()}
      />
    </div>
  );
}
