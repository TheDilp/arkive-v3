import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link } from "react-router-dom";

import { toaster } from "../../utils/toast";

export default function Signup() {
  const auth = getAuth();

  const [signUpData, setSignUpData] = useState({ email: "", password: "", confirm_password: "" });

  function changeSignUpData({ name, value }: { name: string; value: string }) {
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  }
  const passwordsDontMatch =
    (signUpData.password || signUpData.confirm_password) && signUpData.password !== signUpData.confirm_password;

  const matchesRequirements = signUpData.password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{6,}$/g);

  async function signUpUser() {
    if (signUpData.email && signUpData.password && signUpData.password === signUpData.confirm_password) {
      createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toaster("error", `${errorCode}: ${errorMessage}`);
      });
    } else {
      if (signUpData.password !== signUpData.confirm_password) toaster("error", "Passwords do not match.");
      if (!signUpData.email) toaster("error", "No email entered.");
      if (!signUpData.password) toaster("error", "No password entered.");
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      {!matchesRequirements && (signUpData.password || signUpData.confirm_password) ? (
        <>
          <small className="p-error block">Password must be at least 6 characters and not more than 36.</small>
          <small className="p-error block">
            Passwords must contain at least one number, one uppercase letter, one lowercase letter and one special character.
          </small>
        </>
      ) : null}
      {passwordsDontMatch ? <small className="p-error block">Passwords do not match</small> : null}
      <InputText
        name="email"
        onChange={(e) => changeSignUpData(e.target)}
        placeholder="Email"
        type="email"
        value={signUpData.email}
      />
      <InputText
        className={passwordsDontMatch ? "p-invalid" : ""}
        name="password"
        onChange={(e) => changeSignUpData(e.target)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") await signUpUser();
        }}
        placeholder="Password"
        type="password"
        value={signUpData.password}
      />
      <InputText
        className={passwordsDontMatch ? "p-invalid" : ""}
        name="confirm_password"
        onChange={(e) => changeSignUpData(e.target)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") await signUpUser();
        }}
        placeholder="Confirm password"
        type="password"
        value={signUpData.confirm_password}
      />

      <Link className="flex w-full justify-end " to="/auth/signin">
        <small className="group cursor-pointer text-right text-xs text-zinc-500 transition-colors hover:text-sky-200">
          Already have an account?
          <span className="text-zinc-500 transition-colors group-hover:text-sky-200"> Sign in</span>
        </small>
      </Link>

      <Button className="p-button-success p-button-outlined" label="Sign up" onClick={async () => signUpUser()} />
    </div>
  );
}
