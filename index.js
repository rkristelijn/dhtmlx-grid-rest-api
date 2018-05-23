const express = require('express');
const logger = require('express-log');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cms');
mongoose.set('debug', true);
let db = mongoose.connection;

let Schema = mongoose.model('contacts', mongoose.Schema({
  fname: 'string', lname: 'string', email: 'string'
}));

db.on('error', console.error.bind(console, 'Mongoose:'));
db.once('open', () => {
  console.log('Connected to mongoose');
});

app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/codebase', express.static(path.join(__dirname, 'codebase')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/icons', express.static(path.join(__dirname, 'codebase/icons')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.route('/connector/contacts')
  .post((req, res) => {
    Schema.create(req.body, (err, contact) => {
      res.json(contact);
    });
  })
  .get((req, res) => {
    Schema.find({}, (err, contacts) => {
      if (!err) {
        res.json(initGrid(contacts));
      }
    });
  });

app.route('/connector/contacts/:id')
  .put((req, res) => {
    let data = req.body;
    delete data.gr_id;
    delete data.head;

    Schema.findById(req.params.id, (err, contact) => {
      if (contact) {
        contact.fname = data.fname;
        contact.lname = data.lname;
        contact.email = data.email;
        contact.save();
        res.json(contact);
      }
    });
  })
  .delete((req, res) => {
    Schema.findById(req.params.id, (err, contact) => {
      if (contact) {
        contact.remove();
        res.sendStatus(204);
      }
    });
  });

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
    }],
    rows: []
  };
  for (row of data) {
    let values = [row.fname, row.lname, row.email];
    payload.rows.push({ id: row._id, data: values });
  }
  return payload;
}

app.listen(3000, () => {
  console.log('listening on *:3000');
});
