var express = require('express')
  , bodyParser = require('body-parser');
const app = express();
const port = 3002;

const notes = [{title:"Note 1", content:"Content of note 1"},
{title:"Note 2", content:"Content of note 2"},
{title:"Note 2", content:"Content of note 2"}]

app.listen(port, () => console.log(`listening on port ${port}!`));
app.use(bodyParser.json());

app.use(express.static('app'));
app.use(express.static('app/images'));

app.get('/notes', function (req, res) {
  res.json(notes);
})

app.post('/notes', function (req, res) {
  notes.push(req.body);
  res.sendStatus(200);
})

