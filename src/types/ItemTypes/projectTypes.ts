import { MemberType } from "../generalTypes";

export type ProjectType = {
  id: string;
  title: string;
  image?: string;
  ownerId: string;
  members: MemberType[];
};
