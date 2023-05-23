import { WebhookType } from "./generalTypes";
import { PermissionType, ProjectType } from "./ItemTypes/projectTypes";

export type UserType = {
  id: string;
  auth_id: string;
  nickname: string;
  email: string;
  image?: string;
  webhooks: WebhookType[];

  projects?: ProjectType[];
  createrOf?: ProjectType[];

  roles: RoleType[];
  permissions: PermissionType[];
};

export type RoleType = {
  id: string;
  title: string;
  description?: string;
  project: ProjectType;
  project_id: string;
  permissions: PermissionType[];
};
