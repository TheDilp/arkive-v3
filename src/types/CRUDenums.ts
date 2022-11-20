export enum baseURLS {
  baseServer = "http://localhost:5174/",
}
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
  // Misc
  getAllTags = "alltags/",
}

export enum createURLS {
  createProject = "createproject",
  createDocument = "createdocument",
  createMap = "createmap",
  uploadImage = "uploadimage/images/",
  uploadMap = "uploadimage/maps/",
}

export enum updateURLs {
  updateProject = "updateproject/",
  updateDocument = "updatedocument/",

  sortDocuments = "sortdocuments",
  sortMaps = "sortmaps",
}

export enum deleteURLs {
  deleteDocument = "deletedocument/",
}
