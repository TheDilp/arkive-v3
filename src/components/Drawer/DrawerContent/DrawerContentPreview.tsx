import { useAtomValue } from "jotai";

import { AvailableItemTypes } from "../../../types/generalTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import DocumentPreview from "../DrawerPreview/DocumentPreview";
import MapPreview from "../DrawerPreview/MapPreview";

type Props = {
  type: AvailableItemTypes;
};

export default function DrawerContentPreview({ type }: Props) {
  const drawer = useAtomValue(DrawerAtom);
  if (type === "documents") return <DocumentPreview id={drawer?.data?.id} />;
  if (type === "maps") return <MapPreview />;
  return null;
}
