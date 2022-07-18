import { Icon } from "@iconify/react";
import { pricingTierProps } from "../../custom-types";

export default function PricingCard({
  title,
  price,
  features,
}: pricingTierProps) {
  return (
    <div className="p-card bg-gray-800 w-4 mb-5">
      <div className="p-card-title mb-0 pt-2">
        <h3 className="text-center text-4xl mt-2 Merriweather">{title}</h3>
      </div>
      <div className="p-card-content pt-0">
        <h4 className="text-center text-xl">
          {price}
          <span className="text-sm">/ month</span>
        </h4>

        <div className="px-2">
          <h5 className="font-medium text-base text-gray-200 pl-2">
            What you get:
          </h5>
          <ul className="list-none text-lg pl-2">
            {features.map((feature) => (
              <li key={feature} className="my-2">
                <i className="pi pi-check text-primary"></i>
                {feature}
              </li>
            ))}
          </ul>
          <div className="w-full text-center mt-6 mb-5">
            <a
              className="p-button p-button-raised bg-blue-700 border-blue-700 text-white font-bold no-underline"
              href="#a"
            >
              Join now! (via Patreon)
              <Icon icon="mdi:patreon" className="" />
            </a>
          </div>
          <p className="text-sm text-gray-100 ml-2">
            Want to learn more? Have questions? Join us on
            <a
              href="https://discord.gg/AnbtkzrffA"
              className="font-bold no-underline"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#7289da",
              }}
            >
              {" "}
              Discord!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
