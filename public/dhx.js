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
  //contactsGrid.attachHeader("#text_filter,#text_filter,#text_filter");

  //contactsGrid.enableEditEvents(true,false,true);
  contactsGrid.init();
  //contactsGrid.post("data.php?id=1","data=10",null,"json");
  contactsGrid.load("public/data/grid.json", "json");
  // contactsGrid.setEditable(true);

  contactForm = layout.cells("b").attachForm();
  contactForm.loadStruct("public/data/form.xml");
  contactForm.bind(contactsGrid);

  var dpg = new dataProcessor("/connector/contacts/");         //inits dataProcessor
  dpg.enableDebug(true);
  dpg.init(contactsGrid);   //associates the dataProcessor instance with the grid
  dpg.setTransactionMode("REST");

  dpg.attachEvent("onAfterUpdate", function (sid, action, tid, tag) {
    if (action == "inserted") {
      //console.log('inserted');
      //contactsGrid.selectRowById(tid);        //selects the newly-created row
      //contactForm.setFocusOnFirstActive();//set focus to the 1st form's input
    } else {
      //console.log('other action:', sid, action, tid, tag);
      //contactForm.setFormData(tag);
      return false;
    }
  });


  contactForm.attachEvent("onButtonClick", function (name) {
    contactForm.save();     //sends the values of the updated row to the server
    console.log('saving...');
    return false;
  });
  // contactForm.attachEvent("onblur", function () {
  //   contactForm.save();
  // })

  toolbar.attachEvent("onclick", function (id) {
    if (id == "newContact") {
      console.log('newContact');
      var rowId = contactsGrid.uid();
      var pos = contactsGrid.getRowsNum();
      contactsGrid.addRow(rowId, ["New contact", "", ""], pos);
      contactsGrid.selectRowById(rowId);
      contactForm.setFocusOnFirstActive();
    };
    if (id == "delContact") {
      console.log('delContact');
      var rowId = contactsGrid.getSelectedRowId();
      var rowIndex = contactsGrid.getRowIndex(rowId);
      if (rowId != null) {
        contactsGrid.deleteRow(rowId);
        if (rowIndex != (contactsGrid.getRowsNum() - 1)) {
          contactsGrid.selectRow(rowIndex + 1, true);
        } else {
          contactsGrid.selectRow(rowIndex - 1, true)
        }
      }
    }
  });
});
