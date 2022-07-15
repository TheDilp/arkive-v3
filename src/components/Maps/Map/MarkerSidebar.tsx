import { Sidebar } from "primereact/sidebar";
import { TabPanel, TabView } from "primereact/tabview";
import React, { Dispatch, SetStateAction } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetDocuments, useGetMaps } from "../../../utils/customHooks";
import { supabaseStorageImagesLink } from "../../../utils/utils";

type Props = {
  map_id: string | undefined;
  doc_id: string | undefined;
  show: boolean;
  setMarkerSidebar: Dispatch<
    SetStateAction<{
      map_id: string | undefined;
      doc_id: string | undefined;
      show: boolean;
    }>
  >;
};

export default function MarkerSidebar({
  map_id,
  doc_id,
  show,
  setMarkerSidebar,
}: Props) {
  const { project_id } = useParams();

  function setActiveIndex(doc: boolean, map: boolean) {
    if (doc && map) return 0;
    if (!doc && map) return 1;
    return 0;
  }

  const documents = useGetDocuments(project_id as string);
  const maps = useGetMaps(project_id as string);

  const document = doc_id
    ? documents.data?.find((docs) => docs.id === doc_id)
    : undefined;
  const map = map_id ? maps.data?.find((map) => map.id === map_id) : undefined;
  return (
    <Sidebar
      visible={show}
      onHide={() =>
        setMarkerSidebar({ map_id: undefined, doc_id: undefined, show: false })
      }
    >
      <TabView
        activeIndex={setActiveIndex(
          typeof document !== "undefined",
          typeof map !== "undefined"
        )}
      >
        {document && (
          <TabPanel
            header={
              <div>
                {document.title} <i className="pi pi-file"></i>
              </div>
            }
          >
            <h1>Ayyyyy</h1>
          </TabPanel>
        )}
        {map && (
          <TabPanel
            header={
              <div>
                {map.title} <i className="pi pi-map"></i>
              </div>
            }
          >
            <div className="w-full overflow-hidden">
              <Link to={`../../${map.id}`}>
                <img
                  src={supabaseStorageImagesLink + map.map_image?.link}
                  className="w-full cursor-pointer markerSidebarMapPreview"
                />
              </Link>
            </div>
          </TabPanel>
        )}
      </TabView>
    </Sidebar>
  );
}
