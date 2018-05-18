dhtmlxEvent(window, "load", function () {
  var layout = new dhtmlXLayoutObject(document.body, "2U");
  layout.cells("a").setText("Contacts");
  layout.cells("b").setText("Contact Details");
  layout.cells("b").setWidth(400);

  var menu = layout.attachMenu();
  menu.setIconsPath("icons/");
  menu.loadStruct("public/data/menu.xml");

  var toolbar = layout.attachToolbar();
  toolbar.setIconsPath("icons/");
  toolbar.loadStruct("public/data/toolbar.xml");

  var contactsGrid = layout.cells("a").attachGrid();
  contactsGrid.attachHeader("#text_filter,#text_filter,#text_filter");

  contactsGrid.init();
  contactsGrid.load("connector/contacts", "json");

  contactForm = layout.cells("b").attachForm();
  contactForm.loadStruct("public/data/form.xml");
  contactForm.bind(contactsGrid);

  var dpg = new dataProcessor("/connector/contacts/");
  dpg.enableDebug(true);
  dpg.setUpdateMode('row');
  dpg.init(contactsGrid);
  dpg.setTransactionMode("REST");

  dpg.attachEvent("onBeforeUpdate", function (id, state, data) {
    dpg.setUpdated(id, false);
    return true;
  });
  dpg.attachEvent("onAfterUpdate", function (sid, action, tid, tag) {
    if (action == "inserted") {
      contactsGrid.selectRowById(tid);
      contactForm.setFocusOnFirstActive();
    }
  });


  contactForm.attachEvent("onButtonClick", function (name) {
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
