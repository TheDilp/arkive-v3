import { Icon } from "@iconify/react";
import { useActive, useAttrs, useCommands } from "@remirror/react";
import { Menubar } from "primereact/menubar";
import { ProgressSpinner } from "primereact/progressspinner";
import "../../../styles/MenuBar.css";
export default function BubbleMenuBar({
  saving,
  setColorInput,
}: {
  saving: number | boolean;
  setColorInput: (colorInput: boolean) => void;
}) {
  const {
    toggleBulletList,
    toggleOrderedList,
    toggleCallout,
    updateCallout,
    insertHorizontalRule,
    updateLink,
    removeLink,
    insertImage,
    leftAlign,
    centerAlign,
    rightAlign,
    focus,
  } = useCommands();
  const active = useActive();
  const attrs = useAttrs();
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
            console.log(active.image());
            // let src = window.prompt("Enter the URL of the image:", undefined);
            // if (src) {
            //   insertImage({ src });
            //   focus();
            // }
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
            let link = (attrs.link()?.href as string) ?? "";
            if (link) {
              let href = window.prompt("Enter the URL:", link);
              if (href) {
                updateLink({ href, target: "_self" });
                focus();
              } else {
                removeLink();
              }
            } else {
              let href = window.prompt("Enter the URL:", undefined);
              if (href) {
                updateLink({ href, target: "_self" });
                focus();
              }
            }
          },
        },
        {
          icon: "pi pi-palette",
          command: () => setColorInput(true),
        },
      ]}
      end={() => (saving ? <ProgressSpinner className="w-2rem h-2rem" /> : "")}
      className="p-0 Lato absolute"
    />
  );
}
