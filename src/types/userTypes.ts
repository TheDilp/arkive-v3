import { ProjectType } from "./projectTypes";

export type UserType = {
  id: string;
  auth_id: string;
  nickname: string;
  email: string;

  projects?: ProjectType[];
  createrOf?: ProjectType[];
};
