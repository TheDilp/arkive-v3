/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
import { Icon } from "@iconify/react";
import { useActive, useAttrs, useCommands, useRemirrorContext } from "@remirror/react";
import { useAtom } from "jotai";
import { Menubar } from "primereact/menubar";
import { ProgressSpinner } from "primereact/progressspinner";
import { useParams } from "react-router-dom";
import { findParentNode, RemirrorJSON } from "remirror";

import { useUpdateItem } from "../../CRUD/ItemsCRUD";
import { DialogAtom } from "../../utils/Atoms/atoms";
import { DefaultDialog } from "../../utils/DefaultValues/DrawerDialogDefaults";
import { toaster } from "../../utils/toast";

export default function MenuBar({ saving }: { saving: number | boolean }) {
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBulletList,
    toggleOrderedList,
    toggleHeading,
    toggleCallout,
    toggleBlockquote,
    updateCallout,
    insertHorizontalRule,
    updateLink,
    removeLink,
    insertImage,
    leftAlign,
    centerAlign,
    rightAlign,
    toggleSecret,
    toggleColumns,
    createTable,
    deleteTable,
    updateNodeAttributes,
    focus,
  } = useCommands();
  const { project_id, doc_id } = useParams();
  const { getState } = useRemirrorContext();
  const active = useActive();
  const attrs = useAttrs();
  const [, setDialog] = useAtom(DialogAtom);
  const updateDocumentMutation = useUpdateItem("documents");
  function calloutToggle(type: string) {
    if (active.callout()) {
      if (!active.callout({ type })) {
        updateCallout({ type });
      } else if (active.callout({ type })) {
        toggleCallout({ type });
      }
    } else {
      toggleCallout({ type });
    }
  }
  return (
    // Model is passed in directly here to ensure rerenders on change of the active booleans
    // active.bold(), active.italic(), etc
    <Menubar
      className="Lato w-full border-0 p-0"
      end={() => (saving ? <ProgressSpinner className="w-2rem h-2rem" /> : "")}
      model={[
        {
          label: "B",
          className: active.bold() ? "menuBarButtonActive" : "",
          command: () => {
            toggleBold();
            focus();
          },
        },
        {
          label: "I",
          className: active.italic() ? "menuBarButtonActive" : "",
          command: () => {
            toggleItalic();
            focus();
          },
        },
        {
          label: "U",
          className: active.underline() ? "menuBarButtonActive" : "",
          command: () => {
            toggleUnderline();
            focus();
          },
        },
        {
          label: "Heading",
          items: [
            {
              label: "H1",
              className: active.heading({ level: 1 }) ? "menuBarButtonActive" : "",
              command: () => {
                toggleHeading({ level: 1 });
                focus();
              },
            },
            {
              label: "H2",
              className: active.heading({ level: 2 }) ? "menuBarButtonActive" : "",
              command: () => {
                toggleHeading({ level: 2 });
                focus();
              },
            },
            {
              label: "H3",
              className: active.heading({ level: 3 }) ? "menuBarButtonActive" : "",
              command: () => {
                toggleHeading({ level: 3 });
                focus();
              },
            },
            {
              label: "H4",
              className: active.heading({ level: 4 }) ? "menuBarButtonActive" : "",
              command: () => {
                toggleHeading({ level: 4 });
                focus();
              },
            },
            {
              label: "H5",
              className: active.heading({ level: 5 }) ? "menuBarButtonActive" : "",
              command: () => {
                toggleHeading({ level: 5 });
                focus();
              },
            },
            {
              label: "H6",
              className: active.heading({ level: 6 }) ? "menuBarButtonActive" : "",
              command: () => {
                toggleHeading({ level: 6 });
                focus();
              },
            },
          ],
        },
        {
          icon: "pi pi-fw pi-align-left",
          items: [
            {
              label: "Align Left",
              icon: "pi pi-fw pi-align-left",
              command: () => {
                leftAlign();
                focus();
              },
            },
            {
              label: "Align Center",
              icon: "pi pi-fw pi-align-center",
              command: () => {
                centerAlign();
                focus();
              },
            },
            {
              label: "Align Right",
              icon: "pi pi-fw pi-align-right",
              command: () => {
                rightAlign();
                focus();
              },
            },
            {
              label: "Reset",
              command: () => {
                const node = findParentNode({
                  predicate: (node) => true,
                  selection: getState().selection,
                });
                if (node) {
                  updateNodeAttributes(node.pos, {
                    "data-node-text-align": "none",
                  });
                } else {
                  toaster("warning", "Try clicking or selecting the blocks you wish to align, instead of selecting all!");
                }
                focus();
              },
            },
          ],
        },
        {
          className: active.bulletList() ? "menuBarButtonActive" : "",
          template: (item: any, options: any) => (
            <span className={`${options.className} text-center `} onClick={options.onClick}>
              <div className="justify-content-center customMenuBarIconContainer m-0 flex">
                <Icon className={`${options.iconClassName} m-0 `} icon="bi:list-ul" />
              </div>
            </span>
          ),
          command: () => {
            toggleBulletList();
            focus();
          },
        },
        {
          className: active.orderedList() ? "menuBarButtonActive" : "",

          template: (item: any, options: any) => (
            <span className={`${options.className} text-center `} onClick={options.onClick}>
              <div className="justify-content-center customMenuBarIconContainer m-0 flex">
                <Icon className={`${options.iconClassName} m-0 `} icon="bi:list-ol" />
              </div>
            </span>
          ),
          command: () => {
            toggleOrderedList();
            focus();
          },
        },
        {
          icon: "pi pi-fw pi-comments",
          className: active.blockquote() ? "menuBarButtonActive" : "",
          command: () => {
            toggleBlockquote();
            focus();
          },
        },
        {
          icon: "pi pi-fw pi-info-circle",
          items: [
            {
              label: "Info",
              icon: "pi pi-fw pi-info-circle",
              className: `calloutInfoButton ${active.callout({ type: "info" }) ? "menuBarButtonActive" : ""}`,
              command: () => {
                calloutToggle("info");
                focus();
              },
            },
            {
              label: "Error",
              command: () => {
                calloutToggle("error");
                focus();
              },
              className: active.callout({ type: "error" }) ? "menuBarButtonActive" : "",
              template: (item: any, options: any) => (
                <span className={`${options.className}`} onClick={options.onClick}>
                  <span className="">
                    <Icon className={`${options.iconClassName} `} color="#f00" icon="codicon:error" />
                  </span>
                  <span className={`${options.labelClassName} `}>{item.label}</span>
                </span>
              ),
            },
            {
              label: "Warning",
              className: active.callout({ type: "warning" }) ? "menuBarButtonActive" : "",
              template: (item: any, options: any) => (
                <span className={`${options.className}`} onClick={options.onClick}>
                  <span className="">
                    <Icon className={`${options.iconClassName}`} color="#ff0" icon="jam:triangle-danger-f" />
                  </span>
                  <span
                    className={`${options.labelClassName} ${active.callout({ type: "warning" }) ? "menuBarButtonActive" : ""}`}>
                    {item.label}
                  </span>
                </span>
              ),
              command: () => {
                calloutToggle("warning");
                focus();
              },
            },
            {
              label: "Success",
              className: active.callout({ type: "success" }) ? "menuBarButtonActive" : "",
              template: (item: any, options: any) => (
                <span className={`${options.className}`} onClick={options.onClick}>
                  <span className="">
                    <Icon
                      className={`${options.iconClassName} ${active.callout({ type: "success" }) ? "menuBarButtonActive" : ""}`}
                      color="#0f0"
                      icon="clarity:success-standard-line"
                    />
                  </span>
                  <span className={`${options.labelClassName} `}>{item.label}</span>
                </span>
              ),
              command: () => {
                calloutToggle("success");
                focus();
              },
            },
          ],
        },
        {
          icon: "pi pi-fw pi-image",
          className: active.image() ? "menuBarButtonActive" : "",
          command: () => {
            setDialog({
              ...DefaultDialog,
              data: { insertImage },
              type: "editor_image",
              position: "center",
              show: true,
            });
          },
        },
        {
          template: (item: any, options: any) => (
            <span
              className={`${options.className} text-center  ${active.horizontalRule() ? "menuBarButtonActive" : ""}`}
              onClick={options.onClick}>
              <div className="justify-content-center customMenuBarIconContainer m-0 flex">
                <Icon className={`${options.iconClassName} m-0`} icon="radix-icons:divider-horizontal" />
              </div>
            </span>
          ),
          command: () => {
            insertHorizontalRule();
            focus();
          },
        },
        {
          icon: "pi pi-fw pi-link",
          className: active.link() ? "menuBarButtonActive" : "",
          command: () => {
            const link = (attrs.link()?.href as string) ?? "";
            if (link) {
              const href = window.prompt("Enter the URL:", link);
              if (href) {
                updateLink({ href, target: "_blank" });
                focus();
              } else {
                removeLink();
              }
            } else {
              const href = window.prompt("Enter the URL:", undefined);
              if (href) {
                updateLink({ href, target: "_blank" });
                focus();
              }
            }
          },
        },
        {
          command: async () => {
            try {
              await updateDocumentMutation?.mutateAsync({
                content: getState().doc.toJSON() as RemirrorJSON,
                id: doc_id as string,
              });
              toaster("success", "Document successfully saved!");
            } catch (error) {
              toaster("error", "Error saving document!");
            }
          },
          icon: "pi pi-fw pi-save",
        },
        // {
        //   className: active.secret() ? "menuBarButtonActive" : "",
        //   template: (item: any, options: any) => (
        //     <span className={`${options.className} text-center `} onClick={options.onClick}>
        //       <div className="flex justify-content-center m-0 customMenuBarIconContainer">
        //         <i className={`pi pi-eye${active.secret() ? "-slash" : ""}`}></i>
        //       </div>
        //     </span>
        //   ),
        //   command: () => {
        //     toggleSecret();
        //     focus();
        //   },
        // },
        // {
        //   className: active.columns() ? "menuBarButtonActive" : "",
        //   icon: "pi pi-fw pi-pause",
        //   items: [
        //     {
        //       label: "2 columns",
        //       className: active.columns({ count: 2 }) ? "menuBarButtonActive" : "",
        //       command: () => {
        //         toggleColumns({
        //           count: 2,
        //           ruleColor: "lightgrey",
        //           ruleStyle: "solid",
        //           ruleWidth: "thin",
        //         });
        //       },
        //     },
        //     {
        //       className: active.columns({ count: 3 }) ? "menuBarButtonActive" : "",
        //       label: "3 columns",
        //       command: () => {
        //         toggleColumns({
        //           count: 3,
        //           ruleColor: "lightgrey",
        //           ruleStyle: "solid",
        //           ruleWidth: "thin",
        //         });
        //       },
        //     },
        //     {
        //       className: active.columns({ count: 4 }) ? "menuBarButtonActive" : "",
        //       label: "4 columns",
        //       command: () => {
        //         toggleColumns({
        //           count: 4,
        //           ruleColor: "lightgrey",
        //           ruleStyle: "solid",
        //           ruleWidth: "thin",
        //         });
        //       },
        //     },
        //     {
        //       className: active.columns({ count: 5 }) ? "menuBarButtonActive" : "",
        //       label: "5 columns",
        //       command: () => {
        //         toggleColumns({
        //           count: 5,
        //           ruleColor: "lightgrey",
        //           ruleStyle: "solid",
        //           ruleWidth: "thin",
        //         });
        //       },
        //     },
        //   ],
        // },
        // { label: "TABLE", command: () => createTable({ columnsCount: 3, rowsCount: 3 }) },
        // { label: "DT", command: () => deleteTable() }
      ]}
      style={{
        zIndex: 30,
      }}
    />
  );
}
