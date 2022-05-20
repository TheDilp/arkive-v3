import { Image } from "primereact/image";

type Props = {
  name: string;
  link: string;
};

export default function GridItem({ name, link }: Props) {
  return (
    <div className="w-full">
      <div className="w-11 bg-gray-800">
        <div className="flex flex-wrap justify-content-center align-items-bottom">
          <div className="w-6 h-8rem flex justify-content-center pt-2">
            <Image
              imageClassName="w-full h-full previewImage"
              src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${link}`}
              alt="TEST"
              preview
            />
          </div>
          <div className="text-center text-2xl mb-2 text-white Lato w-full white-space-nowrap overflow-hidden text-overflow-ellipsis">
            {name}
          </div>
        </div>
      </div>
    </div>
  );
}
