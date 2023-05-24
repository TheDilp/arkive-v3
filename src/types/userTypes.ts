import { WebhookType } from "./generalTypes";
import { PermissionType, ProjectType, RoleType } from "./ItemTypes/projectTypes";

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
