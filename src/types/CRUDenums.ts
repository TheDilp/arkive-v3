export enum baseURLS {
  baseServer = "http://localhost:5174/",
}
export enum getURLS {
  //  Projects
  getAllProjects = "getallprojects",
  getSingeProject = "getsingleproject",

  // Documents
  getAllDocuments = "getalldocuments/",

  // Misc
  getAllTags = "alltags/",
}

export enum createURLS {
  createProject = "createproject",
  createDocument = "createdocument",
}

export enum updateURLs {
  updateProject = "updateproject/",
  updateDocument = "updatedocument/",

  sortDocuments = "sortdocuments",
}

export enum deleteURLs {
  deleteDocument = "deletedocument/",
}
