import { toast } from "react-toastify";

const defaultToastConfig = {
  autoClose: 2000,
};
export const toastSuccess = (message: string) =>
  toast.success(message, defaultToastConfig);
export const toastError = (message: string) =>
  toast.error(message, defaultToastConfig);
