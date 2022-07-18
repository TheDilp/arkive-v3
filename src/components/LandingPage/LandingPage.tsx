import { Navigate } from "react-router-dom";
import {
  ArkivistTier,
  BoardFeatureBlocks,
  CuratorTier,
  MapFeatureBlocks,
  ProjectFeatureBlocks,
  WikiFeatureBlocks
} from "../../utils/landingPageUtils";
import { auth } from "../../utils/supabaseUtils";
import FeatureBlock from "./FeatureBlock";
import PricingCard from "./PricingCard";

export default function LandingPage() {
  const user = auth.user();
  if (user) return <Navigate to="/home" />;

  return (
    <article
      className="w-full h-screen Lato flex flex-wrap justify-content-center align-content-start overflow-y-auto"
      style={{
        scrollBehavior: "smooth",
      }}
    >
      <nav
        className="w-full sticky bg-gray-900 shadow-3 px-3 z-5 flex text-white justify-content-between align-items-start text-sm lg:text-xl lg:px-8"
        style={{ top: 1 }}
      >
        <div className="flex align-items-center column-gap-4 lg:column-gap-5">
          <div>
            <img
              className="w-3rem h-3rem"
              src="android-chrome-512x512.png"
              alt="Arkive Logo"
            />
          </div>
          <div className="hover:text-blue-400 cursor-pointer">
            <a
              href="#features"
              className="hover:text-blue-400 text-white font-medium no-underline"
            >
              Features
            </a>
          </div>
          <div className="hover:text-blue-400 cursor-pointer">
            <a
              href="#pricing"
              className="hover:text-blue-400 text-white font-medium no-underline"
            >
              Pricing
            </a>
          </div>
          <div className="hover:text-blue-400 cursor-pointer">FAQ</div>
          <div className="hover:text-blue-400 cursor-pointer">
            <a
              href="https://discord.gg/AnbtkzrffA"
              className="no-underline"
              target="_blank"
              rel="noreferrer"
            >
              <span
                className="hidden lg:inline hover:text-indigo-300"
                style={{
                  color: "#7289da",
                }}
              >
                Discord
              </span>
              <i className="pi pi-discord"></i>
            </a>
          </div>
        </div>
        <div className="flex align-items-center ml-5 lg:ml-0">
          <div className="mt-3 cursor-pointer">
            <a
              href="/login"
              className="text-white no-underline hover:text-blue-400"
            >
              Sign in
            </a>
          </div>
        </div>
      </nav>
      <section className="w-8 text-white flex flex-wrap lg:px-8">
        <div className="w-full">
          <h1 className="Merriweather text-7xl text-center mb-0">Arkive</h1>
          <h3 className="Merriweather text-5xl text-center mt-2">
            Discover your world
          </h3>
        </div>

        {/* All Features */}
        <div className="w-full flex flex-wrap lg:row-gap-8 justify-content-around">
          <h2
            className="w-full Merriweather text-center text-3xl"
            id="features"
          >
            Features
          </h2>

          <div className="w-full flex flex-wrap lg:flex-nowrap justify-content-between">
            <div className="w-full lg:w-8">
              <img
                src="WikiCardImg.webp"
                className="w-full h-full border-round-sm shadow-5 hidden lg:inline"
                loading="lazy"
                alt="Wiki showcase"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="w-full text-center lg:w-3 lg:text-left">
              <h5 className="Merriweather text-2xl mb-2">
                Wikis <i className="pi pi-book text-2xl"></i>
              </h5>
              <p className="w-full text-gray-200 line-height-3">
                Create wikis with our rich text editor. Organize your documents
                however you want. Speed up your workflow with templates. Link
                other documents, maps and more.
              </p>

              <a
                href="#wikiFeatures"
                className="hover:text-blue-400 text-white font-medium no-underline text-md p-button p-button-outlined p-button-primary"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="w-full flex flex-wrap lg:flex-nowrap justify-content-between flex-row-reverse">
            <div className="w-full lg:w-8">
              <img
                src="MapCardImg.webp"
                className="w-full h-full border-round-sm shadow-5 hidden lg:inline"
                loading="lazy"
                alt="Map Showcase"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="w-full text-center lg:w-3 lg:text-left">
              <h5 className="Merriweather text-2xl mb-2">
                Maps <i className="pi pi-map text-2xl"></i>
              </h5>
              <p className="w-full text-gray-200 line-height-3">
                Upload maps and mark important locations with pins. Connect
                documents and other maps to pins. Create layers for each map to
                showcase cultures, borders, religions and more.
              </p>

              <a
                href="#wikiFeatures"
                className="hover:text-blue-400 text-white font-medium no-underline text-md p-button p-button-outlined p-button-primary"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="w-full flex flex-wrap lg:flex-nowrap justify-content-between">
            <div className="w-full lg:w-8">
              <img
                src="BoardCardImg.webp"
                className="w-full h-full border-round-sm shadow-5 hidden lg:inline"
                loading="lazy"
                alt="Board Showcase"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="w-full text-center lg:w-3 lg:text-left">
              <h5 className="text-2xl mb-2 Merriweather">
                Boards <i className="pi pi-share-alt text-2xl"></i>
              </h5>
              <p className="w-full text-gray-200 line-height-3">
                Create customizable graphs, create relations between nodes. Link
                documents to nodes or quickly create nodes from existing
                documents.
              </p>
              <a
                href="#wikiFeatures"
                className="hover:text-blue-400 text-white font-medium no-underline text-md p-button p-button-outlined p-button-primary"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className="w-full mt-8 border-gray-800" />

      <section className="w-full flex flex-wrap row-gap-4 justify-content-around text-white mt-8 lg:px-8">
        <h2 className="w-full Merriweather text-center text-3xl my-0">
          Detailed Features
        </h2>
        <h3 className="Lato text-gray-400 text-center text-2xl mt-0">
          Unleash your imagination with our extensive suite of features
        </h3>

        <div className="w-8 flex flex-wrap flex-wrap justify-content-center">
          {/* Global Features */}
          <div className="w-full">
            <h4 className="Merriweather text-center text-2xl" id="wikiFeatures">
              Projects
            </h4>
            <div className="flex flex-wrap justify-content-center align-items-start column-gap-2">
              {ProjectFeatureBlocks.map((block) => (
                <FeatureBlock {...block} key={block.icon} />
              ))}
            </div>
          </div>
          <hr className="w-full mt-0 border-gray-800" />
          {/* Wikis Features */}
          <div className="w-full">
            <h4 className="Merriweather text-center text-2xl" id="wikiFeatures">
              Wikis
            </h4>
            <div className="flex flex-wrap justify-content-center align-items-start column-gap-2">
              {WikiFeatureBlocks.map((block) => (
                <FeatureBlock key={block.icon} {...block} />
              ))}
            </div>
          </div>

          <hr className="w-full mt-8 border-gray-800" />

          {/* Maps Features */}
          <div className="w-full">
            <h4 className="Merriweather text-center text-2xl" id="mapsFeatures">
              Maps
            </h4>
            <div className="flex flex-wrap justify-content-center align-items-start column-gap-2">
              {MapFeatureBlocks.map((block) => (
                <FeatureBlock key={block.icon} {...block} />
              ))}
            </div>
          </div>

          <hr className="w-full mt-0 border-gray-800" />

          {/* Boards Features */}
          <div className="w-full">
            <h4 className="Merriweather text-center text-xl">Boards</h4>
            <div className="flex flex-wrap justify-content-center align-items-start column-gap-2">
              {BoardFeatureBlocks.map((block) => (
                <FeatureBlock key={block.icon} {...block} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <hr className="w-full mt-0 border-gray-800" />

      {/* Pricing section */}
      <section className="w-10 lg:w-8 text-white lg:px-8" id="pricing">
        <h2 className="w-full Merriweather text-center text-3xl my-0">
          Pricing
        </h2>
        <div className="flex flex-wrap lg:flex-nowrap mt-5 w-full justify-content-evenly">
          <PricingCard {...ArkivistTier} />
          <PricingCard {...CuratorTier} />
        </div>
      </section>
    </article>
  );
}
