import { AllItemsType } from "../../types/generalTypes";

export function ParentColumn({ parent }: AllItemsType) {
  return <div className="w-full">{parent?.title}</div>;
}
