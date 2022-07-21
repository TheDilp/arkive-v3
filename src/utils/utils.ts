import { NodeModel } from "@minoru/react-dnd-treeview";
import { toast, ToastOptions } from "react-toastify";
import { slashMenuItem } from "../custom-types";
const defaultToastConfig: ToastOptions = {
  autoClose: 1250,
  theme: "dark",
};

export const toastSuccess = (message: string) =>
  toast.success(message, defaultToastConfig);
export const toastError = (message: string) =>
  toast.error(message, defaultToastConfig);
export const toastWarn = (message: string) =>
  toast.warn(message, defaultToastConfig);
// Filter autocomplete for categories
export const searchCategory = (
  event: any,
  categories: string[],
  setFilteredCategories: (categories: string[]) => void
) => {
  setTimeout(() => {
    let _filteredCategories;
    if (!event.query.trim().length) {
      _filteredCategories = [...categories];
    } else {
      _filteredCategories = categories.filter((category) => {
        return category.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }

    setFilteredCategories(_filteredCategories);
  }, 250);
};
// Get depth of node in tree in editor view
export const getDepth = (
  tree: NodeModel[],
  id: number | string,
  depth = 0
): number => {
  const target: NodeModel | undefined = tree.find((node) => node.id === id);

  if (target) {
    return getDepth(tree, target.parent, depth + 1);
  }

  return depth;
};

// Regex for email and password
export const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

export const passwordRegex =
  /"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"/g;

export const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

// Template Tree Utils
export const defaultTemplate = {
  title: "New Template",
  icon: "mdi:file",
  categories: [],
  folder: false,
  template: true,
  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        attrs: {
          style: "",
          nodeIndent: null,
          nodeLineHeight: null,
          nodeTextAlignment: null,
        },
        content: [
          {
            text: "Customize your new template!",
            type: "text",
          },
        ],
      },
    ],
  },
};

export const defaultNode = {
  width: 50,
  height: 50,
  fontSize: 16,
  fontColor: "#ffffff",
  fontFamily: "Lato",
  textHAlign: "center" as const,
  textVAlign: "top" as const,
  backgroundColor: "#595959",
  backgroundOpacity: 1,
  zIndex: 1,
  locked: false,
};

export const defaultSlashItems: slashMenuItem[] = [
  {
    name: "Heading 1",
    type: "heading",
    level: 1,
    icon: "mdi:format-header-1",
  },
  {
    name: "Heading 2",
    type: "heading",
    level: 2,
    icon: "mdi:format-header-2",
  },
  {
    name: "Heading 3",
    type: "heading",
    level: 3,
    icon: "mdi:format-header-3",
  },
  {
    name: "Heading 4",
    type: "heading",
    level: 4,
    icon: "mdi:format-header-4",
  },
  {
    name: "Heading 5",
    type: "heading",
    level: 5,
    icon: "mdi:format-header-5",
  },
  {
    name: "Heading 6",
    type: "heading",
    level: 6,
    icon: "mdi:format-header-6",
  },
  { name: "Bullet List", type: "list", icon: "mdi:format-list-bulleted" },
  { name: "Ordered List", type: "list", icon: "mdi:format-list-numbered" },
  {
    name: "Task List",
    type: "list",
    icon: "mdi:checkbox-marked-circle-outline",
  },
  { name: "Quote", type: "quote", icon: "mdi:comment-quote-outline" },
  {
    name: "Callout Info",
    type: "callout",
    callout_type: "info",
    icon: "mdi:information-outline",
    color: "lightskyblue",
  },
  {
    name: "Callout Error",
    type: "callout",
    callout_type: "error",
    icon: "mdi:alpha-x-circle-outline",
    color: "#f00",
  },
  {
    name: "Callout Warning",
    type: "callout",
    callout_type: "warning",
    icon: "mdi:alert",
    color: "#ff0",
  },
  {
    name: "Callout Success",
    type: "callout",
    callout_type: "success",
    icon: "mdi:check-outline",
    color: "#0f0",
  },
  { name: "Image", type: "image", icon: "mdi:image" },
  { name: "Divider", type: "divider", icon: "mdi:minus" },
  { name: "Secret", type: "secret", icon: "mdi:eye-off-outline" },
];

export interface Bucket {
  id: string;
  name: string;
  owner: string;
  created_at: string;
  updated_at: string;
  public: boolean;
}
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseStorageImagesLink = `${supabaseUrl}/storage/v1/object/public/images/`;
