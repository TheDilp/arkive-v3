export default function LandingPageNav() {
  return (
    <nav
      className="w-full sticky bg-gray-900 shadow-3 px-3 z-5 flex text-white justify-content-between align-items-start text-sm lg:text-xl lg:px-8"
      style={{ top: 1 }}
    >
      <div className="flex align-items-center column-gap-4 lg:column-gap-5">
        <div className="flex align-items-end">
          <img
            className="w-3rem h-3rem"
            src="android-chrome-512x512.png"
            alt="Arkive Logo"
          />
          <span className="text-sm">Alpha</span>
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
            href="/auth"
            className="text-white no-underline hover:text-blue-400"
          >
            Sign in
          </a>
        </div>
      </div>
    </nav>
  );
}
