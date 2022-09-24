import { supabaseStorageImagesLink } from "../../utils/utils";

type Props = {
  title: string;
  link: string;
};

export default function ImgDropdownItem({ title, link }: Props) {
  return (
    <div className="w-2rem h-2rem flex align-items-center">
      {/* Safeguard for "no image" option to not attempt loading an image */}
      {link && (
        <img
          className="h-full mr-2 w-full h-full"
          style={{
            objectFit: "contain",
          }}
          src={`${supabaseStorageImagesLink}${link}`}
          alt={title}
        />
      )}
      <span>{title}</span>
    </div>
  );
}
