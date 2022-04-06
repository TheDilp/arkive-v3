import React from "react";
import { Project } from "../../custom-types";

export default function ProjectCard({ ...Project }: Project) {
  return (
    <div className="projectCardContainer">
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
    </div>
  );
}
