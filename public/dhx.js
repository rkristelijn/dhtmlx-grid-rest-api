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
  // contactsGrid.setHeader("Name,Last Name,Email");   //sets the headers of columns
  // contactsGrid.setColumnIds("fname,lname,email");         //sets the columns' ids
  // contactsGrid.setInitWidths("250,250,*");   //sets the initial widths of columns
  // contactsGrid.setColAlign("left,left,left");     //sets the alignment of columns
  // contactsGrid.setColTypes("ro,ro,ro");               //sets the types of columns
  // contactsGrid.setColSorting("str,str,str");  //sets the sorting types of columns
  contactsGrid.init();
  contactsGrid.load("public/data/grid.json", "json");
});
