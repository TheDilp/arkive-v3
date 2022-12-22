type Props = {
  image?: string | null;
};

export default function ImageDropdownValue({ image }: Props) {
  return <div>{image || "Select Image / Map"}</div>;
}
