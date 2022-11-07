import { DefaultDocument } from "../utils/DefaultValues/DocumentDefaults";
import { trpc } from "../utils/trpcClient";

export const useCreateDocument = () => {
  const utils = trpc.useContext();
  return trpc.document.createDocument.useMutation({
    onMutate: (newDocument) => {
      const previousProject = utils.project.getSingleProject.getData(
        newDocument.project_id
      );

      utils.project.getSingleProject.setData(newDocument.project_id, (old) => {
        if (old) {
          return {
            ...old,
            documents: [
              ...old.documents,
              { ...DefaultDocument, ...newDocument },
            ],
          };
        }
      });

      return { previousProject, newDocument };
    },
    onError: (error, variables, rollback) => {
      utils.project.getSingleProject.setData(
        variables.project_id,
        rollback?.previousProject
      );
    },
  });
};
