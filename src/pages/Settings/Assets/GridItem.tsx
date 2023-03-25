import { Image } from "primereact/image";

export function ListGridItem(image: string) {
  return (
    <div className="col-span-1 flex flex-col justify-center px-2">
      <Image downloadable alt="Listasset" className="h-full w-full" imageClassName="object-contain" preview src={image} />
    </div>
  );
}
