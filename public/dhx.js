dhtmlxEvent(window, "load", function () {
  // the applet has a layout, we need to define the layout type, attach it to some element and set the cells
  var layout = new dhtmlXLayoutObject(document.body, "2U");
  layout.cells("a").setText("Contacts");
  layout.cells("b").setText("Contact Details");
  layout.cells("b").setWidth(400);

  // now we can add a menu, set the path to the icons and load the structure using json
  var menu = layout.attachMenu();
  menu.setIconsPath("icons/");
  menu.loadStruct("public/data/menu.json");

  var toolbar = layout.attachToolbar();
  toolbar.setIconsPath("icons/");
  toolbar.loadStruct("public/data/toolbar.json");

  var contactsGrid = layout.cells("a").attachGrid();
  contactsGrid.attachHeader("#text_filter,#text_filter,#text_filter");

  contactForm = layout.cells("b").attachForm();
  contactForm.bind(contactsGrid);
  contactForm.loadStruct("public/data/form.json");

  var dpg = new dataProcessor("/connector/contacts/");
  dpg.enableDebug(true);
  dpg.setUpdateMode('row');
  dpg.init(contactsGrid);
  dpg.setTransactionMode("REST");

  contactsGrid.init();
  contactsGrid.load("connector/contacts", "json");

  contactsGrid.attachEvent("onDataReady", function () {
    contactsGrid.selectRowById(contactsGrid.getRowId(0));
    contactForm.setFocusOnFirstActive();
  });

  dpg.attachEvent("onBeforeUpdate", function (id, state, data) {
    dpg.setUpdated(id, false);
    return true;
  });
  dpg.attachEvent("onAfterUpdate", function (sid, action, tid, tag) {
    console.log("TAG:", sid, action, tid, tag);
    switch (action) {
      case "inserted":
        contactsGrid.selectRowById(tid);
        contactForm.setFocusOnFirstActive();
        break;
      case "updated":
        contactsGrid.changeRowId(tid, tag._id);
        break;
    }
  });

  contactForm.attachEvent("onBlur", function (name) {
    dpg.setUpdateMode('off');
    contactForm.save();
    dpg.sendData();
    dpg.setUpdateMode('row');
  });

  toolbar.attachEvent("onclick", function (id) {
    if (id == "newContact") {
      var rowId = contactsGrid.uid();
      var pos = contactsGrid.getRowsNum();
      contactsGrid.addRow(rowId, ["New contact", "", ""], pos);
      contactsGrid.selectRowById(rowId);
      contactForm.setFocusOnFirstActive();
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
          if (rowIndex != (contactsGrid.getRowsNum() - 1)) {
            contactsGrid.selectRow(rowIndex + 1, true);
          } else {
            contactsGrid.selectRow(rowIndex - 1, true)
          }
        });
      }
    }
  });
});
