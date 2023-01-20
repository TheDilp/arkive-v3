type Props = {
  image?: string | null;
};

export default function ImageDropdownValue({ image }: Props) {
  const name = image?.split("/")?.pop();
  return <div>{name || image || "Select Image / Map"}</div>;
}
