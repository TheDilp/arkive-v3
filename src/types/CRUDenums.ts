export const baseURLS = {
  baseServer: `${import.meta.env.VITE_BASE_SERVER}/`,
  baseImageHost: `${import.meta.env.VITE_S3_CDN_HOST}/`,
};
export const getURLS = {
  //  Projects
  getSingleProject: "getsingleproject",

  // Documents
  getSingleDocument: "getsingledocument",
  getManyDocuments: "getmanydocuments",
  // Maps
  getSingleMap: "getsinglemap",
  // Boards
  getSingleBoard: "getsingleboard",
  // Screens
  getSingleScreen: "getsinglescreen",
  // Dictionaries
  getSingleDictionary: "getsingledictionary",
  // Calendars
  getSingleCalendar: "getsinglecalendar",
  // Calendars
  getSingleTimeline: "getsingletimeline",
  // RandomTables
  getSingleRandomTable: "getsinglerandomtable",
  // Images
  getAllImages: "getallimages/",
  getSingleImage: "getimage/images/",
  getAllMapImages: "getallmapimages/",
  getSingleMapImage: "getimage/maps/",
  getAllSettingsImages: "getallsettingsimages/",
  // Misc
  getAllTags: "alltags/",
  getAllSettingsTags: "alltags/settings/",
  getAllAlterNames: "allalternames/settings/",
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
  createScreen: "createscreen",
  createSection: "createsection",
  createCard: "createcard",
  createDictionary: "createdictionary",
  createWord: "createword",
  createCalendar: "createcalendar",
  createTimeline: "createtimeline",
  createMonth: "createmonth",
  createEra: "createera",
  createEvent: "createevent",
  createRandomTable: "createrandomtable",
  createRandomTableOption: "createrandomtableoption",
  createTag: "createtag",
  createAlterName: "createaltername",
  createSwatch: "createswatch",
  uploadImage: "uploadimage/images/",
  uploadMap: "uploadimage/maps/",
  createUser: "createuser",
};

export const updateURLs = {
  updateProject: "updateproject",
  updateDocument: "updatedocument",
  updateMap: "updatemap",
  updateMapPin: "updatemappin",
  updateMapLayer: "updatemaplayer",
  updateBoard: "updateboard",
  updateNode: "updatenode",
  updateEdge: "updateedge",
  updateScreen: "updatescreen",
  updateSection: "updatesection",
  updateCard: "updatecard",
  updateDictionary: "updatedictionary",
  updateWord: "updateword",
  updateCalendar: "updatecalendar",
  updateTimeline: "updatetimeline",
  updateEra: "updateera",
  updateMonth: "updatemonth",
  updateEvent: "updateevent",
  updateRandomTable: "updaterandomtable",
  updateRandomTableOption: "updaterandomtableoption",
  updateSwatch: "updateswatch",
  updateTag: "updatetag",
  updateAlterName: "updatealtername",

  sortDocuments: "sortdocuments",
  sortMaps: "sortmaps",
  sortBoards: "sortboards",
  sortScreens: "sortscreens",
  sortSections: "sortsections",
  sortCards: "sortcards",
  sortMonths: "sortmonths",
};

export const deleteURLs = {
  deleteDocument: "deletedocument",
  deleteMap: "deletemap",
  deleteMapPin: "deletemappin",
  deleteMapLayer: "deletemaplayer",
  deleteBoard: "deleteboard",
  deleteNode: "deletenode",
  deleteEdge: "deleteedge",
  deleteScreen: "deletescreen",
  deleteSection: "deletesection",
  deleteDictionary: "deletedictionary",
  deleteWord: "deleteword",
  deleteCard: "deletecard",
  deleteCalendar: "deletecalendar",
  deleteTimeline: "deletetimeline",
  deleteEra: "deleteera",
  deleteEvent: "deleteevent",
  deleteRandomTable: "deleterandomtable",
  deleteRandomTableOption: "deleterandomtableoption",
  deleteTags: "deletetags",
  deleteAlterName: "deletealtername",
  deleteAlterNames: "deletealternames",
  deleteImage: "deleteimage",
};

export const MainToSubType = {
  map_pins: "maps",
};
