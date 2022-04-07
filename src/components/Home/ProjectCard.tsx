import { Link } from "react-router-dom";
import { Project } from "../../custom-types";

export default function ProjectCard({ ...Project }: Project) {
  return (
    <Link to={`/project/${Project.id}/wiki`} className="projectCardContainer">
      <div className="projectCard">
        <div className="projectCardTitleContainer">
          <h2>{Project.title}</h2>
        </div>
        <div className="projectCardImageContainer">
          <img
            src={Project.cardImage}
            alt="project"
            className="projectCardImage"
          />
        </div>
      </div>
    </Link>
  );
}
