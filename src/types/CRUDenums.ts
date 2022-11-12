export enum baseURLS {
  baseServer = "http://localhost:8080/",
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
}

export enum deleteURLs {
  deleteDocument = "deletedocument/",
}
