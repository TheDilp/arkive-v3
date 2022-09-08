import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth, login, supabase } from "../../utils/supabaseUtils";
import EarthIMG from "./earthimg.jpg";

export default function PasswordReset() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");



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
                            Welcome Back
                        </div>
                        <span className="text-600 font-medium line-height-3 Lato">
                            Don't have an account?
                        </span>
                        <Link
                            to="/register"
                            className="font-medium no-underline ml-2 text-blue-500 cursor-pointer Lato"
                        >
                            Register today!
                        </Link>
                    </div>

                    <div>
                        <InputText
                            className="w-full"
                            type="password"
                            value={oldPassword}
                            name="OldPassword"
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Old password"

                        />
                        <InputText
                            className="w-full my-2"
                            value={password1}
                            placeholder="New Password"
                            name="New Password"
                            type={"password"}
                            onChange={(e) => setPassword1(e.target.value)}
                            onKeyDown={(e) => {

                            }}
                        />
                        <InputText
                            className="w-full"
                            value={password2}
                            placeholder="New Password Again"
                            name="New Password Again"
                            type={"password"}
                            onChange={(e) => setPassword2(e.target.value)}
                            onKeyDown={(e) => {

                            }}
                        />

                        <Button
                            className="w-full my-2 text-white Lato border-none"
                            onClick={() => { }
                            }
                            label="Reset"
                            icon="pi pi-user-plus"
                            iconPos="right"
                        />
                        <Button
                            className="w-full my-2 text-white Lato border-none"
                            onClick={async () => {
                                await supabase.auth.api.resetPasswordForEmail("mihailobeograd.dilparic@gmail.com", {
                                    redirectTo: "/passreset"
                                })
                            }
                            }
                            label="Reset INIT"
                            icon="pi pi-user-plus"
                            iconPos="right"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}