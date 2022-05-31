import { BreadCrumb } from "primereact/breadcrumb";
import { useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { docItemDisplayDialogProps } from "../../../custom-types";
import { useGetDocuments } from "../../../utils/customHooks";
import { docItemDisplayDialogDefault } from "../../../utils/defaultDisplayValues";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import RootPageItem from "./RootPageItem";
import LoadingScreen from "../../Util/LoadingScreen";
import DocumentTreeItemContext from "../DocumentTree/DocumentTreeItemContext";
import DocumentUpdateDialog from "../DocumentTree/DocumentUpdateDialog";
export default function RootFolder() {
  const { project_id } = useParams();
  const { data: documents, isLoading } = useGetDocuments(project_id as string);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const [displayDialog, setDisplayDialog] = useState<docItemDisplayDialogProps>(
    docItemDisplayDialogDefault
  );
  const cm = useRef() as any;
  if (isLoading) return <LoadingScreen />;
  return (
    <article
      className={`text-white h-screen ${
        isTabletOrMobile ? "w-full" : isLaptop ? "w-9" : "w-10"
      } flex flex-wrap justify-content-start align-content-start`}
      onContextMenu={(e) => {
        setDisplayDialog({ ...displayDialog, root: true });
        cm.current.show(e);
      }}
    >
      <DocumentTreeItemContext
        cm={cm}
        displayDialog={displayDialog}
        setDisplayDialog={setDisplayDialog}
      />
      {displayDialog.show && (
        <DocumentUpdateDialog
          displayDialog={displayDialog}
          setDisplayDialog={setDisplayDialog}
        />
      )}
      <BreadCrumb
        model={[]}
        home={{
          icon: "pi pi-home",
          className: "flex align-items-center",
          style: {
            height: "21px",
          },
          // command: () => navigate("../"),
        }}
        className="w-full border-none border-bottom-2 border-noround"
        style={{
          height: "50px",
        }}
      />
      <section
        className={`Lato w-full h-full flex flex-wrap ${
          isTabletOrMobile ? "justify-content-between column-gap-2 " : ""
        } align-content-start align-items-center row-gap-4 px-5 overflow-y-auto`}
      >
        <h1 className="Merriweather w-full">Root Folder</h1>
        {documents &&
          documents
            .filter((doc) => doc.parent === null && !doc.template)
            .map((doc) => (
              <RootPageItem
                key={doc.id}
                doc={doc}
                cm={cm}
                setDisplayDialog={setDisplayDialog}
              />
            ))}
      </section>
    </article>
  );
}
