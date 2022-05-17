import React, { useEffect, useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { getImages, uploadImage } from "../../utils/supabaseUtils";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useParams } from "react-router-dom";
type Props = {};

const renderListItem = (data) => {
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
const renderGridItem = (data) => {
  return (
    <div className="col-12 md:col-4">
      <div className="product-grid-item card">
        <div className="product-grid-item-top">
          <div>
            <i className="pi pi-tag product-category-icon"></i>
            <span className="product-category">{data.category}</span>
          </div>
          <span
            className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}
          >
            {data.inventoryStatus}
          </span>
        </div>
        <div className="product-grid-item-content">
          <img
            src={`images/product/${data.image}`}
            onError={(e) =>
              (e.target.src =
                "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
            }
            alt={data.name}
          />
          <div className="product-name">{data.name}</div>
          <div className="product-description">{data.description}</div>
        </div>
        <div className="product-grid-item-bottom">
          <span className="product-price">${data.price}</span>
          {/* <Button
            icon="pi pi-shopping-cart"
            label="Add to Cart"
            disabled={data.inventoryStatus === "OUTOFSTOCK"}
          ></Button> */}
        </div>
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
export default function FileBrowser({}: Props) {
  const { project_id } = useParams();
  const [layout, setLayout] = useState("grid");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(undefined);

  const [data, setData] = useState<any[]>();
  async function fetchImages() {
    let d = await getImages();
    console.log(d);
    // @ts-ignore
    if (d) {
    }
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
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-success"
          //   onClick={exportCSV}
        />
      </>
    );
  };
  if (data) console.log(data);
  return (
    <div className="w-full ">
      <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
      <DataView
        value={[]}
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
