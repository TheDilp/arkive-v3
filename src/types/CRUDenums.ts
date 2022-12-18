export const baseURLS = {
  baseServer: `http://localhost:${import.meta.env.VITE_BE_PORT}/`,
};
export enum getURLS {
  //  Projects
  getAllProjects = "getallprojects",
  getSingeProject = "getsingleproject",

  // Documents
  getAllDocuments = "getalldocuments/",
  // Maps
  getAllMaps = "getallmaps/",
  // Boards
  getAllBoards = "getallboards/",
  // Images
  getAllImages = "getallimages/",
  getSingleImage = "getimage/images/",
  getAllMapImages = "getallmapimages/",
  getSingleMapImage = "getimage/maps/",
  // Misc
  getAllTags = "alltags/",
  getFullSearch = "fullsearch/",
}

export enum createURLS {
  createProject = "createproject",
  createDocument = "createdocument",
  createMap = "createmap",
  createMapPin = "createmappin",
  createMapLayer = "createmaplayer",
  createBoard = "createboard",
  createNode = "createnode",
  createEdge = "createedge",
  uploadImage = "uploadimage/images/",
  uploadMap = "uploadimage/maps/",
}

export enum updateURLs {
  updateProject = "updateproject/",
  updateDocument = "updatedocument/",
  updateMap = "updatemap/",
  updateMapPin = "updatemappin/",
  updateMapLayer = "updatemaplayer/",
  updateBoard = "updateboard/",
  updateNode = "updatenode/",
  updateEdge = "updateedge/",

  sortDocuments = "sortdocuments",
  sortMaps = "sortmaps",
}

export enum deleteURLs {
  deleteDocument = "deletedocument/",
  deleteMap = "deletemap/",
  deleteMapPin = "deletemappin/",
  deleteMapLayer = "deletemaplayer/",
  deleteNode = "deletenode/",
  deleteEdge = "deleteedge/",
}

export enum MainToSubType {
  map_pins = "maps",
}
