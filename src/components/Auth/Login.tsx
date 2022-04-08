import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import { auth, login } from "../../utils/supabaseUtils";
import images from "./authImages";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
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
  return auth.user() ? (
    <Navigate to="/" />
  ) : (
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
          <div>
            <h1 className="loginCardFormTitle">Welcome Back</h1>
            <h3 className="loginCardFormSubtitle">
              Don't have an account? <a href="/register">Register Today!</a>
            </h3>
          </div>
          <div className="loginCardFormInputContainer">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="loginCardFormInputContainer">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="loginCardFormButtonContainer">
            <button
              className="loginCardFormButton"
              onClick={async () => {
                let user = await login(email, password);
                if (user) navigate("/");
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
