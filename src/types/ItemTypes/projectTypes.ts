import { MemberType } from "../generalTypes";

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
  members: MemberType[];
  swatches: SwatchType[];
};
