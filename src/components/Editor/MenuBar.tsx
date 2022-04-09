import { useActive, useCommands } from "@remirror/react";
import { Menubar } from "primereact/menubar";
import { Icon } from "@iconify/react";
import "../../styles/MenuBar.css";
import { useEffect, useMemo, useState } from "react";
export default function MenuBar() {
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleBulletList,
    toggleOrderedList,
    toggleHeading,
    toggleCallout,
    toggleStrike,
    updateCallout,
    insertHorizontalRule,
    updateLink,
    insertImage,
    focus,
  } = useCommands();
  const active = useActive();

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
              className: active.heading({ level: 1 })
                ? "menuBarButtonActive"
                : "",
              command: () => {
                toggleHeading({ level: 1 });
                focus();
              },
            },
            {
              label: "H2",
              className: active.heading({ level: 2 })
                ? "menuBarButtonActive"
                : "",
              command: () => {
                toggleHeading({ level: 2 });
                focus();
              },
            },
            {
              label: "H3",
              className: active.heading({ level: 3 })
                ? "menuBarButtonActive"
                : "",
              command: () => {
                toggleHeading({ level: 3 });
                focus();
              },
            },
            {
              label: "H4",
              className: active.heading({ level: 4 })
                ? "menuBarButtonActive"
                : "",
              command: () => {
                toggleHeading({ level: 4 });
                focus();
              },
            },
            {
              label: "H5",
              className: active.heading({ level: 5 })
                ? "menuBarButtonActive"
                : "",
              command: () => {
                toggleHeading({ level: 5 });
                focus();
              },
            },
            {
              label: "H6",
              className: active.heading({ level: 6 })
                ? "menuBarButtonActive"
                : "",
              command: () => {
                toggleHeading({ level: 6 });
                focus();
              },
            },
          ],
        },
        {
          className: active.bulletList() ? "menuBarButtonActive" : "",
          template: (item: any, options: any) => (
            <span
              className={`${options.className} text-center `}
              onClick={options.onClick}
            >
              <div className="flex justify-content-center m-0 customMenuBarIconContainer">
                <Icon
                  className={`${options.iconClassName} m-0 `}
                  icon="bi:list-ul"
                />
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
            <span
              className={`${options.className} text-center `}
              onClick={options.onClick}
            >
              <div className="flex justify-content-center m-0 customMenuBarIconContainer">
                <Icon
                  className={`${options.iconClassName} m-0 `}
                  icon="bi:list-ol"
                />
              </div>
            </span>
          ),
          command: () => {
            toggleOrderedList();
            focus();
          },
        },
        {
          icon: "pi pi-fw pi-info-circle",
          items: [
            {
              label: "Info",
              icon: "pi pi-fw pi-info-circle",
              className: `calloutInfoButton ${
                active.callout({ type: "info" }) ? "menuBarButtonActive" : ""
              }`,
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
              className: active.callout({ type: "error" })
                ? "menuBarButtonActive"
                : "",
              template: (item: any, options: any) => (
                <span
                  className={`${options.className}`}
                  onClick={options.onClick}
                >
                  <span className="">
                    <Icon
                      className={`${options.iconClassName} `}
                      icon="codicon:error"
                      color="#f00"
                    />
                  </span>
                  <span className={`${options.labelClassName} `}>
                    {item.label}
                  </span>
                </span>
              ),
            },
            {
              label: "Warning",
              className: active.callout({ type: "warning" })
                ? "menuBarButtonActive"
                : "",
              template: (item: any, options: any) => (
                <span
                  className={`${options.className}`}
                  onClick={options.onClick}
                >
                  <span className="">
                    <Icon
                      className={`${options.iconClassName}`}
                      icon="jam:triangle-danger-f"
                      color="#ff0"
                    />
                  </span>
                  <span
                    className={`${options.labelClassName} ${
                      active.callout({ type: "warning" })
                        ? "menuBarButtonActive"
                        : ""
                    }`}
                  >
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
              className: active.callout({ type: "success" })
                ? "menuBarButtonActive"
                : "",
              template: (item: any, options: any) => (
                <span
                  className={`${options.className}`}
                  onClick={options.onClick}
                >
                  <span className="">
                    <Icon
                      className={`${options.iconClassName} ${
                        active.callout({ type: "success" })
                          ? "menuBarButtonActive"
                          : ""
                      }`}
                      icon="clarity:success-standard-line"
                      color="#0f0"
                    />
                  </span>
                  <span className={`${options.labelClassName} `}>
                    {item.label}
                  </span>
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
            insertImage({ src: "https://picsum.photos/200/300" });
            focus();
          },
        },
        {
          template: (item: any, options: any) => (
            <span
              className={`${options.className} text-center  ${
                active.horizontalRule() ? "menuBarButtonActive" : ""
              }`}
              onClick={options.onClick}
            >
              <div className="flex justify-content-center m-0 customMenuBarIconContainer">
                <Icon
                  className={`${options.iconClassName} m-0`}
                  icon="radix-icons:divider-horizontal"
                />
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
            updateLink({ href: "https://remirror.io" });
            focus();
          },
        },
      ]}
      className="p-0 text-xl Lato"
    />
  );
}

// <div className="menuBar ">
// <div className="menuBarGroup ">
//   <button
//     className={`menuBarButton  ${
//       active.bold() ? "menuBarButtonActive" : ""
//     }`}
//     onClick={() => {
//       toggleBold();
//       focus();
//     }}
//   >
//     <b>B</b>
//   </button>
//   <button
//     className={`menuBarButton ${
//       active.italic() ? "menuBarButtonActive" : ""
//     }`}
//     onClick={() => {
//       toggleItalic();
//       focus();
//     }}
//   >
//     <i>I</i>
//   </button>
//   <button
//     className={`menuBarButton ${
//       active.underline() ? "menuBarButtonActive" : ""
//     }`}
//     onClick={() => {
//       toggleUnderline();
//       focus();
//     }}
//   >
//     <u>U</u>
//   </button>
// </div>
// <div className="menuBarGroup">
//   {[1, 2, 3, 4, 5, 6].map((level) => (
//     <button
//       className={`menuBarButton ${
//         active.heading({ level }) ? "menuBarButtonActive" : ""
//       }`}
//       onClick={() => {
//         toggleHeading({ level });
//         focus();
//       }}
//     >
//       {`H${level}`}
//     </button>
//   ))}
// </div>
// <div className="menuBarGroup">
//   <button
//     className={`menuBarButton ${
//       active.bulletList() ? "menuBarButtonActive" : ""
//     }`}
//     onClick={() => {
//       toggleBulletList();
//       focus();
//     }}
//   >
//     <span>BL</span>
//   </button>
//   <button
//     className={`menuBarButton ${
//       active.orderedList() ? "menuBarButtonActive" : ""
//     }`}
//     onClick={() => {
//       toggleOrderedList();
//       focus();
//     }}
//   >
//     <span>OL</span>
//   </button>
// </div>

// <div className="menuBarGroup">
//   <span className="calloutContainer">
//     <span>CL</span>
//     <div className="calloutMenu">
//       <div
//         className="calloutOption calloutInfo"
//         onClick={() => {
//           calloutToggle("info");
//           focus();
//         }}
//       >
//         Info
//       </div>
//       <div
//         className="calloutOption calloutWarning"
//         onClick={() => {
//           calloutToggle("warning");
//           focus();
//         }}
//       >
//         Warning
//       </div>
//       <div
//         className="calloutOption calloutSuccess"
//         onClick={() => {
//           calloutToggle("success");
//           focus();
//         }}
//       >
//         Success
//       </div>
//       <div
//         className={`calloutOption calloutError ${active.callout({
//           type: "error",
//         })}`}
//         onClick={() => {
//           calloutToggle("error");
//           focus();
//         }}
//       >
//         Error
//       </div>
//     </div>
//   </span>

//   <button
//     className={`menuBarButton ${
//       active.image() ? "menuBarButtonActive" : ""
//     }`}
//     onClick={() => {
//       insertImage({ src: "https://picsum.photos/200/300" });
//       focus();
//     }}
//   >
//     IMG
//   </button>
//   <button
//     className={`menuBarButton ${
//       active.horizontalRule() ? "menuBarButtonActive" : ""
//     }`}
//     onClick={() => {
//       insertHorizontalRule();
//       focus();
//     }}
//   >
//     ---
//   </button>
//   <button
//     className={`menuBarButton ${
//       active.link() ? "menuBarButtonActive" : ""
//     }`}
//     onClick={() => {
//       updateLink({ href: "https://remirror.io" });
//       focus();
//     }}
//   >
//     LINK
//   </button>
// </div>
// </div>
