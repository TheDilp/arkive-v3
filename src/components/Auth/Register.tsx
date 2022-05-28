import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { RegisterInputs } from "../../custom-types";
import { auth, register as accountRegister } from "../../utils/supabaseUtils";
import { emailRegex } from "../../utils/utils";
import EarthIMG from "./earthimg.jpg";

export default function Register() {
  const [index, set] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>();
  const onSubmit: SubmitHandler<RegisterInputs> = (data) =>
    accountRegister(data.email, data.password);
  return auth.user() ? (
    <Navigate to="/" />
  ) : (
    <form
      className="w-full h-screen flex align-items-center justify-content-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="surface-card shadow-4 w-full border-round lg:w-6 flex h-full lg:h-min flex-wrap">
        <div className="w-full lg:w-7 relative">
          <h1
            className="text-center text-6xl text-white absolute w-full z-5 Merriweather"
            style={{
              textShadow: "0 0 20px black",
            }}
          >
            Discover your world
          </h1>
          <img
            src={EarthIMG}
            className="w-full h-full absolute transition-all transition-duration-200"
            alt="planet placeholder"
          />
        </div>
        <div className="w-full lg:w-5 p-4">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3 Merriweather">
              Welcome To Arkive
            </div>
            <span className="text-600 font-medium line-height-3 Lato">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="font-medium no-underline ml-2 text-blue-500 cursor-pointer Lato"
            >
              Login
            </Link>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-900 font-medium mb-2 Lato"
            >
              Email
            </label>
            <InputText
              id="email"
              type="text"
              className="w-full mb-3"
              {...register("email", {
                required: true,
                pattern: emailRegex,
              })}
            />
            {errors.email?.type === "required" && (
              <span style={{ color: "var(--red-400)" }}>
                This field is required
              </span>
            )}
            {errors.email?.type === "pattern" && (
              <span style={{ color: "var(--red-400)" }}>
                Please enter a valid email
              </span>
            )}
            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2 Lato"
            >
              Password
            </label>
            <InputText
              id="password"
              type="password"
              className="w-full mb-3"
              {...register("password", {
                required: true,
                minLength: 8,
                // pattern: passwordRegex,
              })}
            />
            {errors.password?.type === "required" && (
              <span style={{ color: "var(--red-400)" }}>
                This field is required
              </span>
            )}
            {errors.password?.type === "pattern" && (
              <span style={{ color: "var(--red-400)" }}>
                Password must be minimum of 8 characters, at least one letter,
                one number and one special character!
              </span>
            )}
            <div className="py-1">
              <Button
                label="Sign Up"
                icon="pi pi-user-plus"
                className="w-full text-white Lato"
                type="submit"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
