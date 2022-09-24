import { NodeModel } from "@minoru/react-dnd-treeview";
import { UseMutationResult } from "react-query";
import { toast, ToastOptions } from "react-toastify";
import { DocumentProps, slashMenuItem, SortIndexes } from "../custom-types";
import { BoardType, CreateNodeType } from "../types/BoardTypes";
import { MapProps } from "../types/MapTypes";
import { TimelineType } from "../types/TimelineTypes";
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

export const documentDemo = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 1,
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
      content: [
        {
          text: "Welcome to the Arkive demo!",
          type: "text",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        level: 2,
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
      content: [
        {
          text: "Feel free to try things out.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
    },
    {
      type: "callout",
      attrs: {
        type: "info",
        emoji: "",
      },
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
              text: "Hint: You can use ",
              type: "text",
            },
            {
              text: '"/"',
              type: "text",
              marks: [
                {
                  type: "italic",
                },
              ],
            },
            {
              text: " to show all the available commands.",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          attrs: {
            closed: false,
            nested: false,
          },
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
                  text: "You can create unorderedlists",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "orderedList",
      attrs: {
        order: 1,
      },
      content: [
        {
          type: "listItem",
          attrs: {
            closed: false,
            nested: false,
          },
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
                  text: "Order lists too!",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "taskList",
      content: [
        {
          type: "taskListItem",
          attrs: {
            checked: false,
          },
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
                  text: "And don't forget about task lists.",
                  type: "text",
                },
              ],
            },
          ],
        },
        {
          type: "taskListItem",
          attrs: {
            checked: true,
          },
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
                  text: "Check out editor demo",
                  type: "text",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "horizontalRule",
    },
    {
      type: "secret",
      attrs: {
        class: "secretBlock",
        secret: "true",
        classNames: "secretBlock",
      },
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
              text: "Secret blocks can contain any other type of text, but won't be seen on the public page for this document!",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
    },
    {
      type: "blockquote",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
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
              text: '"The Arkive Editor is awesome!"',
              type: "text",
            },
          ],
        },
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
              type: "hardBreak",
            },
            {
              text: "-Arkive Developer",
              type: "text",
            },
          ],
        },
      ],
    },
  ],
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

export const defaultNode: Omit<
  CreateNodeType,
  "id" | "x" | "y" | "project_id" | "type" | "board_id"
> = {
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
  template: false,
};

export const columnsItems: slashMenuItem[] = [
  {
    name: "2 columns",
    type: "columns",
    icon: "mdi:view-column",
    column_count: 2,
  },
  {
    name: "3 columns",
    type: "columns",
    icon: "mdi:view-column",
    column_count: 3,
  },
  {
    name: "4 columns",
    type: "columns",
    icon: "mdi:view-column",
    column_count: 4,
  },
  {
    name: "5 columns",
    type: "columns",
    icon: "mdi:view-column",
    column_count: 5,
  },
];

export const defaultColumnProps = {
  ruleColor: "lightgrey",
  ruleStyle: "solid" as const,
  ruleWidth: "thin" as const,
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
  { name: "Columns", type: "columns_select", icon: "mdi:view-column" },
  { name: "Divider", type: "divider", icon: "mdi:minus" },
  { name: "Secret", type: "secret", icon: "mdi:eye-off-outline" },
  { name: "Map", type: "map_select", icon: "mdi:map" },
  { name: "Board", type: "board_select", icon: "mdi:draw" },
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

export const TreeSortFunc = (sortA: number, sortB: number) => {
  if (sortA > sortB) return 1;
  if (sortA < sortB) return -1;
  return 0;
};

export const handleDrop = async (
  newTree: NodeModel<DocumentProps | MapProps | BoardType | TimelineType>[],
  {
    dragSourceId,
    dragSource,
    dropTargetId,
  }: {
    dragSourceId: string;
    dragSource: NodeModel<DocumentProps | MapProps | BoardType | TimelineType>;
    dropTargetId: string;
  },
  setTreeData: (
    newTree: NodeModel<DocumentProps | MapProps | BoardType | TimelineType>[]
  ) => void,
  sortChildrenMutation: UseMutationResult<
    void,
    unknown,
    {
      project_id: string;
      type: "documents" | "maps" | "boards" | "timelines";
      indexes: SortIndexes;
    },
    {
      previousData: unknown;
    }
  >,
  project_id: string,
  type: "documents" | "maps" | "boards" | "timelines"
) => {
  let indexes: SortIndexes = newTree
    .filter(
      (doc) =>
        doc.parent === dropTargetId ||
        (doc.parent === undefined &&
          dropTargetId === "0" &&
          // @ts-ignore
          (!doc.data?.template || true))
    )
    .map((doc, index) => {
      // doc.parent.toString() => Dnd Treeview allows for strings and numbers, we want only strings
      return {
        id: doc.id as string,
        sort: index,
        parent: doc.parent === "0" ? null : (doc.parent as string),
      };
    });
  setTreeData(newTree);
  sortChildrenMutation.mutate({
    project_id: project_id as string,
    type,
    indexes: indexes || [],
  });
};
