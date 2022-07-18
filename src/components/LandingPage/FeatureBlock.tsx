import { Icon } from "@iconify/react";
import React from "react";
import { featureBlockProps } from "../../custom-types";

export default function FeatureBlock({
  title,
  description,
  icon,
}: featureBlockProps) {
  return (
    <div className="lg:w-3 lg:h-12rem">
      <h5 className="text-lg flex justify-content-center align-items-center">
        {title}
        <Icon icon={`mdi:${icon}`} className="ml-2" fontSize={22} />
      </h5>
      <p className="text-gray-200 text-center">{description}</p>
    </div>
  );
}
