import { NodeModel } from "@minoru/react-dnd-treeview";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast, ToastOptions } from "react-toastify";
import { Category, Document, Project } from "../custom-types";
import {
  createCategory,
  createDocument,
  getDocuments,
  getProjects,
  updateProject,
} from "./supabaseUtils";
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
  categories: Category[],
  setFilteredCategories: (categories: Category[]) => void
) => {
  setTimeout(() => {
    let _filteredCategories;
    if (!event.query.trim().length) {
      _filteredCategories = [...categories];
    } else {
      _filteredCategories = categories.filter((category) => {
        return category.tag.toLowerCase().startsWith(event.query.toLowerCase());
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
// CUSTOM HOOKS

// Custom hook for detecting if user clicked outside of element (ref)
export function useOnClickOutside(ref: any, handler: (event: any) => void) {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
// Custom hook for getting a project's data
export function useGetProjectData(project_id: string) {
  const { data } = useQuery("getAllProjects", async () => await getProjects());
  return data?.find((project) => project.id === project_id);
}
// Custom hook for updating a project's data
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation(
    async (vars: {
      project_id: string;
      title?: string;
      categories?: string[];
      cardImage?: string;
    }) =>
      await updateProject(
        vars.project_id,
        vars.title,
        vars.categories,
        vars.cardImage
      ),
    {
      onMutate: async (updatedProject) => {
        const previousProjects = queryClient.getQueryData(`getAllProjects`);
        queryClient.setQueryData(
          "getAllProjects",
          //   @ts-ignore
          (oldData: Project[] | undefined) => {
            if (oldData) {
              let newData: Project[] = oldData.map((project) => {
                if (project.id === updatedProject.project_id) {
                  return { ...project, ...updatedProject };
                } else {
                  return project;
                }
              });
              return newData;
            }
          }
        );
        return { previousProjects };
      },
      onSuccess: () => {
        toastSuccess("Project successfully updated.");
      },
    }
  );
}
// Custom hook for getting documents
export function useGetDocuments(project_id: string) {
  const { data } = useQuery(
    `${project_id}-documents`,
    async () => await getDocuments(project_id),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
  return data;
}
// Custom hook for creating a new document
export function useCreateDocument(project_id: string, user_id: string) {
  const queryClient = useQueryClient();
  return useMutation(async () => {
    const updatedDocument = await createDocument(project_id, undefined);
    if (updatedDocument) {
      queryClient.setQueryData(
        `${project_id}-documents`,
        (oldData: Document[] | undefined) => {
          if (oldData) {
            return [...oldData, updatedDocument];
          } else {
            return [updatedDocument];
          }
        }
      );
    }
  });
}
// Custom hook for creating a category
export function useCreateCategory() {
  return useMutation(
    async (vars: { tag: string; doc_id: string }) => {
      const newCategory = await createCategory(vars.tag, vars.doc_id).then(
        (newCat) => console.log(newCat)
      );
    },
    {
      onError: () => {
        toastError("There was an error creating that tag.");
      },
    }
  );
}
