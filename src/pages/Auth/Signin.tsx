import { useAuthorizer } from "@authorizerdev/authorizer-react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

import { toaster } from "../../utils/toast";

export default function Signin() {
  const auth = useAuthorizer();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  function changeLoginData({ name, value }: { name: string; value: string }) {
    setLoginData((prev) => ({ ...prev, [name]: value }));
  }
  async function loginUser() {
    if (loginData.email && loginData.password) {
      const res = await auth.authorizerRef.login(loginData);
      if (res && res?.user) {
        auth.setToken({
          access_token: res.access_token,
          refresh_token: res.refresh_token,
          id_token: res.id_token,
          expires_in: res.expires_in,
        });
        auth.setUser(res.user);
      }
    } else {
      if (!loginData.email) toaster("error", "No email entered.");
      if (!loginData.password) toaster("error", "No password entered.");
    }
  }

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
