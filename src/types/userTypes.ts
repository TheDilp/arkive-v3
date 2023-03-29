import { WebhookType } from "./generalTypes";
import { ProjectType } from "./ItemTypes/projectTypes";

export type UserType = {
  id: string;
  auth_id: string;
  nickname: string;
  email: string;
  image?: string;
  webhooks: WebhookType[];

  projects?: ProjectType[];
  createrOf?: ProjectType[];
};
