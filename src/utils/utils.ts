import { toast, ToastOptions } from "react-toastify";
const defaultToastConfig: ToastOptions = {
  autoClose: 2000,
  theme: "dark",
};
export const toastSuccess = (message: string) =>
  toast.success(message, defaultToastConfig);
export const toastError = (message: string) =>
  toast.error(message, defaultToastConfig);
