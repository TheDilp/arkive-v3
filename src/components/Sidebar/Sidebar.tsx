import { useLocation } from "react-router-dom";
import TabsList from "../Tab/Tabs";
import { Tab } from "@headlessui/react";
import DocumentsTree from "../Tree/DocumentsTree";
type Props = {};

export default function Sidebar({}: Props) {
  const { pathname } = useLocation();
  if (pathname.includes("wiki"))
    return (
      <div className="w-1/6 flex flex-col bg-zinc-800">
        <Tab.Group>
          <TabsList tabs={["Documents", "Templates"]} />
          <Tab.Panel className="max-w-full p-2 surface-50">
            <DocumentsTree />
          </Tab.Panel>
          <Tab.Panel className="surface-50">TEMPLATES HERE</Tab.Panel>
        </Tab.Group>
      </div>
    );

  return null;
}
