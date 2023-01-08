export const baseURLS = {
  baseServer: `http://localhost:${import.meta.env.VITE_BE_PORT}/`,
};
export const getURLS = {
  //  Projects
  getAllProjects: "getallprojects",
  getSingeProject: "getsingleproject",

  // Documents
  getAllDocuments: "getalldocuments/",
  getSingleDocument: "getsingledocument/",
  // Maps
  getAllMaps: "getallmaps/",
  getSingleMap: "getsinglemap/",
  // Boards
  getAllBoards: "getallboards/",
  getSingleBoard: "getsingleboard/",
  // Images
  getAllImages: "getallimages/",
  getSingleImage: "getimage/images/",
  getAllMapImages: "getallmapimages/",
  getSingleMapImage: "getimage/maps/",
  // Misc
  getAllTags: "alltags/",
  getAllSettingsTags: "alltags/settings/",
  getSearchTags: "searchtags/",
  getFullSearch: "fullsearch/",
};

export const createURLS = {
  createProject: "createproject",
  createDocument: "createdocument",
  createMap: "createmap",
  createMapPin: "createmappin",
  createMapLayer: "createmaplayer",
  createBoard: "createboard",
  createNode: "createnode",
  createEdge: "createedge",
  createTag: "createtag",
  uploadImage: "uploadimage/images/",
  uploadMap: "uploadimage/maps/",
};

export const updateURLs = {
  updateProject: "updateproject/",
  updateDocument: "updatedocument/",
  updateMap: "updatemap/",
  updateMapPin: "updatemappin/",
  updateMapLayer: "updatemaplayer/",
  updateBoard: "updateboard/",
  updateNode: "updatenode/",
  updateEdge: "updateedge/",
  updateTag: "updatetag/",

  sortDocuments: "sortdocuments",
  sortMaps: "sortmaps",
};

export const deleteURLs = {
  deleteDocument: "deletedocument/",
  deleteMap: "deletemap/",
  deleteMapPin: "deletemappin/",
  deleteMapLayer: "deletemaplayer/",
  deleteBoard: "deleteboard/",
  deleteNode: "deletenode/",
  deleteEdge: "deleteedge/",
  deleteTags: "deletetags",
};

export const MainToSubType = {
  map_pins: "maps",
};
