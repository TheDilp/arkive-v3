export const SectionSizeOptions = [
  {
    label: "Extra small",
    value: "xs",
  },
  {
    label: "Small",
    value: "sm",
  },
  {
    label: "Medium",
    value: "md",
  },
  {
    label: "Large",
    value: "lg",
  },
  {
    label: "Extra large",
    value: "xl",
  },
];

export const getSectionSizeClass = (size: string) => {
  if (size === "xs") return "w-[15rem]";
  if (size === "sm") return "w-[20rem]";
  if (size === "md") return "w-[25rem]";
  if (size === "lg") return "w-[30rem]";
  if (size === "xl") return "w-[35rem]";
  if (size === "xxl") return "w-[40rem]";
  return "w-[25rem]";
};
