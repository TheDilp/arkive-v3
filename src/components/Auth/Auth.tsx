import { Button } from "primereact/button";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, login } from "../../utils/supabaseUtils";
import EarthIMG from "./earthimg.jpg";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const sub = auth.onAuthStateChange((event) => {
      console.log(event);
      if (event === "SIGNED_IN") {
        navigate("/home");
      }
    });
    return () => {
      sub.data?.unsubscribe();
    };
  }, []);
  return auth.user() ? (
    <Navigate to="/home" />
  ) : (
    <div className="w-full h-screen flex align-items-center justify-content-center">
      <div className="surface-card shadow-4 w-full border-round lg:w-6 flex h-full lg:h-20rem flex-wrap">
        <div className="w-full lg:w-7 relative">
          <h1
            className="text-center text-7xl top-0 text-white absolute w-full z-5 Merriweather"
            style={{
              textShadow: "0 0 20px black",
            }}
          >
            Arkive
          </h1>
          <h2
            className="text-center text-5xl text-white absolute w-full z-5 Merriweather"
            style={{
              top: "70%",
              textShadow: "0 0 20px black",
            }}
          >
            Discover your world
          </h2>
          <img
            src={EarthIMG}
            className="w-full h-full absolute transition-all transition-duration-200"
            alt="planet placeholder"
          />
        </div>
        <div className="w-full lg:w-5 p-4">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3 Merriweather">
              Welcome to the Arkive!
            </div>
          </div>

          <div>
            <Button
              className="w-full my-2 text-white Lato border-none"
              onClick={() => login("discord")}
              label="Continue with Discord"
              icon="pi pi-discord"
              iconPos="right"
              style={{
                backgroundColor: "#7289DA",
              }}
            />

            <Button
              className="w-full my-2 bg-blue-500 text-white Lato border-none"
              onClick={() => login("google")}
              label="Continue with Google"
              icon="pi pi-google"
              iconPos="right"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
