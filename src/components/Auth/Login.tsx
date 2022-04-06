import React, { useEffect, useState } from "react";
import images from "./authImages";
import { user, login } from "../../utils/supabaseUtils";
import "../../styles/Login.css";
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
    <div className="loginPageContainer">
      <div className="loginCard">
        <div className="loginCardImage">
          {images.map((image, imgIDX) => (
            <img
              key={imgIDX}
              src={image.url}
              className=""
              alt="planet placeholder"
              style={{ opacity: index === imgIDX ? 1 : 0 }}
            />
          ))}
        </div>
        <div className="loginCardForm">
            
        </div>
      </div>
    </div>
  );
}
