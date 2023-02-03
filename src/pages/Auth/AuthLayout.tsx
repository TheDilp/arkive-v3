import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import backgroundImage from "../../assets/earthimg.jpg";

export default function AuthLayout() {
  // if (user) return <Navigate to="/" />;
  return (
    <article className="flex h-full w-full items-center justify-center">
      <div className="relative h-fit w-fit max-w-lg overflow-hidden rounded-md border border-zinc-700 p-4">
        <div className="absolute flex w-[calc(100%-2rem)] flex-col gap-y-0.5 pt-2">
          <div className="text-center font-Merriweather text-4xl font-bold">The Arkive</div>
          <div className="text-center font-Lato text-3xl font-semibold">Discover your world</div>
        </div>
        <img alt="logo" className="mb-4 rounded object-contain" src={backgroundImage} />
        <Suspense fallback={<ProgressSpinner />}>
          <Outlet />
        </Suspense>
      </div>
    </article>
  );
}
