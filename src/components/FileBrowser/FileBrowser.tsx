import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { FileUpload } from "primereact/fileupload";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetImages } from "../../utils/customHooks";
import { uploadImage } from "../../utils/supabaseUtils";
import { FileObject } from "../../utils/utils";

type Props = {};

export default function FileBrowser({}: Props) {
  const { project_id } = useParams();
  const [layout, setLayout] = useState("list");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(undefined);

  const renderListItem = (data: FileObject) => {
    return (
      <div className="col-12 flex p-2">
        <div className="product-list-item w-5rem">
          <img
            className="relative w-full h-full"
            style={{
              objectFit: "contain",
            }}
            src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${project_id}/${data.name}`}
            alt="TEST"
          />
        </div>
        <div className="w-10rem ml-2 flex align-items-center ml-4">
          <div className="product-list-detail">
            <div className="product-name">{data.name}</div>
          </div>
        </div>
      </div>
    );
  };
  const renderGridItem = (data: FileObject) => {
    return (
      <div className="col-2">
        <div className="flex flex-wrap justify-content-center align-items-bottom">
          <div className="w-full flex justify-content-center pt-2">
            <img
              className="w-6"
              src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${project_id}/${data.name}`}
              alt="TEST"
            />
          </div>
          <div className="text-center text-2xl mb-2">{data.name}</div>
        </div>
      </div>
    );
  };
  const itemTemplate = (image: FileObject, layout: string) => {
    if (!image) {
      return;
    }

    if (layout === "list") return renderListItem(image);
    else if (layout === "grid") return renderGridItem(image);
  };
  const images = useGetImages(project_id as string);
  const header = (
    <div className="grid grid-nogutter">
      <div className="col-6" style={{ textAlign: "left" }}>
        <FileUpload
          mode="basic"
          name="demo[]"
          accept="image/*"
          maxFileSize={1000000}
          auto
          onSelect={(e) => {
            console.log(Object.values(e.files[0]));
          }}
          customUpload
          uploadHandler={(e) => {
            let file = e.files[0];
            console.log(file);
            uploadImage(project_id as string, file);
          }}
        />
        {/* <Dropdown
          options={sortOptions}
          value={sortKey}
          optionLabel="label"
          placeholder="Sort By Price"
          onChange={onSortChange}
        /> */}
      </div>
      <div className="col-6" style={{ textAlign: "right" }}>
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full px-8 mt-2">
      <DataView
        value={images?.filter(
          (image: FileObject) =>
            image.metadata.mimetype === "image/jpeg" ||
            image.metadata.mimetype === "image/png"
        )}
        layout={layout}
        header={header}
        itemTemplate={itemTemplate}
        paginator
        rows={9}
        sortOrder={sortOrder}
        sortField={sortField}
      />
    </div>
  );
}
