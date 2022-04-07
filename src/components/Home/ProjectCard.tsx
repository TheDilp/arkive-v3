import { Link } from "react-router-dom";
import { Project } from "../../custom-types";
import { Card } from "primereact/card";
export default function ProjectCard({ ...Project }: Project) {
  return (
    <Link to={`/project/${Project.id}/wiki`} className="projectCardContainer">
      <Card title="Title" subTitle="SubTitle">
        Content
      </Card>
    </Link>
  );
}
