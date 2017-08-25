'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Listening on port " + process.env.PORT);
});
