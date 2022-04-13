import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import {
  Column,
  ColumnEditorOptions,
  ColumnEventParams,
} from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toolbar } from "primereact/toolbar";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { Document } from "../../../custom-types";
import {
  createDocument,
  deleteDocument,
  deleteManyDocuments,
  getCurrentProject,
  getDocumentsForSettings,
  updateDocument,
  updateMultipleDocumentsParents,
} from "../../../utils/supabaseUtils";
import LoadingScreen from "../../Util/LoadingScreen";
import { toastError } from "../../../utils/utils";

export default function ProjectSettings() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    categories: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    folder: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    "parent.title": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filter = { ...filter };
    _filter.global.value = value;

    setFilter(_filter);
    setGlobalFilterValue1(value);
  };
  const {
    data: documents,
    error: documentsError,
    isLoading: documentsLoading,
    refetch: documentsRefetch,
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocumentsForSettings(project_id as string)
  );
  const {
    data: project,
    error: projectError,
    isLoading: projectLoading,
  } = useQuery(
    `${project_id}-project`,
    async () => await getCurrentProject(project_id as string)
  );

  // MUTATIONS
  const updateType = useMutation(
    async (vars: { doc_id: string; folder: boolean }) =>
      await updateDocument(
        vars.doc_id,
        undefined,
        undefined,
        undefined,
        vars.folder
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
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.doc_id) {
                  return { ...doc, folder: updatedDocument.folder };
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

        if (!updatedDocument.folder) {
          let children: Document[] | undefined = queryClient.getQueryData(
            `${project_id}-documents`
          );

          // If the folder is changing back to a document
          // Updated the children's (if there are any) parent to the root folder
          // Otherwise the user won't be able to access the children if this doesn't occur
          // Since the children will be still under the parent which cannot be expanded if it is a file type

          if (children) {
            children = children
              .filter((child) => child.parent === updatedDocument.doc_id)
              .map((child) => ({ ...child, parent: null }));
            updateMultipleDocumentsParents(children);

            queryClient.setQueryData(
              `${project_id}-documents`,
              (oldData: Document[] | undefined) => {
                if (oldData) {
                  let newData: Document[] = oldData.map((doc) => {
                    if (doc.parent === updatedDocument.doc_id) {
                      return { ...doc, parent: null };
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
          }
        }

        return { previousDocuments };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
      },
      onSuccess: (data, vars) => {},
    }
  );
  const updateParentMutation = useMutation(
    async (vars: { doc_id: string; parent: string | null }) =>
      await updateDocument(
        vars.doc_id,
        undefined,
        undefined,
        undefined,
        undefined,
        vars.parent
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
            let newParentTitle = oldData.find(
              (doc) => doc.id === updatedDocument.parent
            );
            if (oldData && newParentTitle) {
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.doc_id) {
                  return {
                    ...doc,
                    parent: {
                      id: updatedDocument.parent as string,
                      title: newParentTitle?.title as string,
                    },
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
        toastError("There was an error updating the parent of this document.");
      },
    }
  );
  const documentTitleMutation = useMutation(
    async (vars: { doc_id: string; title: string }) => {
      await updateDocument(vars.doc_id, vars.title);
    },
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
              let newData: Document[] = oldData.map((doc) => {
                if (doc.id === updatedDocument.doc_id) {
                  return { ...doc, title: updatedDocument.title };
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
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          `${project_id}-documents`,
          context?.previousDocuments
        );
        toastError("There was an error updating your document.");
      },
    }
  );

  if (documentsError || documentsLoading || projectError || projectLoading)
    return <LoadingScreen />;
  const categoriesBodyTemplate = (rowData: Document) => {
    return (
      <div className="">
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
        options={project?.categories || []}
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

  const imageBodyTemplate = (rowData: Document) => {
    return (
      <div className="w-2rem h-2rem relative">
        {rowData.image && (
          <img
            src={rowData.image}
            alt="document"
            className="w-full h-full border-round"
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
            updateType.mutate({ doc_id: rowData.id, folder: e.checked })
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
          label="Clear All"
          className="p-button-outlined mr-2"
          onClick={() =>
            // @ts-ignore
            setFilter({
              global: { value: null, matchMode: FilterMatchMode.CONTAINS },
              title: {
                operator: FilterOperator.AND,
                constraints: [
                  { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                ],
              },
              categories: {
                operator: FilterOperator.AND,
                constraints: [
                  { value: null, matchMode: FilterMatchMode.CONTAINS },
                ],
              },
            })
          }
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange}
            placeholder="Quick Search"
          />
        </span>
      </div>
    );
  };

  const parentEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={documents?.filter((doc) => doc.folder) || []}
        optionLabel="title"
        optionValue="id"
        onChange={(e) => {
          if (options.rowData.id && e.value)
            updateParentMutation.mutate({
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

  return (
    <div className="w-full px-8 mx-8 mt-4">
      <ConfirmDialog />
      <Toolbar
        className="mb-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataTable
        value={documents}
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
        filters={filter}
        globalFilterFields={["title"]}
        sortField="title"
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
              documentTitleMutation.mutate({
                doc_id: e.rowData.id,
                title: e.newValue,
              });
          }}
        ></Column>
        <Column field="image" header="Image" body={imageBodyTemplate}></Column>
        <Column
          header="Is Folder"
          field="folder"
          filter
          filterElement={folderFilterTemplate}
          body={folderBodyTemplate}
          dataType="boolean"
          sortable
          style={{ width: "7rem" }}
        ></Column>
        <Column
          header="Parent"
          field="parent.title"
          filter
          sortable
          className="w-10rem text-center"
          editor={(options) => parentEditor(options)}
        ></Column>
        <Column
          header={() => <div className="text-center">Categories</div>}
          filterField="categories"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "25rem" }}
          body={categoriesBodyTemplate}
          filterElement={categoriesFilterTemplate}
          filter
        />
        <Column header="Delete" body={deleteBodyTemplate} />
      </DataTable>
    </div>
  );
}
