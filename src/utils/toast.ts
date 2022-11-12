import { toast } from "react-toastify";

export const toaster = (
  type: "success" | "warning" | "error" | "info",
  message: string,
) => toast[type](message);
