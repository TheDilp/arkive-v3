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
  if (size === "xs") return "min-w-[15rem] max-w-[15rem] w-[15rem]";
  if (size === "sm") return "min-w-[20rem] max-w-[20rem] w-[20rem]";
  if (size === "md") return "min-w-[25rem] max-w-[25rem] w-[25rem]";
  if (size === "lg") return "min-w-[30rem] max-w-[30rem] w-[30rem]";
  if (size === "xl") return "min-w-[35rem] max-w-[35rem] w-[35rem]";
  if (size === "xxl") return "min-w-[40rem] max-w-[40rem] w-[40rem]";
  return "min-w-[25rem] max-w-[25rem] w-[25rem]";
};
