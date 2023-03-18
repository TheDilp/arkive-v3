import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import { RemirrorJSON } from "remirror";

import { useGetItem } from "../../../hooks/useGetItem";
import { DocumentType } from "../../../types/ItemTypes/documentTypes";
import { DrawerAtom } from "../../../utils/Atoms/atoms";
import { DefaultDrawer } from "../../../utils/DefaultValues/DrawerDialogDefaults";
import { IconEnum } from "../../../utils/DefaultValues/GeneralDefaults";
import StaticRender from "../../Editor/StaticRender";

export default function DrawerEventDescription() {
  const [drawer, setDrawer] = useAtom(DrawerAtom);
  const { data: document, isFetching } = useGetItem<DocumentType>(drawer?.data?.documentsId, "documents", {
    enabled: !!drawer?.data?.documentsId,
  });
  return (
    <div>
      <h2 className="sticky top-0 flex items-center justify-between bg-zinc-800 pb-2 font-Lato text-2xl">
        {drawer?.data?.title}
        {!drawer?.exceptions?.isReadOnly ? (
          <Icon
            className="cursor-pointer transition-colors hover:text-sky-400"
            icon={IconEnum.edit}
            onClick={() => {
              setDrawer({ ...DefaultDrawer, show: true, type: "events", data: drawer.data });
            }}
          />
        ) : null}
      </h2>
      <hr className="my-2 border-zinc-700" />
      <div className="drawerEventDescription h-full overflow-y-auto">
        {document ? <StaticRender content={document.content as RemirrorJSON} /> : null}
        {!document && !isFetching ? drawer?.data?.description : null}
      </div>
    </div>
  );
}
