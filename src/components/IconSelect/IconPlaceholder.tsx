import { forwardRef } from "react";

const IconPlaceholder = forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} {...props} className="h-6 w-6 cursor-pointer rounded-full border border-dashed" />
));

export default IconPlaceholder;
