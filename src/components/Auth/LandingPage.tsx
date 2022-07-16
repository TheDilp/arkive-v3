import { Icon } from "@iconify/react";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../../utils/supabaseUtils";

export default function LandingPage() {
  const user = auth.user();
  if (user) return <Navigate to="/" />;

  return (
    <article className="w-full h-screen Lato flex flex-wrap justify-content-center align-content-start overflow-y-auto px-8">
      <nav className="w-8 flex text-white justify-content-between align-items-start text-xl px-5">
        <div className="flex align-items-center column-gap-5">
          <div>
            <img
              className="w-3rem h-3rem"
              src="android-chrome-512x512.png"
              alt="Arkive Logo"
            />
          </div>
          <div className="hover:text-blue-400 cursor-pointer">Features</div>
          <div className="hover:text-blue-400 cursor-pointer">Pricing</div>
          <div className="hover:text-blue-400 cursor-pointer">FAQ</div>
          <div className="hover:text-blue-400 cursor-pointer">
            Discord <i className="pi pi-discord"></i>
          </div>
        </div>
        <div className="flex align-items-center column-gap-5">
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
      <section className="w-8 text-white flex flex-wrap">
        <div className="w-full">
          <h1 className="Merriweather text-7xl text-center mb-0">Arkive</h1>
          <h3 className="Merriweather text-5xl text-center mt-2">
            Discover your world
          </h3>
        </div>

        <div className="w-full flex flex-wrap row-gap-8 justify-content-around">
          <h2 className="w-full Merriweather text-center text-3xl">Features</h2>

          <div className="w-full flex justify-content-between">
            <div className="w-8">
              <img
                src="WikiCardImg.webp"
                className="w-full h-full border-round-sm shadow-5"
                loading="lazy"
                alt="Wiki showcase"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="w-3">
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

          <div className="w-full flex justify-content-between flex-row-reverse">
            <div className="w-8">
              <img
                src="MapCardImg.webp"
                className="w-full h-full border-round-sm shadow-5"
                loading="lazy"
                alt="Map Showcase"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="w-3">
              <h5 className="Merriweather text-2xl mb-2">
                Maps <i className="pi pi-map text-2xl"></i>
              </h5>
              <p className="w-full text-gray-200 line-height-3">
                Upload maps and mark important locations with pins. Connect
                documents and other maps to pins. Create layers for each map to
                showcase cultures, borders, religions and more.
              </p>

              <a
                href="#mapsFeatures"
                className="hover:text-blue-400 text-white font-medium no-underline text-md p-button p-button-outlined p-button-primary"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="w-full flex justify-content-between">
            <div className="w-8">
              <img
                src="BoardCardImg.webp"
                className="w-full h-full border-round-sm shadow-5"
                loading="lazy"
                alt="Board Showcase"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="w-3">
              <h5 className="text-2xl mb-2 Merriweather">
                Boards <i className="pi pi-share-alt text-2xl"></i>
              </h5>
              <p className="w-full text-gray-200 line-height-3">
                Create customizable graphs, create relations between nodes. Link
                documents to nodes or quickly create nodes from existing
                documents.
              </p>
              <a
                href="#all_features"
                className="hover:text-blue-400 text-white font-medium no-underline text-md p-button p-button-outlined p-button-primary"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      <hr className="w-full mt-8 border-gray-800" />
      <section className="w-full flex flex-wrap row-gap-4 justify-content-around text-white mt-8">
        <h2 className="w-full Merriweather text-center text-3xl my-0">
          Detailed Features
        </h2>
        <h3 className="Lato text-gray-400 text-center text-2xl mt-0">
          Let your imagination loose with our extensive suite of features
        </h3>
        <div className="w-8 flex flex-wrap flex-wrap justify-content-center">
          <div className="w-full">
            <h4 className="Merriweather text-center text-2xl" id="wikiFeatures">
              Wikis
            </h4>
            <div className="flex flex-wrap justify-content-center align-items-start column-gap-2">
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Focus on your writing <Icon icon="mdi:book" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Create immersive descriptions of your worlds using our rich
                  text editor with no word limit to hold you back.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Organize things your way
                  <Icon icon="mdi:file-tree" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Group creations into folders for better and faster navigation.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Categorize with tags
                  <Icon icon="mdi:tag-multiple" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Give documents tags for faster searching and categorizing
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Make documents stand out
                  <Icon icon="mdi:crown" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Mark each document its own special icon to give it some flair.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Speed things up with templates
                  <Icon icon="mdi:content-copy" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  No need to copy-paste when you can use our rich text editor to
                  create reusable templates.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Link everything together
                  <Icon icon="mdi:link-variant" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Quickly link other documents, maps and even boards inside the
                  editor.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Quickly preview linked items
                  <Icon icon="mdi:tooltip-outline" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Hover over linked documents to show a preview. (map and board
                  previews coming soon!)
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Share with the world
                  <Icon icon="mdi:earth" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Make documents public so that anyone can see your work.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Export
                  <Icon icon="mdi:cloud-download-outline" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Your work is yours to keep - export any document in HTML or
                  JSON format.
                </p>
              </div>
            </div>
          </div>
          <hr className="w-full mt-8 border-gray-800" />

          <div className="w-full">
            <h4 className="Merriweather text-center text-2xl" id="mapsFeatures">
              Maps
            </h4>
            <div className="flex flex-wrap justify-content-center align-items-start column-gap-2">
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Map Layers
                  <Icon icon="mdi:layers-triple" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Create layers to add more context to each map Group creations
                  into folders for better and faster navigation.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Pin important locations
                  <Icon icon="mdi:map-marker" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Mark important locations with customizable pins and icons.
                  (more shapes and icons coming soon!)
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Connect documents and maps
                  <Icon icon="mdi:link-variant" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Link pins to documents and maps in order to connect locations
                  in your world and quickly navigate between them.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Quick view
                  <Icon icon="mdi:comment-arrow-left-outline" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Get a quick overview of linked items by clicking on pins.
                </p>
              </div>
              <div className="w-3 h-12rem">
                <h5 className="text-lg flex justify-content-center align-items-center">
                  Organize things your way
                  <Icon icon="mdi:file-tree" fontSize={22} />
                </h5>
                <p className="text-gray-200 text-center">
                  Group creations into folders for better and faster navigation.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="w-3 p-card">
            <h4 className="Merriweather text-center text-xl">Boards</h4>
            <ul className="list-none featuresList">
              <li>
                Create large graphs with countless nodes and relations (family
                trees, guild members, etc.)
              </li>
              <li>
                Customize nodes and relations with different shapes, sizes,
                fonts, colors, images and more
              </li>
              <li>Link documents and nodes to provide extra detail</li>
              <li>
                Drag documents onto the board to quickly create linked nodes
              </li>
            </ul>
          </div> */}
        </div>
      </section>
      <div className="w-full flex flex-wrap row-gap-4 justify-content-around">
        <h2 className="w-full text-white text-center text-3xl">Coming Soon</h2>
      </div>
    </article>
  );
}
