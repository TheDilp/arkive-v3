export const baseURLS = {
  baseServer : `http://localhost:${import.meta.env.VITE_BE_PORT}/`
};
export enum getURLS {
  //  Projects
  getAllProjects = "getallprojects",
  getSingeProject = "getsingleproject",

  // Documents
  getAllDocuments = "getalldocuments/",
  // Maps
  getAllMaps = "getallmaps/",
  // Images
  getAllImages = "getallimages/",
  getAllMapImages = "getallmapimages/",
  getSingleMapImage = "getimage/maps/",
  // Misc
  getAllTags = "alltags/",
}

export enum createURLS {
  createProject = "createproject",
  createDocument = "createdocument",
  createMap = "createmap",
  createMapPin = "createmappin",
  uploadImage = "uploadimage/images/",
  uploadMap = "uploadimage/maps/",
}

export enum updateURLs {
  updateProject = "updateproject/",
  updateDocument = "updatedocument/",
  updateMap = "updatemap/",

  sortDocuments = "sortdocuments",
  sortMaps = "sortmaps",
}

export enum deleteURLs {
  deleteDocument = "deletedocument/",
}

export enum MainToSubType {
  map_pins = "maps",
}
