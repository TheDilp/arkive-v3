import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { RemirrorJSON } from "remirror";

import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import StaticRender from "../../Editor/StaticRender";

type Props = {};

export default function DrawerEventDescription({}: Props) {
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const { data: document } = useGetItem<DocumentType>(drawer?.data?.documentsId, "documents", {
    enabled: !!drawer?.data?.documentsId,
  });
  return (
    <div>
      <h2 className="sticky top-0 flex items-center justify-between bg-zinc-800 pb-2 font-Lato text-2xl">
        Some event title
        <Icon
          className="cursor-pointer transition-colors hover:text-sky-400"
          icon="mdi:pencil-outline"
          onClick={() => {
            setDrawer({ ...DefaultDrawer, show: true, type: "events", data: drawer.data });
          }}
        />
      </h2>
      <hr className="my-2 border-zinc-700" />
      <div className="h-full overflow-y-auto">
        {document ? <StaticRender content={document.content as RemirrorJSON} /> : drawer?.data?.description}
      </div>
    </div>
  );
}
