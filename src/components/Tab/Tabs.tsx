import { Tab } from "@headlessui/react";

type Props = {
  tabs: string[];
};

export default function TabsList({ tabs }: Props) {
  return (
    <Tab.List className="flex">
      {tabs.map((tab) => (
        <Tab key={tab} className="flex flex-1">
          {({ selected }) => (
            /* Use the `selected` state to conditionally style the selected tab. */
            <button
              className={`flex-1 px-4 py-2 focus:outline-none  
            ${selected ? "bg-blue-500 text-white" : ""}
          `}
            >
              {tab}
            </button>
          )}
        </Tab>
      ))}
    </Tab.List>
  );
}
