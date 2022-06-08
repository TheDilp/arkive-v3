import { Card } from "primereact/card";
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <article className="w-full h-screen px-8 Lato flex flex-wrap justify-content-center align-content-start">
      <div className="w-8 flex text-white justify-content-between align-items-start text-xl">
        <div className="flex align-items-center column-gap-5">
          <div>
            <img
              className="w-3rem h-3rem"
              src="/public/android-chrome-512x512.png"
              alt="Arkive Logo"
            />
          </div>
          <div className="hover:text-blue-400">Features</div>
          <div className="hover:text-blue-400">Pricing</div>
          <div className="hover:text-blue-400">
            Discord <i className="pi pi-discord"></i>
          </div>
        </div>
        <div className="flex align-items-center column-gap-5">
          <div className="mt-3">
            <Link
              to="/login"
              className="text-white no-underline hover:text-blue-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <section className="w-6 text-white flex flex-wrap">
        <div className="w-full">
          <h1 className="Merriweather text-7xl text-center">Arkive</h1>
          <h3 className="text-5xl text-center">Discover your world</h3>
        </div>

        <div className="w-full flex justify-content-around">
          
        </div>
      </section>
    </article>
  );
}
