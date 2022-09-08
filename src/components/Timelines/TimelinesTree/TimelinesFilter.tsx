import { Button } from "primereact/button";
import React from "react";
import { useCreateMap, useCreateTimeline } from "../../../utils/customHooks";
import { v4 as uuid } from "uuid";
import { useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Icon } from "@iconify/react";

type Props = {
    filter: string;
    setFilter: (filter: string) => void;
};

export default function TimelinesFilter({
    filter,
    setFilter,
}: Props) {
    const { project_id } = useParams();
    const createTimelineMutation = useCreateTimeline();

    return (
        <div className="w-full py-1 flex justify-content-between align-items-start flex-wrap">
            <div className="w-full py-2">
                <InputText
                    className="w-full"
                    placeholder="Search Timelines"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <Button
                label="New Folder"
                icon="pi pi-fw pi-folder"
                iconPos="right"
                className="p-button-outlined"
                onClick={() => {
                    let id = uuid();
                    createTimelineMutation.mutate({
                        id,
                        project_id: project_id as string,
                        title: "New Folder",
                        folder: true,
                        expanded: false,
                        parent: null
                    });
                }}
            />
            <Button
                label="New Timeline"
                icon={() => <Icon
                    className="hover:text-primary cursor-pointer"
                    icon="mdi:chart-timeline-variant"
                    fontSize={22}
                />}
                iconPos="right"
                className="p-button-outlined"
                onClick={() => {
                    let id = uuid();
                    createTimelineMutation.mutate({
                        id,
                        project_id: project_id as string,
                        title: "New Timeline",
                        folder: false,
                        expanded: false,
                        parent: null
                    });
                }}
            />
        </div>
    );
}
