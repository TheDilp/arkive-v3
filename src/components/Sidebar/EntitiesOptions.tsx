import { Link, useParams } from "react-router-dom";

import { useGetAllItems } from "../../CRUD/ItemsCRUD";
import { EntityType } from "../../types/ItemTypes/entityTypes";
import { TreeSkeleton } from "../Skeleton/Skeleton";

export default function EntitiesOptions() {
  const { project_id } = useParams();
  const { data, isFetching } = useGetAllItems<EntityType>(project_id as string, "entities", { staleTime: 60 * 60 * 5 });
  return (
    <div className="rounded bg-zinc-700 text-white">
      <ul className="flex w-56 flex-col p-2">
        <li className="hover:text-sky-400">
          <Link to={`/project/${project_id}/entities/create`}>Create new entity</Link>
        </li>
        {isFetching ? (
          <TreeSkeleton />
        ) : (
          data?.map((entity) => (
            <Link key={entity.id} to={`/project/${project_id}/entities/${entity.id}`}>
              {entity.title}
            </Link>
          ))
        )}
      </ul>
    </div>
  );
}
