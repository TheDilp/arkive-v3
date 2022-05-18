import React, { useEffect, useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { getImages, uploadImage } from "../../utils/supabaseUtils";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useParams } from "react-router-dom";
import { FileObject } from "../../utils/utils";

type Props = {};

export default function FileBrowser({}: Props) {
  const { project_id } = useParams();
  const [layout, setLayout] = useState("grid");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(undefined);

  const renderListItem = (data: FileObject) => {
    return (
      <div className="col-12">
        <div className="product-list-item">
          <img src={`images/product/${data.image}`} alt={data.name} />
          <div className="product-list-detail">
            <div className="product-name">{data.name}</div>
            <div className="product-description">{data.description}</div>
            {/* <Rating value={data.rating} readOnly cancel={false}></Rating> */}
            <i className="pi pi-tag product-category-icon"></i>
            <span className="product-category">{data.category}</span>
          </div>
          <div className="product-list-action">
            {/* <span className="product-price">${data.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              disabled={data.inventoryStatus === "OUTOFSTOCK"}
            ></Button> */}
            <span
              className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}
            >
              {data.inventoryStatus}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const renderGridItem = (data: FileObject) => {
    return (
      <div className="col-2">
        <div className="product-grid-item card">
          <div className="product-grid-item-top">
            <div>
              <div className="product-category text-center text-xl mb-2">
                {data.name}
              </div>
            </div>
          </div>
          <div className="product-grid-item-content flex justify-content-center">
            <img
              src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${project_id}/${data.name}`}
              alt="TEST"
            />
          </div>
          <div className="product-grid-item-bottom"></div>
        </div>
      </div>
    );
  };
  const itemTemplate = (product, layout) => {
    if (!product) {
      return;
    }

    if (layout === "list") return renderListItem(product);
    else if (layout === "grid") return renderGridItem(product);
  };
  const [data, setData] = useState<any[]>();
  async function fetchImages() {
    let d: FileObject[] | undefined = await getImages(project_id as string);
    // @ts-ignore
    if (d)
      setData(
        d.filter(
          (file) =>
            file.metadata?.mimetype === "image/jpeg" ||
            file.metadata?.mimetype === "image/png"
        )
      );
  }
  useEffect(() => {
    fetchImages();
  }, []);

  const leftToolbarTemplate = () => {
    return (
      <>
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
      </>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <>
        <Button
          icon="pi pi-align-justify"
          className="p-button-outlined p-button-success"
        />
        <Button icon="pi pi-th-large" className="p-button-outlined ml-2" />
      </>
    );
  };
  return (
    <div className="w-full ">
      <Toolbar
        className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataView
        value={data}
        layout={layout}
        itemTemplate={itemTemplate}
        paginator
        rows={9}
        sortOrder={sortOrder}
        sortField={sortField}
      />
    </div>
  );
}
