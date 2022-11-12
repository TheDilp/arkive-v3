import { Icon } from "@iconify/react";

export const buttonLabelWithIcon = (
  title: string,
  icon: string,
  size?: number,
) => (
  <div className="flex items-center gap-x-1">
    <span>{title}</span>
    <Icon icon={icon} fontSize={size || 16} />
  </div>
);
