import { DocumentType } from "./documentTypes";

export type ProjectType = {
  id: string;
  title: string;
  documents?: DocumentType[];
};
