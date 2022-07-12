import { Icon } from "@iconify/react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link, useParams } from "react-router-dom";
import { ImageProps } from "../../../custom-types";
import {
  useGetBoards,
  useGetDocumentData,
  useGetImages,
  useGetMaps,
  useUpdateDocument,
} from "../../../utils/customHooks";
import { supabaseStorageImagesLink } from "../../../utils/utils";
import ImgDropdownItem from "../../Util/ImgDropdownItem";

export default function LinkedItems() {
  const { project_id, doc_id } = useParams();
  const document = useGetDocumentData(project_id as string, doc_id as string);
  const maps = useGetMaps(project_id as string);
  const boards = useGetBoards(project_id as string);
  const images = useGetImages(project_id as string);

  const linkedMaps =
    maps.data?.filter((map) =>
      map.markers.some((marker) => marker.doc_id === doc_id)
    ) || [];
  const linkedMarkers = linkedMaps
    .map((map) => map.markers.filter((marker) => marker.doc_id === doc_id))
    ?.flat();
  const linkedBoards =
    boards.data?.filter((board) =>
      board.nodes.some((node) => node.document?.id === doc_id)
    ) || [];
  const linkedNodes = linkedBoards
    .map((board) => board.nodes.filter((node) => node.document?.id === doc_id))
    .flat();
  const updateDocumentMutation = useUpdateDocument(project_id as string);
  return (
    <Accordion activeIndex={[0, 1, 2, 3]} multiple>
      {/* Linked Maps */}
      <AccordionTab
        header={
          <span className="flex align-items-center">
            <Icon icon="mdi:map" fontSize={22} /> Maps
          </span>
        }
        contentClassName="overflow-y-auto h-10rem"
      >
        {maps.isLoading ? (
          <div className="w-full flex justify-content-center">
            <ProgressSpinner />
          </div>
        ) : (
          linkedMarkers.map((marker) => (
            <Link
              key={marker.id}
              to={`../../maps/${marker.map_id}/${marker.id}`}
              className="no-underline text-white flex flex-nowrap align-items-center hover:text-primary fontWeight700"
            >
              <Icon icon="mdi:map-marker" />
              {linkedMaps.find((map) => map.id === marker.map_id)?.title}
            </Link>
          ))
        )}
      </AccordionTab>
      {/* Linked Boards */}
      <AccordionTab
        header={
          <span className="flex align-items-center">
            <Icon icon="mdi:draw" fontSize={22} /> Boards
          </span>
        }
        contentClassName="overflow-y-auto h-10rem"
      >
        {boards.isLoading ? (
          <div className="w-full flex justify-content-center">
            <ProgressSpinner />
          </div>
        ) : (
          linkedNodes.map((node) => (
            <Link
              key={node.id}
              to={`../../boards/${node.board_id}/${node.id}`}
              className="no-underline text-white flex flex-nowrap align-items-center hover:text-primary fontWeight700"
            >
              <Icon icon="mdi:draw" />
              {linkedBoards.find((board) => board.id === node.board_id)
                ?.title || "Board"}
            </Link>
          ))
        )}
      </AccordionTab>
      <AccordionTab
        header={
          <div>
            <i className="pi pi-fw pi-image"></i> Document Image
          </div>
        }
      >
        {document?.image && (
          <div className="flex flex-nowrap justify-content-center mb-2">
            <Image
              src={`${supabaseStorageImagesLink}${document.image.link}`}
              alt="Document"
              className="w-10rem h-10rem"
              imageClassName="w-full h-full"
              preview
              // @ts-ignore
              // Wrong typing provided(string instead of object) so ignore the error
              imageStyle={{
                objectFit: "contain",
              }}
            />
          </div>
        )}
        <div className="w-full flex flex-wrap justify-content-evenly">
          <div className="w-full my-3 flex justify-content-center">
            <Dropdown
              className="w-10"
              filter
              filterBy="title"
              options={
                images?.data
                  ? [
                      {
                        title: "No Image",
                        link: "",
                      },
                      ...images.data,
                    ]
                  : []
              }
              optionLabel="title"
              value={document?.image || undefined}
              onChange={(e) =>
                updateDocumentMutation.mutate({
                  id: doc_id as string,
                  image: e.value,
                })
              }
              itemTemplate={(item: ImageProps) => (
                <ImgDropdownItem title={item.title} link={item.link} />
              )}
            />
          </div>
        </div>
      </AccordionTab>
      <AccordionTab
        header={
          <div>
            <i className="pi pi-fw pi-cog"></i> Settings
          </div>
        }
      >
        <div className="w-full flex flex-wrap justify-content-evenly">
          <div className="w-full flex flex-nowrap justify-content-between my-2">
            <label className="mx-2">Public:</label>
            <Checkbox
              checked={document?.public}
              tooltip="If checked, anyone can access the content via a public page"
              tooltipOptions={{ showDelay: 500, position: "left" }}
              onChange={(e) =>
                updateDocumentMutation.mutate({
                  id: doc_id as string,
                  public: e.checked,
                })
              }
            />
          </div>
        </div>
      </AccordionTab>
    </Accordion>
  );
}
