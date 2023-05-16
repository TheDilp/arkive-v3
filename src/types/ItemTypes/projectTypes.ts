import { MemberType, PermissionType } from "../generalTypes";

export type SwatchType = {
  id: string;
  title?: string;
  color: string;
};

export type ProjectType = {
  id: string;
  title: string;
  image?: string;
  ownerId: string;
  members: { member: MemberType; permissions: PermissionType[]; user_id: string }[];
  swatches: SwatchType[];
};
