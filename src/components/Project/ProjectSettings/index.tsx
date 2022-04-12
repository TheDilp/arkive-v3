import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog"; // To use confirmDialog method
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toolbar } from "primereact/toolbar";
import { Checkbox } from "primereact/checkbox";
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

export default function ProjectSettings() {
  const { project_id } = useParams();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
    folder: { value: null, matchMode: FilterMatchMode.EQUALS },
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
  } = useQuery(
    `${project_id}-documents`,
    async () => await getDocumentsForSettings(project_id as string),
    { enabled: !queryClient.getQueryData(`${project_id}-documents`) }
  );
  const {
    data: project,
    error: projectError,
    isLoading: projectLoading,
  } = useQuery(
    `${project_id}-project`,
    async () => await getCurrentProject(project_id as string)
  );

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
        className="p-column-filter w-12"
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

  const imageBodyTemplate = (rowData: Document) => {
    return (
      <div className="w-4rem h-4rem relative">
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
  const parentBodyTemplate = (rowData: Document) => {
    let docs: Document[] | undefined = queryClient.getQueryData(
      `${project_id}-documents`
    );
    if (docs) {
      return docs.find((doc) => doc.id === rowData.parent)?.title || "";
    }
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
          label="Clear"
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
              categories: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
  const onSelectAllChange = (event: any) => {
    const selectAll = event.checked;

    if (selectAll && documents) {
      setSelectAll(true);
      setSelectedDocuments(documents);
    } else {
      setSelectAll(false);
      setSelectedDocuments([]);
    }
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
        rows={8}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
        onSelectionChange={(e) => {
          const value = e.value;
          setSelectedDocuments(value);
          setSelectAll(value.length === documents?.length);
        }}
        filterDisplay="menu"
        filters={filter}
        globalFilterFields={["title"]}
        size="small"
      >
        <Column selectionMode="multiple"></Column>
        <Column field="title" header="Title" filter></Column>
        <Column field="image" header="Image" body={imageBodyTemplate}></Column>
        <Column
          header="Folder"
          field="folder"
          filter
          body={folderBodyTemplate}
        ></Column>
        <Column
          header="Parent"
          field="parent"
          filter
          body={parentBodyTemplate}
          className="w-10rem"
        ></Column>
        <Column
          header={() => <div className="text-center">Categories</div>}
          filterField="categories"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "28rem" }}
          body={categoriesBodyTemplate}
          filterElement={categoriesFilterTemplate}
          filter
        />
        <Column header="Delete" body={deleteBodyTemplate} />
      </DataTable>
    </div>
  );
}
