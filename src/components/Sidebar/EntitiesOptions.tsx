import { Link, useParams } from "react-router-dom";

export default function EntitiesOptions() {
  const { project_id } = useParams();
  return (
    <div className="rounded bg-zinc-700 text-white">
      <ul className="flex w-56 flex-col p-2">
        <li className="hover:text-sky-400">
          <Link to={`/project/${project_id}/entities/create`}>Create new entity</Link>
        </li>
      </ul>
    </div>
  );
}
