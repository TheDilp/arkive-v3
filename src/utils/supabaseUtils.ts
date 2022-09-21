import { createClient } from "@supabase/supabase-js";
import { saveAs } from "file-saver";

import {
  DocumentCreateProps,
  DocumentProps,
  DocumentUpdateProps,
  ImageProps,
  ProfileProps,
  ProjectProps,
  SortIndexes,
  TemplateCreateProps,
} from "../custom-types";
import {
  BoardEdgeProps,
  BoardNodeProps,
  BoardProps,
  CreateBoardProps,
  CreateNodeProps,
  UpdateBoardProps,
  UpdateEdgeProps,
  UpdateNodeProps,
} from "../types/BoardTypes";
import {
  CreateMapLayerProps,
  CreateMapMarkerProps,
  CreateMapProps,
  MapMarkerProps,
  MapProps,
  MapUpdateProps as UpdateMapProps,
  UpdateMapLayerProps,
  UpdateMapMarkerProps,
} from "../types/MapTypes";
import { toastError } from "./utils";

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabase = createClient(
  supabaseUrl as string,
  supabaseKey as string
);

export const auth = supabase.auth;

// Auth functions

export const login = async (provider: "google" | "discord") => {
  const { user, error } = await supabase.auth.signIn({ provider });

  if (user) {
    return user;
  }
  if (error) {
    toastError("There was an error signing you up/in.");
    return null;
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
      .order("sort", { ascending: true });
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
      "id, title, parent(id, title), folder, expanded, project_id, public, sort, markers:markers!map_id(*), map_image:images!maps_map_image_fkey(id, title, link), map_layers(*, image(id, title, link, type))"
    )
    .eq("project_id", project_id)
    .order("sort", { ascending: true });
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
      "*, parent(id, title), nodes!nodes_board_id_fkey(*, document:documents(id, image(link)), customImage(id, title, link, type)), edges(*)"
    )
    .eq("project_id", project_id)
    .order("sort", { ascending: true });
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
export const createMap = async (CreateMapProps: CreateMapProps) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.from("maps").insert(CreateMapProps);
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
      .insert({ ...CreateMapMarkerProps, user_id: user.id });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your map marker.");
      throw new Error(error.message);
    }
  }
};
export const createMapLayer = async (
  MapLayerCreateProps: CreateMapLayerProps
) => {
  let user = auth.user();
  if (user) {
    const { data: layer, error } = await supabase
      .from("map_layers")
      .insert({ ...MapLayerCreateProps, user_id: user.id });

    if (layer) return layer;
    if (error) {
      toastError("There was an error creating your map layer.");
      throw new Error(error.message);
    }
  }
};
export const createBoard = async (CreateBoardProps: CreateBoardProps) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase
      .from("boards")
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
    const { data, error } = await supabase.from("nodes").insert({
      ...CreateNodeProps,
      user_id: user.id,
      customImage: CreateNodeProps.customImage?.id,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your node.");
      throw new Error(error.message);
    }
  }
};
export const createManyNodes = async (CreateNodeProps: CreateNodeProps[]) => {
  let user = auth.user();
  if (user) {
    let newNodes = CreateNodeProps.map((node) => ({
      ...node,
      // @ts-ignore
      user_id: user.id,
      customImage: node.customImage?.id,
    }));
    const { data, error } = await supabase.from("nodes").insert(newNodes);
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
      user_id: user.id,
    });
    if (data) return data;
    if (error) {
      toastError("There was an error creating your edge.");
      throw new Error(error.message);
    }
  }
};
export const createManyEdges = async (
  CreateEdgeProps: Omit<BoardEdgeProps, "label">[]
) => {
  let user = auth.user();
  if (user) {
    const newEdges = CreateEdgeProps.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      board_id: edge.board_id,
      curveStyle: edge.curveStyle,
      lineStyle: edge.lineStyle,
      lineColor: edge.lineColor,
      // @ts-ignore
      user_id: user.id,
    }));
    const { data, error } = await supabase.from("edges").insert(newEdges);
    if (data) return data;
    if (error) {
      toastError("There was an error creating your edge.");
      throw new Error(error.message);
    }
  }
};

// UPDATE
export const sortDocumentsChildren = async (indexes: SortIndexes) => {
  const { data, error } = await supabase.rpc("sort_documents_children", {
    payload: indexes,
  });
  if (data) return data;
  if (error) {
    toastError("There was an error sorting your documents.");
    throw new Error(error.message);
  }
};
export const sortMapsChildren = async (indexes: SortIndexes) => {
  await supabase.rpc("sort_maps_children", {
    payload: indexes,
  });
};
export const sortBoardsChildren = async (indexes: SortIndexes) => {
  await supabase.rpc("sort_boards_children", {
    payload: indexes,
  });
};
export const sortTimelinesChildren = async (indexes: SortIndexes) => {
  await supabase.rpc("sort_timelines_children", {
    payload: indexes,
  });
};

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
export const updateMap = async (UpdateMapProps: UpdateMapProps) => {
  let user = auth.user();

  if (user) {
    const { data: map, error } = await supabase
      .from("maps")
      .update({
        ...UpdateMapProps,
        map_image: UpdateMapProps.map_image?.id || undefined,
      })
      .eq("id", UpdateMapProps.id);

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
export const updateMapLayer = async (
  UpdateMapLayerProps: UpdateMapLayerProps
) => {
  const user = auth.user();
  if (user) {
    const { data: layer, error } = await supabase
      .from("map_layers")
      .update({
        ...UpdateMapLayerProps,
        image: UpdateMapLayerProps.image?.id || undefined,
      })
      .eq("id", UpdateMapLayerProps.id);

    if (layer) return layer;
    if (error) {
      toastError("There was an error updating your map layer.");
      throw new Error(error.message);
    }
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
  payload: { id: string; x: number; y: number }[]
) => {
  await supabase.rpc("update_many_nodes_position", {
    payload,
  });
};
export const updateManyNodesData = async (payload: BoardNodeProps[]) => {
  await supabase.rpc("update_many_nodes_data", { payload });
};
export const updateManyNodesLockState = async (
  nodes: { id: string; locked: boolean }[]
) => {
  await supabase.rpc("update_many_nodes_lockstate", {
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
export const deleteMapLayer = async (id: string) => {
  const { data: layer, error } = await supabase
    .from("map_layers")
    .delete()
    .eq("id", id);
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
    try {
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
    } catch (error) {}
  }
};
export const downloadImage = async (id: string) => {
  let user = auth.user();
  if (user) {
    const { data, error } = await supabase.storage
      .from("images")
      .download("/4dd68867-859b-4249-9e30-4eb2cf2662d5/Image/0WmkOVD.jpg");

    if (data) return data;
    if (error) {
      toastError("There was an error downloading your image.");
      throw new Error(error.message);
    }
  }
};
export const deleteImagesStorage = async (images: string[]) => {
  const { data, error } = await supabase.storage.from("images").remove(images);
  if (data) return data;
  if (error) {
    toastError("There was an error deleting your images.");
    throw new Error(error.message);
  }
};
export const deleteImageRecords = async (ids: string[]) => {
  let user = auth.user();
  if (user) {
    const { error } = await supabase.rpc("delete_many_images", {
      ids,
    });
    if (error) {
      toastError("There was an error deleting your images.");
    }
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

// MISC

export const exportProject = async (project_id: string) => {
  const user = auth.user();
  if (user) {
    const { data: documents } = await supabase
      .from("documents")
      .select("*")
      .eq("project_id", project_id);
    saveAs(
      new Blob([JSON.stringify(documents)], {
        type: "text/plain;charset=utf-8",
      }),
      "DOCUMENTS.json"
    );

    const { data: maps } = await supabase
      .from("maps")
      .select("*, markers(*), map_layers(*)")
      .eq("project_id", project_id);
    saveAs(
      new Blob([JSON.stringify(maps)], {
        type: "text/plain;charset=utf-8",
      }),
      "MAPS.json"
    );

    const { data: boards, error } = await supabase
      .from<BoardProps>("boards")
      .select(
        "*, parent(id, title), nodes!nodes_board_id_fkey(*, document:documents(id, image(link)), customImage(id, title, link, type)), edges(*)"
      )
      .eq("project_id", project_id);
    console.log(boards);
    saveAs(
      new Blob([JSON.stringify(boards)], {
        type: "text/plain;charset=utf-8",
      }),
      "BOARDS.json"
    );
  }
};

// PUBLIC SELECT

export const getSingleBoard = async (board_id: string) => {
  const { data, error } = await supabase
    .from<BoardProps>("boards")
    .select(
      "*, parent(id, title), nodes!nodes_board_id_fkey(*, document:documents(id, image(link)), customImage(id, title, link, type)), edges(*)"
    )
    .eq("id", board_id)
    .maybeSingle();
  if (data) return data;
  if (error) {
    toastError("There was an error getting your board.");
    throw new Error(error.message);
  }
};
export const getSingleDocument = async (document_id: string) => {
  const { data, error } = await supabase
    .from<DocumentProps>("documents")
    .select("*, image(id, title, link)")
    .eq("id", document_id)
    .maybeSingle();
  if (data) return data;
  if (error) {
    toastError("There was an error getting your document.");
    throw new Error(error.message);
  }
};
export const getPublicDocuments = async (project_id: string) => {
  const { data, error } = await supabase
    .from<DocumentProps>("documents")
    .select("id, title, icon, alter_names, public")
    .eq("public", true)
    .eq("project_id", project_id);
  if (data) return data;
  if (error) {
    toastError("There was an error getting your documents.");
    throw new Error(error.message);
  }
};
export const getSingleMap = async (map_id: string) => {
  const { data, error } = await supabase
    .from<MapProps>("maps")
    .select(
      "id, title, parent(id, title), folder, expanded, project_id, public, sort, markers:markers!map_id(*), map_image:images!maps_map_image_fkey(id, title, link), map_layers(*, image(id, title, link, type))"
    )
    .eq("id", map_id)
    .maybeSingle();
  if (data) return data;
  if (error) {
    toastError("There was an error getting your map.");
    throw new Error(error.message);
  }
};
