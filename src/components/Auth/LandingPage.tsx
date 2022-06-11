import { Icon } from "@iconify/react";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../../utils/supabaseUtils";

export default function LandingPage() {
  const user = auth.user();
  if (user) return <Navigate to="/home" />;

  return (
    <article className="w-full h-screen px-8 Lato flex flex-wrap justify-content-center align-content-start">
      <div className="w-8 flex text-white justify-content-between align-items-start text-xl">
        <div className="flex align-items-center column-gap-5">
          <div>
            <img
              className="w-3rem h-3rem"
              src="/android-chrome-512x512.png"
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

        <div className="w-full flex flex-wrap row-gap-4 justify-content-around">
          <h2 className="w-full text-center">Features</h2>
          <div className="w-16rem h-16rem shadow-3 surface-100 border-rounded">
            <h3 className="Lato text-center text-3xl">
              Wiki
              <Icon icon="mdi:files" />
            </h3>
          </div>
          <div className="w-16rem h-16rem shadow-3 surface-100 border-rounded">
            <h3 className="Lato text-center text-3xl">
              Wiki
              <Icon icon="mdi:files" />
            </h3>
          </div>
          <div className="w-16rem h-16rem shadow-3 surface-100 border-rounded">
            <h3 className="Lato text-center text-3xl">
              Wiki
              <Icon icon="mdi:files" />
            </h3>
          </div>
          <div className="w-16rem h-16rem shadow-3 surface-100 border-rounded">
            <h3 className="Lato text-center text-3xl">
              Wiki
              <Icon icon="mdi:files" />
            </h3>
          </div>
          <div className="w-16rem h-16rem shadow-3 surface-100 border-rounded">
            <h3 className="Lato text-center text-3xl">
              Wiki
              <Icon icon="mdi:files" />
            </h3>
          </div>
          <div className="w-16rem h-16rem shadow-3 surface-100 border-rounded">
            <h3 className="Lato text-center text-3xl">
              Wiki
              <Icon icon="mdi:files" />
            </h3>
          </div>
        </div>
      </section>
    </article>
  );
}
