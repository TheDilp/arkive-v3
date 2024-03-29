import { useAtomValue } from "jotai";

import ScreenView from "../../../pages/ScreenView/ScreenView";
import { AvailableItemTypes } from "../../../types/generalTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import DocumentPreview from "../DrawerPreview/DocumentPreview";

type Props = {
  type: AvailableItemTypes;
};

export default function DrawerContentPreview({ type }: Props) {
  const drawer = useAtomValue(DrawerAtom);
  if (type === "documents") return <DocumentPreview id={drawer?.data?.id} isReadOnly={drawer?.exceptions?.isReadOnly} />;
  if (type === "screens") return <ScreenView id="70a4f6d6-b21b-4817-8663-56bdde4f9a51" isReadOnly />;
  return null;
}
