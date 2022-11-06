import { useQuery } from "@tanstack/react-query";

export const useQueryHook = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["allProjects"],
    queryFn: async (): Promise<[]> => {
      const res = await (await getFunction(getURLS.getAllProjects)).json();
      return res.data;
    },
  });
};
