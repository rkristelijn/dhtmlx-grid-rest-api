dhtmlxEvent(window, "load", function () {
  // bug 2: after creating, directly go to form ends up in dubugger

  // the applet has a layout, we need to define the layout type, attach it to some element and set the cells
  var layout = new dhtmlXLayoutObject(document.body, "2U");
  layout.cells("a").setText("Contacts");
  layout.cells("b").setText("Contact Details");
  layout.cells("b").setWidth(400);

  // we can add a menu and toolbar, set the path to the icons and load the structure using json
  var menu = layout.attachMenu();
  menu.setIconsPath("icons/");
  menu.loadStruct("public/data/menu.json");

  var toolbar = layout.attachToolbar();
  toolbar.setIconsPath("icons/");
  toolbar.loadStruct("public/data/toolbar.json");

  // attach the grid and the form, but no data loading yet
  var contactsGrid = layout.cells("a").attachGrid();
  contactsGrid.attachHeader("#text_filter,#text_filter,#text_filter");

  contactForm = layout.cells("b").attachForm();
  contactForm.bind(contactsGrid);
  contactForm.loadStruct("public/data/form.json");

  // add the dataProcesser and connect it
  var dpg = new dataProcessor("/connector/contacts/");
  //dpg.enableDebug(true);
  dpg.setUpdateMode('row');
  dpg.init(contactsGrid);
  dpg.setTransactionMode("REST");

  // initialize the data
  contactsGrid.init();
  contactsGrid.load("connector/contacts", "json");

  // after loading no record is selected, so we need to force that
  contactsGrid.attachEvent("onDataReady", function () {
    contactsGrid.selectRowById(contactsGrid.getRowId(0));
    contactForm.setFocusOnFirstActive();
  });

  // attach event, when dhx created id is posted, an mongodb id comes back, this needs to be updated
  dpg.attachEvent("onAfterUpdate", function (sid, action, tid, tag) {
    switch (action) {
      case "inserted":
        contactsGrid.changeRowId(tid, tag._id);
        break;
    }
  });

  // on form blur, save data
  contactForm.attachEvent("onBlur", function (name) {
    dpg.setUpdateMode('off');
    contactForm.save();
    dpg.sendData();
    dpg.setUpdateMode('row');
  });

  // handlers for the menu
  toolbar.attachEvent("onclick", function (id) {
    if (id == "newContact") {
      var rowId = contactsGrid.uid();
      var pos = contactsGrid.getRowsNum();
      // bug #1: no matter what you put here, an empty post is created
      contactsGrid.addRow(rowId, ["", "", ""], pos);
      contactsGrid.selectRowById(rowId);
    };
    if (id == "delContact") {
      var rowId = contactsGrid.getSelectedRowId();
      var rowIndex = contactsGrid.getRowIndex(rowId);
      if (rowId != null) {
        dpg.ignore(() => {
          contactsGrid.deleteRow(rowId);
          fetch('/connector/contacts/' + rowId, {
            method: 'delete'
          }).then(function (response) {
            //
          }).catch(function (err) {
            //
          });

          // highlight the next record, or the previous record when deleting the last line
          if (rowIndex < contactsGrid.getRowsNum()) {
            contactsGrid.selectRow(rowIndex, true);
          } else {
            contactsGrid.selectRow(rowIndex - 1, true)
          }
        });
      }
    }
  });
});
