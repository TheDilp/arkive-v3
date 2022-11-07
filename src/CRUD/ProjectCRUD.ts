import { ProjectType } from "../types/projectTypes";
import { trpc } from "../utils/trpcClient";

export const useGetAllProjects = () => {
  return trpc.project.getAllProjects.useQuery();
};

export const useCreateProject = () => {
  const utils = trpc.useContext();
  return trpc.project.createProject.useMutation({
    onMutate: (newProject: ProjectType) => {
      const previousProjects = utils.project.getAllProjects.getData();

      utils.project.getAllProjects.setData(
        undefined,
        (old: ProjectType[] | undefined) =>
          old ? [...old, newProject] : [newProject]
      );

      return { previousProjects, newProject };
    },
    onError: (error, variables, rollback) => {
      utils.project.getAllProjects.setData(
        undefined,
        rollback?.previousProjects
      );
    },
  });
};
