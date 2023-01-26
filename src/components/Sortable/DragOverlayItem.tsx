import { forwardRef } from "react";

type Props = {
  title: string;
  [key: string]: any;
};
export const DragOverlayItem = forwardRef(({ title }: Props, ref: any) => {
  return (
    <div ref={ref} className="bg-zinc-800">
      {title}
    </div>
  );
});
