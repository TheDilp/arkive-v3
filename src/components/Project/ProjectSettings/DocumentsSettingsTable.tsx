import { Icon } from "@iconify/react";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Chip } from "primereact/chip";
import { Column, ColumnEditorOptions } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  DocumentProps,
  IconSelectProps,
  ImageProps,
} from "../../../custom-types";
import {
  useCreateDocument,
  useGetDocuments,
  useGetImages,
  useGetTags,
  useUpdateDocument,
} from "../../../utils/customHooks";
import {
  deleteDocument,
  deleteManyDocuments,
} from "../../../utils/supabaseUtils";
import {
  searchCategory,
  supabaseStorageImagesLink,
} from "../../../utils/utils";
import LoadingScreen from "../../Util/LoadingScreen";
import IconSelectMenu from "../../Util/IconSelectMenu";
import { v4 as uuid } from "uuid";
import ImgDropdownItem from "../../Util/ImgDropdownItem";
export default function DocumentsSettingsTable() {
  const { project_id } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentProps[]>(
    []
  );
  const [selectAll, setSelectAll] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [iconSelect, setIconSelect] = useState<IconSelectProps>({
    id: "",
    icon: "",
    top: 0,
    left: 0,
    show: false,
  });
  const ref = useRef(null);
  const documents = useGetDocuments(project_id as string);
  const [localDocuments, setLocalDocuments] = useState(documents.data);
  const { data: categories } = useGetTags(project_id as string);
  const images = useGetImages(project_id as string);
  // MUTATIONS

  const updateDocumentMutation = useUpdateDocument(project_id as string);
  const createDocumentMutation = useCreateDocument(project_id as string);
  useEffect(() => {
    if (documents) {
      setLocalDocuments(documents.data);
    }
  }, [documents]);

  if (!documents) return <LoadingScreen />;
  const categoriesBodyTemplate = (rowData: DocumentProps) => {
    return (
      <div className="cursor-pointer">
        {rowData.categories?.map((cat, index) => (
          <Chip label={cat} className="m-1 bg-primary text-primary"></Chip>
        ))}
      </div>
    );
  };
  const categoriesFilterTemplate = (options: any) => {
    return (
      <MultiSelect
        value={options.value}
        display="chip"
        options={categories.sort() || []}
        itemTemplate={categoriesItemTemplate}
        onChange={(e) => options.filterCallback(e.value)}
        placeholder="Any"
        className="p-column-filter w-full"
      />
    );
  };
  const categoriesItemTemplate = (option: any) => {
    return (
      <div className="p-multiselect-representative-option">
        <span className="image-text">{option}</span>
      </div>
    );
  };
  const titleBodyTemplate = (rowData: DocumentProps) => {
    return (
      <div>
        {rowData.title} {rowData.template ? "[TEMPLATE]" : ""}
      </div>
    );
  };
  const folderFilterTemplate = (options: any) => {
    return (
      <div className="flex justify-content-evenly w-full">
        Folder:
        <Checkbox
          checked={options.value}
          onChange={(e) => {
            options.filterCallback(e.checked);
          }}
          placeholder="False"
          className="p-column-filter"
        />
      </div>
    );
  };
  const templateFilterTemplate = (options: any) => {
    return (
      <div className="flex justify-content-evenly w-full">
        Template:
        <Checkbox
          checked={options.value}
          onChange={(e) => {
            options.filterCallback(e.checked);
          }}
          placeholder="False"
          className="p-column-filter"
        />
      </div>
    );
  };
  const parentFilterTemplate = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={documents.data?.filter((doc) => doc.folder) || []}
        optionLabel="title"
        optionValue="title"
        onChange={(e) => {
          options.filterCallback(e.value);
        }}
        itemTemplate={(option) => {
          return <span>{option.title}</span>;
        }}
      />
    );
  };

  const imageBodyTemplate = (rowData: DocumentProps) => {
    return (
      <div className="w-full h-auto cursor-pointer flex justify-content-center">
        {rowData.image?.link && (
          <img
            src={`${supabaseStorageImagesLink}${rowData.image.link}`}
            alt="document"
            className="w-2rem h-full relative border-round"
            style={{
              objectFit: "cover",
            }}
            loading="lazy"
          />
        )}
      </div>
    );
  };
  const folderBodyTemplate = (rowData: DocumentProps) => {
    return (
      <div className="relative flex justify-content-center">
        <Checkbox
          checked={rowData.folder}
          onChange={(e) =>
            updateDocumentMutation.mutate({
              id: rowData.id,
              folder: e.checked,
            })
          }
        />
      </div>
    );
  };
  const templateBodyTemplate = (rowData: DocumentProps) => {
    return (
      <div className="relative flex justify-content-center">
        <Checkbox
          checked={rowData.template}
          readOnly
          disabled
          className="cursor-auto"
        />
      </div>
    );
  };
  const actionsBodyTemplate = (rowData: DocumentProps) => {
    return (
      <div className="">
        <Button
          label="Delete"
          className="p-button-danger p-button-outlined"
          icon="pi pi-fw pi-trash"
          iconPos="right"
          onClick={() => {
            confirmDialog({
              message: `Are you sure you want to delete ${rowData.title}?`,
              header: `Deleting ${rowData.title}`,
              icon: "pi pi-exclamation-triangle",
              acceptClassName: "p-button-danger",
              accept: () => {
                deleteDocument(rowData.id).then(() => {
                  queryClient.setQueryData(
                    `${project_id}-documents`,
                    (oldData: DocumentProps[] | undefined) => {
                      if (oldData) {
                        return oldData.filter((doc) => doc.id !== rowData.id);
                      } else {
                        return [];
                      }
                    }
                  );
                });
              },
            });
          }}
        />
        <Button
          className="p-button-success p-button-outlined ml-2"
          icon="pi pi-fw pi-link"
          onClick={() => {
            navigate(
              `../wiki/${rowData.folder ? "folder" : "doc"}/${rowData.id}`
            );
          }}
        />
      </div>
    );
  };
  const iconBodyTemplate = (rowData: DocumentProps) => {
    return (
      <Icon icon={rowData.icon} fontSize={30} className="cursor-pointer" />
    );
  };
  const publicBodyTemplate = (rowData: DocumentProps) => {
    return (
      <div className="relative flex justify-content-center">
        <Checkbox
          checked={rowData.public}
          disabled={rowData.template}
          className="cursor-auto"
          onChange={(e) =>
            updateDocumentMutation.mutate({
              id: rowData.id,
              public: e.checked,
            })
          }
        />
      </div>
    );
  };
  const leftToolbarTemplate = () => {
    return (
      <div>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2 p-button-outlined"
          onClick={async () => {
            let id = uuid();
            createDocumentMutation.mutate({ id });
          }}
        />
        <Button
          label="Delete Selected"
          icon="pi pi-trash"
          className="p-button-danger p-button-outlined"
          disabled={selectedDocuments.length === 0}
          onClick={() =>
            confirmDialog({
              message: selectAll
                ? "Are you sure you want to delete all of your documents?"
                : `Are you sure you want to delete ${selectedDocuments.length} documents?`,
              header: `Deleting ${selectedDocuments.length} documents`,
              icon: "pi pi-exclamation-triangle",
              acceptClassName: "p-button-danger",
              className: selectAll ? "deleteAllDocuments" : "",
              accept: () => {
                let documentIdsForDeletion = selectedDocuments.map(
                  (doc: DocumentProps) => doc.id
                );
                deleteManyDocuments(documentIdsForDeletion).then(() => {
                  queryClient.setQueryData(
                    `${project_id}-documents`,
                    (oldData: DocumentProps[] | undefined) => {
                      if (oldData) {
                        return oldData.filter(
                          (doc) => !documentIdsForDeletion.includes(doc.id)
                        );
                      } else {
                        return [];
                      }
                    }
                  );
                });
              },
            })
          }
        />
      </div>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Reset"
          tooltip="Resets Filters, Sorting and Pagination"
          className="p-button-outlined mr-2"
          onClick={() => {
            // @ts-ignore
            ref.current?.reset();
          }}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            placeholder="Quick Search"
            onChange={(e) => {
              setGlobalFilter(e.target.value);
            }}
          />
        </span>
      </div>
    );
  };

  // Cell Editors
  const parentEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={documents.data?.filter((doc) => doc.folder) || []}
        optionLabel="title"
        optionValue="id"
        onChange={(e) => {
          if (options.rowData.id && e.value)
            updateDocumentMutation.mutate({
              id: options.rowData.id,
              parent: e.value,
            });
        }}
        placeholder="Select a Folder"
        itemTemplate={(option) => {
          return <span>{option.title}</span>;
        }}
      />
    );
  };
  const titleEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => {
          if (options.rowData.id && e.target.value)
            //@ts-ignore
            options.editorCallback(e.target.value);
        }}
      />
    );
  };
  const imageEditor = (options: ColumnEditorOptions) => {
    return (
      <div className="h-2rem w-2rem">
        <Dropdown
          filter
          filterBy="title"
          className="w-full"
          placeholder="Custom Image"
          optionLabel="title"
          itemTemplate={(item: ImageProps) => (
            <ImgDropdownItem title={item.title} link={item.link} />
          )}
          options={
            images?.data
              ? [
                  { title: "No image", id: null },
                  ...images?.data.filter((image) => image.type === "Image"),
                ]
              : []
          }
          value={options.rowData.image}
          onChange={(e) => {
            updateDocumentMutation.mutate({
              id: options.rowData.id,
              image: e.target.value,
            });
          }}
        />
      </div>
    );
  };
  const categoryEditor = (options: ColumnEditorOptions) => {
    return (
      <AutoComplete
        value={
          localDocuments?.find((doc) => doc.id === options.rowData.id)
            ?.categories || []
        }
        suggestions={filteredCategories}
        placeholder={
          options.rowData.categories ? "" : "Enter tags for this document..."
        }
        completeMethod={(e) =>
          searchCategory(e, categories || [], setFilteredCategories)
        }
        multiple
        onSelect={(e) => {
          if (!options.rowData.categories.includes(e.value)) {
            updateDocumentMutation.mutate({
              id: options.rowData.id,
              categories: [...options.rowData.categories, e.value],
            });
          }
        }}
        onUnselect={(e) => {
          if (options.rowData.categories.includes(e.value)) {
            updateDocumentMutation.mutate({
              id: options.rowData.id,
              categories: options.rowData.categories.filter(
                (category: string) => category !== e.value
              ),
            });
            // @ts-ignore
            // ref.current?.closeEditingCell();
          }
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") e.preventDefault();
          if (e.key === "Enter" && e.currentTarget.value !== "") {
            if (!options.rowData.categories.includes(e.currentTarget.value)) {
              updateDocumentMutation.mutate({
                id: options.rowData.id,
                categories: [
                  ...options.rowData.categories,
                  e.currentTarget.value,
                ],
              });
            }
            e.currentTarget.value = "";
          }
        }}
      />
    );
  };
  const iconEditor = (options: ColumnEditorOptions) => {
    return (
      <>
        <Icon
          icon={options.rowData.icon}
          fontSize={30}
          className="cursor-pointer"
        />
        <IconSelectMenu
          {...iconSelect}
          setIconSelect={setIconSelect}
          // @ts-ignore
          closeEdit={ref.current?.closeEditingCell}
        />
      </>
    );
  };

  return (
    <section className="w-full px-2 mt-4 overflow-hidden">
      <ConfirmDialog />
      <Toolbar
        className="mb-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataTable
        ref={ref}
        value={localDocuments
          ?.filter((doc) =>
            globalFilter ? doc.title.includes(globalFilter) : true
          )
          ?.map((doc) => {
            return { ...doc, categories: doc.categories.sort() };
          })}
        selection={selectedDocuments}
        selectionMode="checkbox"
        paginator
        rows={12}
        showGridlines
        onSelectionChange={(e) => {
          const value = e.value;
          setSelectedDocuments(value);
          setSelectAll(value.length === documents.data?.length);
        }}
        filterDisplay="menu"
        sortMode="multiple"
        removableSort
        size="small"
        responsiveLayout="scroll"
        editMode="cell"
      >
        <Column selectionMode="multiple"></Column>
        <Column
          field="title"
          header="Title"
          filter
          style={{ width: "20rem" }}
          editor={titleEditor}
          sortable
          body={titleBodyTemplate}
          onCellEditComplete={(e: any) => {
            if (e.rowData.id && e.newValue)
              updateDocumentMutation.mutate({
                id: e.rowData.id,
                title: e.newValue,
              });
          }}
        ></Column>
        <Column
          field="image"
          header="Image"
          body={imageBodyTemplate}
          editor={imageEditor}
          align="center"
        ></Column>
        <Column
          header="Is Folder"
          field="folder"
          filter
          filterElement={folderFilterTemplate}
          filterMatchMode="equals"
          body={folderBodyTemplate}
          dataType="boolean"
          sortable
          style={{ width: "10rem" }}
        ></Column>
        <Column
          header="Parent"
          field="parent.title"
          filter
          filterMatchMode="equals"
          showFilterMatchModes={false}
          filterElement={parentFilterTemplate}
          sortable
          className="w-10rem text-center cursor-pointer"
          editor={(options) => parentEditor(options)}
        ></Column>
        <Column
          header={() => <div className="text-center">Categories</div>}
          body={categoriesBodyTemplate}
          filterField="categories"
          filterMenuStyle={{ width: "25rem" }}
          filter
          filterMatchMode="custom"
          showFilterMatchModes={false}
          style={{
            width: "25rem",
          }}
          filterFunction={(value: string[], filter: string[] | null) => {
            if (!filter) return true;
            if (filter.every((f: string) => value.includes(f))) {
              return true;
            } else {
              return false;
            }
          }}
          filterElement={categoriesFilterTemplate}
          editor={categoryEditor}
        />
        <Column
          header="Is Template"
          field="template"
          filter
          filterElement={templateFilterTemplate}
          filterMatchMode="equals"
          body={templateBodyTemplate}
          dataType="boolean"
          sortable
          style={{ width: "10rem" }}
        />
        <Column
          header="Icon"
          field="icon"
          editor={iconEditor}
          onCellEditInit={(e: any) => {
            setIconSelect({
              id: e.rowData.id,
              icon: e.rowData.icon,
              top: e.originalEvent.clientY,
              left: e.originalEvent.clientX,
              show: true,
            });
          }}
          alignHeader="center"
          bodyClassName="text-center"
          body={iconBodyTemplate}
        />
        <Column
          header="Public"
          field="public"
          filter
          filterElement={templateFilterTemplate}
          filterMatchMode="equals"
          body={publicBodyTemplate}
          dataType="boolean"
          sortable
          style={{ width: "10rem" }}
        />
        <Column
          header="Actions"
          body={actionsBodyTemplate}
          style={{
            width: "11rem",
          }}
        />
      </DataTable>
    </section>
  );
}
