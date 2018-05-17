const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cms');
let db = mongoose.connection;

let Schema = mongoose.model('contacts', mongoose.Schema({
  fname: 'string', lname: 'string', email: 'string'
}));

db.on('error', console.error.bind(console, 'Mongoose:'));
db.once('open', () => {
  console.log('Connected to mongoose');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/codebase', express.static(path.join(__dirname, 'codebase')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/icons', express.static(path.join(__dirname, 'codebase/icons')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.route('/connector/contacts')
  .get((req, res) => {
    console.log('get');
    Schema.find({}, (err, contacts) => {
      if (err) {
        console.log(err);
      } else {
        res.json(initGrid(contacts));
        //res.json(contacts);
      }
    });
  })
  .post((req, res) => {
    console.log('post');
  });

app.route('/connector/contacts/:id')
  .get((req, res) => {
    console.log('get:', req.params.id);
  })
  .put((req, res) => {
    let data = req.body;
    delete data.gr_id;
    delete data.head;
    console.log('put:', req.params.id, data);

    Schema.findById(req.params.id, (err, contact) => {
      if (err) {
        console.log(err);
      }
      if (contact) {
        contact.fname = data.fname;
        contact.lname = data.lname;
        contact.email = data.email;
        contact.save();
        res.json(contact);
      } else {
        let newContact = new Schema(data);
        console.log(newContact);
        newContact.save((err, contact) => {
          if (err) {
            console.log(err);
          } else {
            console.log('created:', contact);
            res.json(contact);
          }
        });
      }
    });

    // Schema.find({}, (err, contact) => {
    //   if (!contact) {
    //     console.log('put:creating...', req.body);
    //     let newContact = new Schema(req.body);
    //     newContact.save((err, contact) => {
    //       res.send(contact);
    //     });
    //   } else {
    //     res.send(contact);
    //   }
    // });
  })
  .delete((req, res) => {
    console.log('delete', req.params.id);
  });
// app.get('/connector/contacts', (req, res) => {
//   let Schema = mongoose.model('contacts', mongoose.Schema({}));
//   let contacts = Schema.find({});
//   res.sendStatus(200).end(contacts);
// });
// app.put('/connector/:id', (req, res) => {
//   console.log(req.data);
//   // let Schema = mongoose.model('contacts', mongoose.Schema({}));
//   // let id = req.data.id;
//   // let action = req.data.action;
//   // let data = req.body.data;
//   // delete data.head;

//   // Schema.find((dbFindErr, document) => {
//   //   if(document) {
//   //     document.save(data);
//   //     res.sendStatus(200);
//   //     res.end(document);
//   //   } else {
//   //     let newDocument = new Schema(data);
//   //     newDocument.save();
//   //     res.sendStatus(200);
//   //     res.end(newDocument);
//   //   }
//   // });
// });

function initGrid(data) {
  let payload = {
    head: [{
      id: 'fname',
      width: 150,
      align: 'left',
      type: 'ed',
      sort: 'str',
      value: 'First'
    }, {
      id: 'lname',
      width: 150,
      align: 'left',
      type: 'ed',
      sort: 'str',
      value: 'Last'
    }, {
      id: 'email',
      width: '*',
      align: 'left',
      type: 'ed',
      sort: 'str',
      value: 'Email'
    }
    ],
    rows: []
  };
  for (row of data) {
    console.log('adding', row);
    let values = [row.fname, row.lname, row.email];
    payload.rows.push({ id: row._id, data: values });
  }
  return payload;
}

app.listen(3000, () => {
  console.log('listening on *:3000');
});
