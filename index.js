const express = require('express');
const app = express();
const path = require('path');

app.use('/codebase', express.static(path.join(__dirname, 'codebase')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/icons', express.static(path.join(__dirname, 'codebase/icons')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
  console.log('listening on *:3000');
});
