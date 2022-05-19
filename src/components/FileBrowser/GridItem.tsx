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
            <img
              loading="lazy"
              className="w-full h-full"
              style={{
                objectFit: "contain",
              }}
              src={`https://oqzsfqonlctjkurrmwkj.supabase.co/storage/v1/object/public/images/${link}`}
              alt="TEST"
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
