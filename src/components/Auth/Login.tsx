import React, { useEffect, useState } from "react";
import images from "./authImages";
import { user, login } from "../../utils/supabaseUtils";
type Props = {};

export default function Login({}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [index, set] = useState(0);
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (index < images.length - 1) {
        set(index + 1);
      } else {
        set(0);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [index]);
  return (
    <div className="w-full h-full flex align-items-center justify-content-center">
      <div className="surface-card shadow-4 w-full border-round w-6 flex">
        <div className="w-7 relative">
          <h1
            className="text-center text-6xl text-white absolute w-full z-5"
            style={{
              textShadow: "0 0 20px black",
            }}
          >
            Discover your world
          </h1>
          {images.map((image, imgIDX) => (
            <img
              key={imgIDX}
              src={image.url}
              className="w-full h-full absolute transition-all transition-duration-200"
              alt="planet placeholder"
              style={{ objectFit: "cover", opacity: index === imgIDX ? 1 : 0 }}
            />
          ))}
        </div>
        <div className="w-5 p-4">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3 ">
              Welcome Back
            </div>
            <span className="text-600 font-medium line-height-3">
              Don't have an account?
            </span>
            <a
              href="/register"
              className="font-medium no-underline ml-2 text-blue-500 cursor-pointer robotoFont"
            >
              Register today!
            </a>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-900 font-medium mb-2 robotoFont"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              className="w-full mb-3"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2 robotoFont"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full mb-3"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  login(email, password);
                }
              }}
            />

            <button
              className="w-full text-white robotoFont"
              onClick={() => login(email, password)}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
