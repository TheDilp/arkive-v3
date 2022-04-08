import { Link } from "react-router-dom";
import { Project } from "../../custom-types";
import { Card } from "primereact/card";
import "../../styles/ProjectCard.css";
export default function ProjectCard({ ...Project }: Project) {
  const header = (
    <img
      alt="Card"
      src={Project.cardImage}
      style={{ objectFit: "cover" }}
      className="w-full h-15rem cardImage"
    />
  );
  return (
    <Link to={`/project/${Project.id}/wiki`} className="w-3 mx-2 no-underline">
      <Card
        title={Project.title}
        className="text-center relative w-full h-full overflow-hidden projectCard"
        header={header}
      ></Card>
    </Link>
  );
}
