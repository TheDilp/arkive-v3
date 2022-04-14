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
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document, iconSelect, Project } from "../../../custom-types";
import {
  createDocument,
  deleteDocument,
  deleteManyDocuments,
  getCurrentProject,
  getDocuments,
  updateDocument,
  updateProject,
} from "../../../utils/supabaseUtils";
import { searchCategory, toastError } from "../../../utils/utils";
import LoadingScreen from "../../Util/LoadingScreen";
import IconSelectMenu from "../ProjectTree/IconSelectMenu";

export default function ProjectSettings() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();

  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [iconSelect, setIconSelect] = useState<iconSelect>({
    doc_id: "",
    icon: "",
    top: 0,
    left: 0,
    show: false,
  });
  const ref = useRef(null);
  const {
    data: documents,
    error: documentsError,
    isLoading: documentsLoading,
    refetch: documentsRefetch,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id as string),
    { staleTime: 5 * 60 * 1000 }
  );
  const {
    data: project,
    error: projectError,
    isLoading: projectLoading,
  } = useQuery(
    `${project_id}-project`,
    async () => await getCurrentProject(project_id as string),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  // MUTATIONS

  const updateDocumentMutation = useMutation(
    async (vars: {
      doc_id: string;
      title?: string;
      folder?: boolean;
      parent?: string | null;
      image?: string;
      icon?: string;
    }) =>
      await updateDocument(
        vars.doc_id,
        vars.title,
        undefined,
        undefined,
        vars.folder,
        vars.parent,
        vars.image,
        vars.icon
      ),
    {
      onMutate: async (updatedDocument) => {
        await queryClient.cancelQueries(`${project_id}-documents`);
        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );
        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              let newParent = oldData.find(
                (doc) => doc.id === updatedDocument.parent
              );
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.doc_id) {
                  return {
                    ...doc,
                    ...updatedDocument,
                    parent:
                      updatedDocument.parent && newParent
                        ? { id: newParent.id, title: newParent.title }
                        : doc.parent,
                  };
                } else {
                  return doc;
                }
              });
              return newData;
            } else {
              return [];
            }
          }
        );

        return { previousDocuments };
      },
      onSuccess: () => {
        documentsRefetch();
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
        toastError("There was an error updating this document.");
      },
    }
  );

  const categoriesMutation = useMutation(
    async (vars: { doc_id: string; categories: string[] }) =>
      await updateDocument(vars.doc_id, undefined, undefined, vars.categories),
    {
      onMutate: async (updatedDocument) => {
        await queryClient.cancelQueries(`${project_id}-documents`);

        const previousDocuments = queryClient.getQueryData(
          `${project_id}-documents`
        );

        queryClient.setQueryData(
          `${project_id}-documents`,
          (oldData: Document[] | undefined) => {
            if (oldData) {
              return oldData.map((document: Document) => {
                if (document.id === updatedDocument.doc_id) {
                  return {
                    ...document,
                    categories: updatedDocument.categories,
                  };
                } else {
                  return document;
                }
              });
            } else {
              return [];
            }
          }
        );

        return { previousDocuments };
      },
      onSuccess: async (data, vars) => {
        let projectData: Project = queryClient.getQueryData(
          `${project_id}-project`
        ) as Project;

        if (projectData) {
          // Filter out any categories that are not already present in the global project categories
          let difference = vars.categories.filter(
            (cat) => !projectData.categories.includes(cat)
          );
          // Only update if there is a new category not present in the project categories
          if (difference.length > 0) {
            const updatedProject = await updateProject(
              project_id as string,
              undefined,
              projectData.categories.concat(difference)
            );

            if (updatedProject) {
              queryClient.setQueryData(
                `${project_id}-project`,
                (oldData: Project | undefined) => {
                  let newData: any = {
                    ...oldData,
                    categories: updatedProject.categories,
                  };
                  return newData;
                }
              );
            }
          }
        }
      },
      onError: (error, updatedDocument, context) => {
        if (context)
          queryClient.setQueryData(
            `${project_id}-documents`,
            context.previousDocuments
          );

        toastError("There was an error updating your document.");
      },
    }
  );

  if (documentsError || documentsLoading || projectError || projectLoading)
    return <LoadingScreen />;
  const categoriesBodyTemplate = (rowData: Document) => {
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
        options={project?.categories.sort() || []}
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
  const parentFilterTemplate = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={documents?.filter((doc) => doc.folder) || []}
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

  const imageBodyTemplate = (rowData: Document) => {
    return (
      <div className="w-full h-auto cursor-pointer flex justify-content-center">
        {rowData.image && (
          <img
            src={rowData.image}
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
  const folderBodyTemplate = (rowData: Document) => {
    return (
      <div className="relative flex justify-content-center">
        <Checkbox
          checked={rowData.folder}
          onChange={(e) =>
            updateDocumentMutation.mutate({
              doc_id: rowData.id,
              folder: e.checked,
            })
          }
        />
      </div>
    );
  };
  const deleteBodyTemplate = (rowData: Document) => {
    return (
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
                  (oldData: Document[] | undefined) => {
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
    );
  };
  const iconBodyTemplate = (rowData: Document) => {
    return (
      <Icon icon={rowData.icon} fontSize={30} className="cursor-pointer" />
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
            const newDocument = (await createDocument(
              project_id as string,
              undefined
            )) as Document;
            if (newDocument) {
              queryClient.setQueryData(
                `${project_id}-documents`,
                (oldData: Document[] | undefined) => {
                  if (oldData) {
                    const newData = [...oldData, newDocument];
                    return newData;
                  } else {
                    return [newDocument];
                  }
                }
              );
            }
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
                  (doc: Document) => doc.id
                );
                deleteManyDocuments(documentIdsForDeletion).then(() => {
                  queryClient.setQueryData(
                    `${project_id}-documents`,
                    (oldData: Document[] | undefined) => {
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
        options={documents?.filter((doc) => doc.folder) || []}
        optionLabel="title"
        optionValue="id"
        onChange={(e) => {
          if (options.rowData.id && e.value)
            updateDocumentMutation.mutate({
              doc_id: options.rowData.id,
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
      <InputText
        className="w-full"
        value={options.value}
        onChange={(e) => {
          if (options.rowData.id && e.target.value)
            //@ts-ignore
            options.editorCallback(e.target.value);
        }}
      />
    );
  };
  const categoryEditor = (options: ColumnEditorOptions) => {
    return (
      <AutoComplete
        value={
          documents?.find((doc) => doc.id === options.rowData.id)?.categories ||
          []
        }
        suggestions={filteredCategories}
        placeholder={
          options.rowData.categories ? "" : "Enter tags for this document..."
        }
        completeMethod={(e) =>
          searchCategory(e, project?.categories || [], setFilteredCategories)
        }
        multiple
        onChange={async (e) => {
          categoriesMutation.mutate({
            doc_id: options.rowData.id,
            categories: e.value,
          });
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") e.preventDefault();
          if (e.currentTarget.value !== "") {
            if (
              options.rowData.categories &&
              !options.rowData.categories.includes(e.currentTarget.value)
            ) {
              // @ts-ignore
              options.editorCallback([
                ...options.rowData.categories,
                e.currentTarget.value,
              ]);

              // categoriesMutation.mutate({
              //   doc_id: options.rowData.id,
              //   categories: ,
              // });
            } else if (!options.rowData.categories) {
              if (e.key === "Enter")
                // @ts-ignore
                options.editorCallback([e.currentTarget.value]);
            }
            // e.currentTarget.value = "";
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
    <div className="w-full px-8 mx-8 mt-4">
      <ConfirmDialog />
      <Toolbar
        className="mb-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataTable
        ref={ref}
        value={documents
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
          setSelectAll(value.length === documents?.length);
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
          onCellEditComplete={(e: any) => {
            if (e.rowData.id && e.newValue)
              updateDocumentMutation.mutate({
                doc_id: e.rowData.id,
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
          onCellEditComplete={(e: any) => {
            if (e.rowData.id && e.newValue)
              updateDocumentMutation.mutate({
                doc_id: e.rowData.id,
                image: e.newValue,
              });
          }}
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
          filterField="categories"
          body={categoriesBodyTemplate}
          filterMenuStyle={{ width: "25rem" }}
          filter
          filterMatchMode="custom"
          showFilterMatchModes={false}
          filterFunction={(value: string[], filter: string[] | null) => {
            if (!filter) return true;
            if (filter.every((f: string) => value.includes(f))) {
              return true;
            } else {
              return false;
            }
          }}
          filterElement={categoriesFilterTemplate}
          onFilterApplyClick={(e) => console.log(e)}
          editor={categoryEditor}
        />
        <Column
          header="Icon"
          field="icon"
          editor={iconEditor}
          onCellEditInit={(e: any) => {
            setIconSelect({
              doc_id: e.rowData.id,
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
        <Column header="Delete" body={deleteBodyTemplate} />
      </DataTable>
    </div>
  );
}
