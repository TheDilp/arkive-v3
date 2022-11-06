import { useQuery } from "@tanstack/react-query";
import { getURLS } from "../types/enums";
import { ProjectType } from "../types/projectTypes";
import { getFunction } from "../utils/CRUD";

type Props = {};

export default function Dashboard({}: Props) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["allProjects"],
    queryFn: async (): Promise<ProjectType[]> => {
      const res = await (await getFunction(getURLS.getAllProjects)).json();
      return res.data;
    },
  });

  if (isLoading) return <span> "Loading..." </span>;

  if (error) return <span> "An error has occurred" </span>;
  return <div>{data && data.map((project) => project.title)}</div>;
}
