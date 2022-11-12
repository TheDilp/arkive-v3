import { useLocation } from "react-router-dom";
import TabsList from "../Tab/Tabs";
import { Tab } from "@headlessui/react";
import DocumentsTree from "../Tree/DocumentsTree";
import TemplatesTree from "../Tree/TemplatesTree";
type Props = {};

export default function Sidebar({}: Props) {
  const { pathname } = useLocation();
  if (pathname.includes("wiki"))
    return (
      <div className="flex flex-col flex-1 bg-zinc-800">
        <Tab.Group>
          <TabsList tabs={["Documents", "Templates"]} />
          <Tab.Panel className="max-w-full p-2 surface-50">
            <DocumentsTree />
          </Tab.Panel>
          <Tab.Panel className="max-w-full p-2 surface-50">
            <TemplatesTree />
          </Tab.Panel>
        </Tab.Group>
      </div>
    );

  return null;
}
