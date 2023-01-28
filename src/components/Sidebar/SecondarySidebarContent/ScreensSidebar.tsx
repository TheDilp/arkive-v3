import ScreensTree from "../../Tree/ScreensTree";

export default function ScreensSidebar() {
  return (
    <div className="flex h-full flex-1 flex-col bg-zinc-900 p-4">
      <ScreensTree />
    </div>
  );
}
