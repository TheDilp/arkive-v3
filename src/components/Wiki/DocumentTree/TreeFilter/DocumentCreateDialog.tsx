import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { ImageProps } from "../../../../custom-types";
import {
  useCreateDocument,
  useGetDocuments,
  useGetImages,
} from "../../../../utils/customHooks";
import { DocumentCreateDefault } from "../../../../utils/defaultValues";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";
import CreateDocIconSelect from "./CreateDocIconSelect";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function DocumentCreateDialog({ visible, setVisible }: Props) {
  const [iconSelect, setIconSelect] = useState({
    show: false,
    top: 0,
    left: 0,
  });
  const [closeOnDone, setCloseOnDone] = useState(true);
  const { project_id } = useParams();
  const { data: documents } = useGetDocuments(project_id as string);
  const [newDocData, setNewDocdata] = useState(DocumentCreateDefault);
  const images = useGetImages(project_id as string);
  const createDocumentMutation = useCreateDocument(project_id as string);

  return (
    <Dialog
      className="w-3"
      header={"Create Document"}
      visible={visible}
      onHide={() => {
        setVisible(false);
      }}
      modal={false}
    >
      <div>
        <div className="flex flex-wrap justify-content-center">
          <div className="w-8">
            <InputText
              placeholder="Document Title"
              className="w-full"
              autoFocus={true}
              value={newDocData.title}
              onChange={(e) =>
                setNewDocdata((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="w-8 py-2">
            <Dropdown
              filter
              filterBy="title"
              className="w-full"
              placeholder="Custom Image"
              optionLabel="title"
              optionValue="id"
              virtualScrollerOptions={{
                lazy: true,
                onLazyLoad: () => {},
                itemSize: 50,
                showLoader: true,
                loading: images?.data.length === 0,
                delay: 0,
                loadingTemplate: (options) => {
                  return (
                    <div
                      className="flex align-items-center p-2"
                      style={{ height: "38px" }}
                    ></div>
                  );
                },
              }}
              itemTemplate={(item: ImageProps) => (
                <ImgDropdownItem title={item.title} link={item.link} />
              )}
              options={
                images?.data
                  ? [
                      { title: "No image", id: null },
                      ...images?.data.filter(
                        (image: ImageProps) => image.type === "Image"
                      ),
                    ]
                  : []
              }
              value={newDocData.image}
              onChange={(e) =>
                setNewDocdata((prev) => ({ ...prev, image: e.value }))
              }
            />
          </div>
          <div className="w-8">
            <Dropdown
              className="w-full"
              placeholder="Folder"
              optionLabel="title"
              optionValue="id"
              value={newDocData.parent}
              filter
              onChange={(e) =>
                setNewDocdata((prev) => ({ ...prev, parent: e.value }))
              }
              options={
                documents
                  ? [
                      { title: "Root Folder", id: null },
                      ...documents?.filter((doc) => doc.folder),
                    ]
                  : []
              }
            />
          </div>

          <div className="w-8 flex justify-content-between my-2">
            <div className="w-1/2 flex align-items-center">
              <span className="pr-1">Is Folder:</span>
              <Checkbox
                checked={newDocData.folder}
                onChange={(e) =>
                  setNewDocdata((prev) => ({ ...prev, folder: e.checked }))
                }
              />
            </div>

            <div className="w-1/2 flex align-items-center">
              <span className="pr-1">Icon:</span>
              <Icon
                className="text-2xl cursor-pointer"
                icon={newDocData.icon}
                onClick={(e) =>
                  setIconSelect({
                    ...iconSelect,
                    show: true,
                    top: e.clientY,
                    left: e.clientX,
                  })
                }
              />
              <CreateDocIconSelect
                {...iconSelect}
                setValue={(icon) =>
                  setNewDocdata((prev) => ({ ...prev, icon }))
                }
                setIconSelect={setIconSelect}
              />
            </div>
          </div>

          <div className="w-8 my-2">{/* <CategoryAutocomplete /> */}</div>
          <div className="w-8 flex mb-2 justify-content-between">
            <span>Close Dialog on Done:</span>
            <Checkbox
              checked={closeOnDone}
              onChange={(e) => setCloseOnDone(e.checked)}
            />
          </div>
        </div>
        <div className="flex justify-content-end">
          <Button
            label="Create Document"
            className="p-button-success p-button-outlined p-button-raised"
            icon="pi pi-plus"
            iconPos="right"
            onClick={() => {
              let id = uuid();
              createDocumentMutation.mutate({
                id,
                ...newDocData,
                project_id: project_id as string,
              });

              if (closeOnDone) {
                setVisible(false);
              }
              setIconSelect({
                show: false,
                top: 0,
                left: 0,
              });
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
