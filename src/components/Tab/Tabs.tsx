import { Tab } from "@headlessui/react";

type Props = {
  tabs: string[];
};

export default function TabsList({ tabs }: Props) {
  return (
    <Tab.List className="flex">
      {tabs.map((tab) => (
        <Tab key={tab} className="flex flex-1 border-none outline-none">
          {({ selected }) => (
            /* Use the `selected` state to conditionally style the selected tab. */
            <div
              className={`flex-1 px-4 py-2
            ${selected ? "bg-blue-500 text-white" : ""}
          `}
            >
              {tab}
            </div>
          )}
        </Tab>
      ))}
    </Tab.List>
  );
}
