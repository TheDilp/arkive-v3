import { createClient } from "@supabase/supabase-js";
import { RemirrorJSON } from "remirror";
import { StringMappingType } from "typescript";
import {
  BoardProps,
  DocumentProps,
  MapProps,
  MapMarkerProps,
  UpdateEdgeProps,
  ProfileProps,
  ProjectProps,
  BoardEdgeProps,
  UpdateNodeProps,
  CreateNodeProps,
} from "../custom-types";
import { toastError } from "./utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(
  supabaseUrl as string,
  supabaseKey as string
);

export const auth = supabase.auth;

// Auth functions
export const register = async (email: string, password: string) => {
  await supabase.auth.signUp({ email, password });
};
export const login = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (user) return user;
  if (error) {
    toastError("There was an error logging you in. Please try again.");
    throw new Error(error.message);
  }
};
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toastError("There was an error logging you out. Please try again.");
    throw new Error(error.message);
  }
};

// SELECT

export const getProjects = async () => {
  let user = auth.user();
  if (user) {
    const { data: projects, error } = await supabase
      .from<ProjectProps>("projects")
      .select("id, title, cardImage, user_id")
      .eq("user_id", user.id);

    if (projects) return projects;
    if (error) {
      toastError("There was an error getting your projects.");
      throw new Error(error.message);
    }
  }
};
export const getCurrentProject = async (project_id: string) => {
  let user = auth.user();

  if (user) {
    const { data: project, error } = await supabase
      .from<ProjectProps>("projects")
      .select("id, title, user_id, cardImage")
      .eq("id", project_id);

    if (project) return project[0];
    if (error) {
      toastError("There was an error getting your project data.");
      throw new Error(error.message);
    }
  }
};
export const getDocuments = async (project_id: string) => {
  let user = auth.user();
  if (user) {
    const { data: documents, error } = await supabase
      .from<DocumentProps>("documents")
      .select("*, parent(id, title)")
      .eq("project_id", project_id)
      .order("title", { ascending: true });
    if (documents) return documents;
    if (error) {
      toastError("There was an error getting your documents.");
      throw new Error(error.message);
    }
  }
};
export const getTags = async (project_id: string) => {
  const { data, error } = await supabase.rpc("get_tags", { p_id: project_id });
  if (data) return data;
  if (error) {
    toastError("There was an error getting your tags.");
    throw new Error(error.message);
  }
};
export const getMaps = async (project_id: string) => {
  const { data, error } = await supabase
    .from<MapProps>("maps")
    .select("*, markers:markers!map_id(*)")
    .eq("project_id", project_id);
  if (data) return data;
  if (error) {
    toastError("There was an error getting your maps.");
    throw new Error(error.message);
  }
};
export const getBoards = async (project_id: string) => {
  const { data, error } = await supabase
    .from<BoardProps>("boards")
    .select("*, nodes(*, document:documents(id, image)), edges(*)")
    .eq("project_id", project_id);
  if (data) return data;
  if (error) {
    toastError("There was an error getting your boards.");
    throw new Error(error.message);
  }
};
export const getProfile = async () => {
  let user = auth.user();
  if (user) {
    const { data: profile, error } = await supabase
      .from<ProfileProps>("profiles")
      .select("id, nickname, profile_image")
      .eq("user_id", user.id);
    if (profile) return profile[0];
    if (error) {
      toastError("There was an error getting your profile.");
      throw new Error(error.message);
    }
  }
};
// INSERT

export const createDocument = async ({
  id,
  project_id,
  title,
  parent,
  content,
  icon,
  image,
  categories,
  folder,
}: {
  id?: string;
  title?: string;
  icon?: string;
  image?: string;
  project_id: string;
  parent?: string | null;
  categories?: string[];
  folder?: boolean;
  content?: RemirrorJSON | null;
}) => {
  let user = auth.user();
  if (user) {
    const { data: document, error } = await supabase
      .from<DocumentProps>("documents")
      .insert({
        id,
        project_id,
        title,
        content,
        image,
        icon,
        folder,
        categories,
        // @ts-ignore
        parent,
      });
    if (document) return document[0];
    if (error) {
      toastError("There was an error creating your document.");
      throw new Error(error.message);
    }
  }
};
export const createProject = async () => {
  let user = auth.user();
  if (user) {
    const { data: project, error } = await supabase
      .from<ProjectProps>("projects")
      .insert({
        title: "New Project",
        user_id: user.id,
        cardImage: "",
      });
    if (project) return project[0];
    if (error) {
      toastError("There was an error creating your project.");
      throw new Error(error.message);
    }
  }
};
export const createTemplate = async ({
  id,
  project_id,
  title,
  content,
  parent,
  icon,
  image,
  categories,
  folder,
}: {
  id: string;
  title: string;
  content: RemirrorJSON;
  project_id: string;
  icon?: string;
  image?: string;
  parent?: string | null;
  categories?: string[];
  folder?: boolean;
}) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("documents").insert({
      id,
      project_id,
      title,
      content,
      parent,
      icon,
      image,
      categories,
      folder,
      template: true,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your template.");
      throw new Error(error.message);
    }
  }
};
export const createMap = async ({
  id,
  project_id,
  title,
  map_image,
  parent,
  folder,
}: {
  id: string;
  title: string;
  map_image: string;
  project_id: string;
  parent?: string | null;
  folder?: boolean;
}) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("maps").insert({
      id,
      project_id,
      title,
      map_image,
      parent,
      folder,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your map.");
      throw new Error(error.message);
    }
  }
};
export const createMapMarker = async ({
  id,
  map_id,
  text,
  icon,
  color,
  lat,
  lng,
  doc_id,
  map_link,
}: {
  id: string;
  map_id: string;
  lat: number;
  lng: number;
  icon?: string;
  color?: string;
  text?: string;
  doc_id?: string;
  map_link?: string;
}) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("markers").insert({
      id,
      map_id,
      text,
      icon,
      color,
      lat,
      lng,
      doc_id,
      map_link,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your map marker.");
      throw new Error(error.message);
    }
  }
};
export const createBoard = async ({
  id,
  title,
  project_id,
  parent,
  folder,
  layout,
}: {
  id: string;
  title: string;
  project_id: string;
  parent?: string | null;
  folder: boolean;
  layout: string;
}) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("boards").insert({
      id,
      title,
      project_id,
      parent,
      folder,
      layout,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your board.");
      throw new Error(error.message);
    }
  }
};
export const createNode = async ({
  id,
  label,
  x,
  y,
  board_id,
  type,
  backgroundColor,
  doc_id,
}: CreateNodeProps) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("nodes").insert({
      id,
      label,
      x,
      y,
      board_id,
      type,
      backgroundColor,
      doc_id,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your node.");
      throw new Error(error.message);
    }
  }
};
export const createEdge = async ({
  id,
  source,
  target,
  board_id,
  curveStyle,
  lineStyle,
  lineColor,
}: Omit<BoardEdgeProps, "label">) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("edges").insert({
      id,
      source,
      target,
      board_id,
      curveStyle,
      lineStyle,
      lineColor,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your edge.");
      throw new Error(error.message);
    }
  }
};

// UPDATE
export const updateDocument = async ({
  doc_id,
  title,
  content,
  folder,
  parent,
  image,
  icon,
  categories,
  expanded,
}: {
  doc_id: string;
  title?: string;
  content?: RemirrorJSON;
  folder?: boolean;
  parent?: string | null;
  image?: string;
  icon?: string;
  expanded?: boolean;
  categories?: string[];
}) => {
  let user = auth.user();

  if (user) {
    const { data: document, error } = await supabase
      .from<DocumentProps>("documents")
      .update({
        title,
        content,
        folder,
        // @ts-ignore
        parent,
        image,
        icon,
        categories,
        expanded,
      })
      .eq("id", doc_id);

    if (document) return document[0];
    if (error) {
      toastError("There was an error updating your document.");
      throw new Error(error.message);
    }
  }
};
export const updateProject = async (
  project_id: string,
  title?: string,
  categories?: string[],
  cardImage?: string
) => {
  let user = auth.user();

  if (user) {
    const { data: project, error } = await supabase
      .from<ProjectProps>("projects")
      .update({
        title,
        categories,
        cardImage,
      })
      .eq("id", project_id);

    if (project) return project[0];
    if (error) {
      toastError("There was an error updating your project.");
      throw new Error(error.message);
    }
  }
};
export const updateMap = async ({
  id,
  title,
  map_image,
  parent,
}: {
  id: string;
  title?: string;
  map_image?: string;
  parent?: string | null;
}) => {
  console.log(parent);
  let user = auth.user();

  if (user) {
    const { data: map, error } = await supabase
      .from<MapProps>("maps")
      .update({
        title,
        map_image,
        parent,
      })
      .eq("id", id);

    if (map) return map[0];
    if (error) {
      toastError("There was an error updating your map.");
      throw new Error(error.message);
    }
  }
};
export const updateMapMarker = async ({
  id,
  icon,
  color,
  text,
  lat,
  lng,
  doc_id,
  map_link,
}: {
  id: string;
  map_id: string;
  text?: string;
  icon?: string;
  color?: string;
  lat?: number;
  lng?: number;
  doc_id?: string;
  map_link?: string;
}) => {
  const { data, error } = await supabase
    .from<MapMarkerProps>("markers")
    .update({
      icon,
      color,
      text,
      lat,
      lng,
      doc_id,
      map_link,
    })
    .eq("id", id);

  if (data) return data;
  if (error) {
    toastError("There was an error updating your map marker.");
    throw new Error(error.message);
  }
};
export const updateBoard = async ({
  id,
  title,
  parent,
  layout,
}: {
  id: string;
  title?: string;
  parent?: string | null;
  layout?: string;
}) => {
  let user = auth.user();

  if (user) {
    const { data, error } = await supabase
      .from("boards")
      .update({
        title,
        parent,
        layout,
      })
      .eq("id", id);

    if (data) return data;
    if (error) {
      toastError("There was an error updating your board.");
      throw new Error(error.message);
    }
  }
};
export const updateNode = async ({
  id,
  label,
  x,
  y,
  type,
  width,
  height,
  fontSize,
  backgroundColor,
  textVAlign,
  textHAlign,
  customImage,
  zIndex,
  parent,
  doc_id,
}: UpdateNodeProps) => {
  let user = auth.user();

  if (user) {
    const { data, error } = await supabase
      .from("nodes")
      .update({
        label,
        x,
        y,
        type,
        width,
        height,
        fontSize,
        textHAlign,
        textVAlign,
        backgroundColor,
        customImage,
        zIndex,
        parent,
        doc_id,
      })
      .eq("id", id);

    if (data) return data;
    if (error) {
      toastError("There was an error updating your node.");
      throw new Error(error.message);
    }
  }
};
export const updateEdge = async ({
  id,
  label,
  curveStyle,
  lineStyle,
  lineColor,
  controlPointDistances,
  controlPointWeights,
  taxiDirection,
  taxiTurn,
  targetArrowShape,
  zIndex,
}: UpdateEdgeProps) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("edges")
      .update({
        label,
        curveStyle,
        lineStyle,
        lineColor,
        controlPointDistances,
        controlPointWeights,
        taxiDirection,
        taxiTurn,
        targetArrowShape,
        zIndex,
      })
      .eq("id", id);

    if (data) return data;
    if (error) {
      toastError("There was an error updating your edge.");
      throw new Error(error.message);
    }
  }
};
export const updateMultipleDocumentsParents = async (
  documents: Pick<DocumentProps, "id" | "parent">[]
) => {
  let user = auth.user();

  if (user) {
    const { data: updatedDocuments, error } = await supabase
      .from<DocumentProps>("documents")
      .upsert(documents);

    if (updatedDocuments) return updatedDocuments;
    if (error) {
      toastError("There was an error updating your documents.");
      throw new Error(error.message);
    }
  }
};
export const updateProfile = async (
  id: string,
  nickname?: string,
  profile_image?: string
) => {
  let user = auth.user();

  if (user) {
    const { data: profile, error } = await supabase
      .from<ProfileProps>("profiles")
      .update({
        nickname,
        profile_image,
      })
      .eq("id", id);

    if (profile) return profile[0];
    if (error) {
      toastError("There was an error updating your profile.");
      throw new Error(error.message);
    }
  }
};

// DELETE

export const deleteDocument = async (doc_id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase
      .from<DocumentProps>("documents")
      .delete()
      .eq("id", doc_id);

    if (error) {
      toastError("There was an error deleting your document.");
      throw new Error(error.message);
    }
  }
};
export const deleteManyDocuments = async (doc_ids: string[]) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase.rpc("delete_many_documents", {
      ids: doc_ids,
    });

    if (error) {
      toastError("There was an error deleting your documents.");
      throw new Error(error.message);
    }
  }
};
export const deleteProject = async (project_id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase
      .from<ProjectProps>("projects")
      .delete()
      .eq("id", project_id);

    if (error) {
      toastError("There was an error deleting your project.");
      throw new Error(error.message);
    }
  }
};
export const deleteMap = async (map_id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase
      .from<MapProps>("maps")
      .delete()
      .eq("id", map_id);

    if (error) {
      toastError("There was an error deleting your map.");
      throw new Error(error.message);
    }
  }
};
export const deleteMapMarker = async (id: string) => {
  const { error } = await supabase
    .from<MapMarkerProps>("markers")
    .delete()
    .eq("id", id);

  if (error) {
    toastError("There was an error deleting your map marker.");
    throw new Error(error.message);
  }
};
export const deleteBoard = async (id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase.from("boards").delete().eq("id", id);
    if (error) {
      toastError("There was an error deleting your board.");
      throw new Error(error.message);
    }
  }
};
export const deleteNode = async (id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase.from("nodes").delete().eq("id", id);
  }
};
export const deleteEdge = async (id: string) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase.from("edges").delete().eq("id", id);
    if (error) {
      toastError("There was an error deleting your edge.");
      throw new Error(error.message);
    }
  }
};
