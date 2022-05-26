import { createClient } from "@supabase/supabase-js";
import { Image } from "primereact/image";
import { RemirrorJSON } from "remirror";

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
  ImageProps,
  DocumentUpdateProps,
  DocumentCreateProps,
  MapUpdateProps,
  MapCreateProps,
  TemplateCreateProps,
  CreateMapMarkerProps,
  CreateBoardProps,
  UpdateMapMarkerProps,
  UpdateBoardProps,
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
      .select("*, parent(id, title), image(id, title, link)")
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
    .select(
      "id, title, parent(id), folder, expanded, project_id, markers:markers!map_id(*), map_image:images!maps_map_image_fkey(id, title, link)"
    )
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
    .select(
      "*, nodes(*, document:documents(id, image(link)), customImage(id, title, link, type)), edges(*)"
    )
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

export const createDocument = async (
  DocumentCreateProps: DocumentCreateProps
) => {
  let user = auth.user();
  if (user) {
    const { data: document, error } = await supabase
      .from<DocumentCreateProps>("documents")
      .insert(DocumentCreateProps);
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
export const createTemplate = async (
  TemplateCreateProps: TemplateCreateProps
) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("documents")
      .insert(TemplateCreateProps);
    if (data) return data;
    if (error) {
      toastError("There was an error creating your template.");
      throw new Error(error.message);
    }
  }
};
export const createMap = async (MapCreateProps: MapCreateProps) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("maps").insert(MapCreateProps);
    if (data) return data;
    if (error) {
      toastError("There was an error creating your map.");
      throw new Error(error.message);
    }
  }
};
export const createMapMarker = async (
  CreateMapMarkerProps: CreateMapMarkerProps
) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("markers")
      .insert(CreateMapMarkerProps);
    if (data) return data;
    if (error) {
      toastError("There was an error creating your map marker.");
      throw new Error(error.message);
    }
  }
};
export const createBoard = async (CreateBoardProps: CreateBoardProps) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from<BoardProps>("boards")
      .insert(CreateBoardProps);
    if (data) return data;
    if (error) {
      toastError("There was an error creating your board.");
      throw new Error(error.message);
    }
  }
};
export const createNode = async (CreateNodeProps: CreateNodeProps) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("nodes")
      .insert(CreateNodeProps);
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
export const updateDocument = async (
  DocumentUpdateProps: DocumentUpdateProps
) => {
  let user = auth.user();

  if (user) {
    const { data: document, error } = await supabase
      .from<DocumentUpdateProps>("documents")
      .update(DocumentUpdateProps)
      .eq("id", DocumentUpdateProps.id);

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
export const updateMap = async (MapUpdateProps: MapUpdateProps) => {
  let user = auth.user();

  if (user) {
    const { data: map, error } = await supabase
      .from("maps")
      .update({
        ...MapUpdateProps,
        map_image: MapUpdateProps.map_image?.id || undefined,
      })
      .eq("id", MapUpdateProps.id);

    if (map) return map[0];
    if (error) {
      toastError("There was an error updating your map.");
      throw new Error(error.message);
    }
  }
};
export const updateMapMarker = async (
  UpdateMapMarkerProps: UpdateMapMarkerProps
) => {
  const { data, error } = await supabase
    .from<MapMarkerProps>("markers")
    .update(UpdateMapMarkerProps)
    .eq("id", UpdateMapMarkerProps.id);

  if (data) return data;
  if (error) {
    toastError("There was an error updating your map marker.");
    throw new Error(error.message);
  }
};
export const updateBoard = async (UpdateBoardProps: UpdateBoardProps) => {
  let user = auth.user();

  if (user) {
    const { data, error } = await supabase
      .from("boards")
      .update(UpdateBoardProps)
      .eq("id", UpdateBoardProps.id);

    if (data) return data;
    if (error) {
      toastError("There was an error updating your board.");
      throw new Error(error.message);
    }
  }
};
export const updateNode = async (UpdateNodeProps: UpdateNodeProps) => {
  let user = auth.user();

  if (user) {
    const { data, error } = await supabase
      .from("nodes")
      .update(UpdateNodeProps)
      .eq("id", UpdateNodeProps.id);

    if (data) return data;
    if (error) {
      toastError("There was an error updating your node.");
      throw new Error(error.message);
    }
  }
};
export const updateEdge = async (UpdateEdgeProps: UpdateEdgeProps) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("edges")
      .update(UpdateEdgeProps)
      .eq("id", UpdateEdgeProps.id);

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
export const updateManyNodesPosition = async (
  nodes: { id: string; x: number; y: number }[]
) => {
  await supabase.rpc("update_many_nodes", {
    payload: nodes,
  });
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
export const deleteManyNodes = async (ids: string[]) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase.rpc("delete_many_nodes", {
      ids,
    });
    if (error) {
      toastError("There was an error deleting your nodes.");
      throw new Error(error.message);
    }
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
export const deleteManyEdges = async (ids: string[]) => {
  let user = auth.user();

  if (user) {
    const { error } = await supabase.rpc("delete_many_edges", {
      ids,
    });
    if (error) {
      toastError("There was an error deleting your edges.");
      throw new Error(error.message);
    }
  }
};

// STORAGE

export const getImages = async (project_id: string) => {
  let user = auth.user();

  if (user) {
    const { data, error } = await supabase
      .from<ImageProps>("images")
      .select("id,title,link,type")
      // Matches links that start with the project_id
      .like("link", `${project_id}%`)
      .order("title", { ascending: true });

    if (data) return data;
    if (error) {
      toastError("There was an error getting your images.");
      throw new Error(error.message);
    }
  }
};
export const uploadImage = async (
  project_id: string,
  file: File,
  type: "Image" | "Map"
) => {
  let user = auth.user();

  if (user) {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`${project_id}/${type}/${file.name}`, file, { upsert: false });

    if (data) {
      const { data: newImage, error: newImageError } = await supabase
        .from<ImageProps>("images")
        .select("id, title, link, type")
        .eq("link", data.Key.replace("images/", ""))
        .maybeSingle();
      if (newImage) {
        return newImage;
      }
      if (newImageError) {
        toastError(
          "There was an error uploading your image. (supabaseUtils 857)"
        );
        throw new Error(newImageError.message);
      }
    }
    if (error) {
      toastError("There was an error uploading your image.");
      throw new Error(error.message);
    }
  }
};
export const downloadImage = async (id: string) => {
  let user = auth.user();
  console.log(id);
  if (user) {
    const { data, error } = await supabase.storage.from("images").download(id);

    if (data) return data;
    if (error) {
      toastError("There was an error downloading your image.");
      throw new Error(error.message);
    }
  }
};
export const deleteImages = async (images: string[]) => {
  const { data, error } = await supabase.storage.from("images").remove(images);
  if (data) return data;
  if (error) {
    toastError("There was an error deleting your images.");
    throw new Error(error.message);
  }
};
export const renameImage = async (id: string, newName: string) => {
  const { data, error } = await supabase
    .from("images")
    .update({ title: newName })
    .eq("id", id);
  if (data) return data;
  if (error) {
    toastError("There was an error renaming your image.");
    throw new Error(error.message);
  }
};

// PUBLIC SELECT

export const getSingleBoard = async (board_id: string) => {
  const { data, error } = await supabase
    .from("boards")
    .select(
      "*, nodes(*, document:documents(id, image(link)), customImage(id, title, link, type)), edges(*)"
    )
    .eq("id", board_id)
    .maybeSingle();
  if (data) return data;
  if (error) {
    toastError("There was an error getting your board.");
    throw new Error(error.message);
  }
};
