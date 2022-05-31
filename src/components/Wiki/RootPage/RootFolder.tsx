import { BreadCrumb } from "primereact/breadcrumb";
import { useContext, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { docItemDisplayDialogProps } from "../../../custom-types";
import { useGetDocuments } from "../../../utils/customHooks";
import { docItemDisplayDialogDefault } from "../../../utils/defaultDisplayValues";
import { MediaQueryContext } from "../../Context/MediaQueryContext";
import RootPageItem from "./RootPageItem";

export default function RootFolder() {
  const { project_id } = useParams();
  const { data: documents, isLoading } = useGetDocuments(project_id as string);
  const { isTabletOrMobile, isLaptop } = useContext(MediaQueryContext);
  const [displayDialog, setDisplayDialog] = useState<docItemDisplayDialogProps>(
    docItemDisplayDialogDefault
  );
  const cm = useRef() as any;
  return (
    <article
      className={`text-white h-screen ${
        isTabletOrMobile ? "w-full" : isLaptop ? "w-9" : "w-10"
      } flex flex-wrap justify-content-start align-content-start`}
    >
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
