import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { useParams } from "react-router-dom";
import { ImageProps } from "../../custom-types";
import { useGetImages } from "../../utils/customHooks";
import ImgDropdownItem from "./ImgDropdownItem";

type Props = {
  value: ImageProps | undefined;
  onChange: (e: DropdownChangeParams) => void;
  filter?: "Image" | "Map";
};

export default function ImageSelectDropdown({
  value,
  onChange,
  filter,
}: Props) {
  const { project_id } = useParams();
  const images = useGetImages(project_id as string);
  if (images?.isLoading) return <></>;
  return (
    <Dropdown
      className="w-full"
      filter
      filterBy="title"
      options={
        images?.data
          ? [
            {
              title: "No Image",
              link: "",
            },
            ...images.data.filter((image) => image.type === filter),
          ]
          : []
      }
      optionLabel="title"
      value={value}
      onChange={onChange}
      placeholder="Select Image"
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
    />
  );
}
