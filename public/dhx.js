dhtmlxEvent(window, "load", function () {
  var layout = new dhtmlXLayoutObject(document.body, "2U");
  layout.cells("a").setText("Contacts");
  layout.cells("b").setText("Contact Details");
  layout.cells("b").setWidth(500);

  var menu = layout.attachMenu();
  menu.setIconsPath("icons/");
  menu.loadStruct("public/data/menu.xml");

  var toolbar = layout.attachToolbar();
  toolbar.setIconsPath("icons/");
  toolbar.loadStruct("public/data/toolbar.xml");

  var contactsGrid = layout.cells("a").attachGrid();
  contactsGrid.attachHeader("#text_filter,#text_filter,#text_filter");

  contactsGrid.init();
  contactsGrid.load("public/data/grid.json", "json");
});
