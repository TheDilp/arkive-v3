import { SwatchType } from "../../types/ItemTypes/projectTypes";

export default function SwatchCard({ title, color }: SwatchType) {
  return (
    <div className="flex h-44 flex-col overflow-hidden rounded border border-zinc-700 shadow-md">
      <div
        className="h-4/5"
        style={{
          backgroundColor: color,
        }}
      />
      <div className="flex h-1/5 items-center justify-between bg-zinc-800 px-2 text-sm text-zinc-400">
        {title ? <span>{title}</span> : null}
        <span>{color}</span>
      </div>
    </div>
  );
}
