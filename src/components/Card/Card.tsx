import defaultImage from "../../assets/DefaultProjectImage.jpg";

import { Link } from "react-router-dom";
import Button from "../Button/Button";
import { VariantsENUM } from "../../enums/ComponentEnums";

type Props = {
  id: string;
  image?: string;
  title: string;
};

export default function ProjectCard({ id, image, title }: Props) {
  return (
    <div className="flex flex-col rounded bg-zinc-800 gap-y-2">
      <Link to={`../project/${id}/wiki`} className="relative no-underline">
        <img
          alt="Card"
          src={image || defaultImage}
          style={{ objectFit: "fill" }}
          className="w-full cursor-pointer h-60"
        />
      </Link>
      <h2 className="my-4 text-2xl font-bold text-center uppercase font-Lato">
        {title}
      </h2>
      <div className="flex flex-wrap justify-between px-6 pb-4">
        <Link to={`../project/${id}/wiki`} className="no-underline">
          {/* <Button
          label="Wiki"
          icon="pi pi-fw pi-file"
          iconPos="right"
          className="w-full p-button-outlined p-button-primary Lato"
        /> */}
          <Button
            icon="mdi:book-open-blank-variant"
            title="Wiki"
            variant={VariantsENUM.primary}
          />
        </Link>
        {/* <Link to={`../project/${Project.id}/maps`} className="w-4 no-underline">
        <Button
          // label="Maps"
          icon="pi pi-fw pi-map"
          iconPos="right"
          className="p-button-outlined p-button-primary Lato"
        />
      </Link>
      <Link to={`../project/${Project.id}/boards`} className="w-4 no-underline">
        <Button
          // label="Boards"
          icon={() => (
            <Icon
              className="cursor-pointer hover:text-primary "
              icon="mdi:draw"
              fontSize={20}
            />
          )}
          iconPos="right"
          className="p-button-outlined p-button-primary Lato"
        />
      </Link>
      <Link
        to={`../project/${Project.id}/timelines`}
        className="w-4 no-underline"
      >
        <Button
          icon={() => (
            <Icon
              className="cursor-pointer"
              icon="mdi:chart-timeline-variant"
              fontSize={22}
            />
          )}
          iconPos="right"
          className="p-button-outlined p-button-primary Lato"
        />
      </Link> */}

        <Link
          to={`/project/${id}/settings/project-settings`}
          className="no-underline"
        >
          <Button
            title="Settings"
            icon="mdi:cog-outline"
            variant={VariantsENUM.secondary}
          />
        </Link>
      </div>
    </div>
  );
}
