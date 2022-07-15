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
  return (
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
              ...images.data.filter((image) => image.type === filter),
            ]
          : []
      }
      optionLabel="title"
      value={value}
      onChange={onChange}
      itemTemplate={(item: ImageProps) => (
        <ImgDropdownItem title={item.title} link={item.link} />
      )}
    />
  );
}
