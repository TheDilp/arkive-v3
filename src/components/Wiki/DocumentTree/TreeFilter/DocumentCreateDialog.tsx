import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  CreateDocumentInputs,
  DocumentProps,
  ImageProps,
} from "../../../../custom-types";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Icon } from "@iconify/react";
import { useState } from "react";
import CreateDocIconSelect from "./CreateDocIconSelect";
import {
  useCreateDocument,
  useGetDocuments,
  useGetImages,
} from "../../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { Checkbox } from "primereact/checkbox";
import ImgDropdownItem from "../../../Util/ImgDropdownItem";
import { DocumentCreateDefault } from "../../../../utils/defaultValues";

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
  const images = useGetImages(project_id as string);
  const createDocumentMutation = useCreateDocument(project_id as string);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateDocumentInputs>({
    defaultValues: { parent: null, icon: "mdi:file", folder: false },
  });
  const onSubmit: SubmitHandler<CreateDocumentInputs> = (data) => {
    let id = uuid();
    createDocumentMutation.mutate({
      id,
      ...DocumentCreateDefault,
      ...data,
      template: false,
      project_id: project_id as string,
      content: data.template ? (documents?.find((doc) => doc.id === data.template)?.content || null) : null,
    });

    if (closeOnDone) {
      setVisible(false);
    }
    setIconSelect({
      show: false,
      top: 0,
      left: 0,
    });
  };
  return (
    <Dialog
      className="w-3"
      header={"Create Document"}
      visible={visible}
      onHide={() => {
        setVisible(false);
        reset();
      }}
      modal={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex flex-wrap justify-content-center">
            <div className="w-8">
              <InputText
                placeholder="Document Title"
                className="w-full"
                {...register("title", { required: true, maxLength: 100 })}
                autoFocus={true}
              />
              {errors.title?.type === "required" && (
                <span className="py-1" style={{ color: "var(--red-500)" }}>
                  <i className="pi pi-exclamation-triangle"></i>
                  This field is required
                </span>
              )}
              {errors.title?.type === "maxLength" && (
                <span className="py-1" style={{ color: "var(--red-500)" }}>
                  <i className="pi pi-exclamation-triangle"></i>
                  Length cannot exceed 100 characters!
                </span>
              )}
            </div>
            <div className="w-8 py-2">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    filter
                    filterBy="title"
                    className="w-full"
                    placeholder="Custom Image"
                    optionLabel="title"
                    optionValue="id"
                    virtualScrollerOptions={{
                      lazy: true, onLazyLoad: () => { }, itemSize: 50, showLoader: true, loading: images?.data.length === 0, delay: 0, loadingTemplate: (options) => {
                        return (
                          <div className="flex align-items-center p-2" style={{ height: '38px' }}>
                          </div>
                        )
                      }
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
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                  />
                )}
              />
            </div>
            <div className="w-8">
              <Controller
                name="parent"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    className="w-full"
                    placeholder="Folder"
                    optionLabel="title"
                    optionValue="id"
                    value={field.value}
                    filter
                    onChange={(e) => field.onChange(e.value)}
                    options={
                      documents
                        ? [
                          { title: "Root Folder", id: null },
                          ...documents?.filter((doc) => doc.folder),
                        ]
                        : []
                    }
                  />
                )}
              />
            </div>
            <div className="w-8 mt-2">
              <Controller
                name="template"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    className="w-full"
                    placeholder="Document Template"
                    optionLabel="title"
                    optionValue="id"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={
                      documents
                        ? [
                          { title: "No Template", id: null },
                          ...documents?.filter(
                            (doc) => doc.template && !doc.folder
                          ),
                        ]
                        : []
                    }
                  />
                )}
              />
            </div>
            <div className="w-8 flex justify-content-between my-2">
              <div className="w-1/2 flex align-items-center">
                <span className="pr-1">Is Folder:</span>
                <Controller
                  name="folder"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.checked)}
                    />
                  )}
                />
              </div>

              <div className="w-1/2 flex align-items-center">
                <span className="pr-1">Icon:</span>
                <Icon
                  className="text-2xl cursor-pointer"
                  icon={watch("icon")}
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
                  setValue={setValue}
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
              type="submit"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
