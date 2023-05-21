import { Icon } from "@iconify/react";
import { useAtomValue } from "jotai";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Link, useParams } from "react-router-dom";

import defaultImage from "../../assets/DefaultProjectImage.jpg";
import { ProjectViewSkeleton } from "../../components/Skeleton/Skeleton";
import { useGetProjectDetails } from "../../CRUD/ProjectCRUD";
import { PermissionCategoriesType } from "../../types/generalTypes";
import { PermissionAtom } from "../../utils/Atoms/atoms";
import { IconEnum } from "../../utils/DefaultValues/GeneralDefaults";
import { checkIfCategoryAllowed } from "../../utils/uiUtils";

const statItems = [
  { title: "Documents", icon: IconEnum.document, item: "documents" as const },
  { title: "Maps", icon: IconEnum.map, item: "maps" as const },
  { title: "Graphs", icon: IconEnum.board, item: "boards" as const },
  { title: "Calendars", icon: IconEnum.calendar, item: "calendars" as const },
  { title: "Timelines", icon: IconEnum.timeline, item: "timelines" as const },
  { title: "Screens", icon: IconEnum.screen, item: "screens" as const },
  { title: "Dictionaries", icon: IconEnum.dictionary, item: "dictionaries" as const },
  { title: "Random tables", icon: IconEnum.randomtables, item: "random_tables" as const },
];

function CountHeader(count: number, icon: string, item: string) {
  return (
    <div className="flex items-center justify-between text-3xl font-bold">
      {count}
      <span className="flex items-center gap-x-2 text-2xl font-semibold text-zinc-300">
        {item.replaceAll("_", " ")}
        <Icon fontSize={32} icon={icon} />
      </span>
    </div>
  );
}

export default function ProjectView() {
  const { project_id } = useParams();
  const permission = useAtomValue(PermissionAtom);
  const {
    data: projectDetails,
    isLoading,
    isFetching,
  } = useGetProjectDetails(project_id as string, { staleTime: 60 * 24 * 1000 });
  if (isLoading || isFetching)
    return (
      <div className="h-full w-full">
        <ProjectViewSkeleton />
      </div>
    );

  if (projectDetails)
    return (
      <div className="grid h-full grid-cols-4 content-start items-start gap-4 overflow-auto p-20">
        <div
          className="col-span-1 hidden h-full lg:block"
          style={{
            backgroundImage: `url(${projectDetails?.image || defaultImage}) `,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="col-span-4 flex items-center justify-between gap-x-4 lg:col-span-3">
          <Card className="h-48 w-full" title={projectDetails.title}>
            <div className="flex flex-col gap-y-2">
              <div className="flex w-full items-center">
                <Avatar
                  image={projectDetails.owner.image}
                  label={projectDetails.owner.nickname.slice(0, 1)}
                  shape="circle"
                  size="large"
                />
                <span className="ml-2">
                  {projectDetails.owner.nickname}
                  <span className="pl-2 text-sm italic text-zinc-400">(Project owner)</span>
                </span>
              </div>
              {projectDetails.members.map((user) => (
                <div key={user.user_id} className="flex w-full items-center">
                  <Avatar image={user.member.image} label={user.member.nickname.slice(0, 1)} shape="circle" size="large" />
                  <span className="ml-2">
                    {user.member.nickname}
                    <span className="pl-2 text-sm italic text-zinc-400">(Project member)</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {statItems.map((item) => (
          <div key={item.item} className="col-span-4 md:col-span-2 lg:col-span-1">
            <Card
              className=" projectViewCard h-64 overflow-y-auto"
              title={() => CountHeader(projectDetails._count[item.item], item.icon, item.title)}>
              <h4 className="text-lg font-light text-zinc-600">Latest</h4>
              {projectDetails[item.item].length === 0 ? (
                <span className="italic text-zinc-600">There are no {item.item.replaceAll("_", " ")} created yet.</span>
              ) : (
                <div className="flex flex-col gap-y-2">
                  {projectDetails[item.item].map((subItem) => (
                    <Link
                      key={subItem.id}
                      className="truncate text-xl font-bold transition-colors hover:text-sky-400"
                      to={
                        checkIfCategoryAllowed(permission, item.item.toLowerCase() as PermissionCategoriesType)
                          ? `${item.item}/${subItem.id}`
                          : "#"
                      }>
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    );

  return null;
}
