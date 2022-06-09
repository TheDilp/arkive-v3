import React, { createContext, useState } from "react";

interface ProjectContextProps {
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
}

export const ProjectContext = createContext<ProjectContextProps>({
  id: "",
  setId: () => {},
});

export default function ProjectContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [id, setId] = useState("");

  return (
    <ProjectContext.Provider value={{ id, setId }}>
      {children}
    </ProjectContext.Provider>
  );
}
