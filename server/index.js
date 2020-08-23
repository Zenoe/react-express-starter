const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const util = require('./util');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.listen(3003, () =>
  console.log('Express server is running on localhost:3003')
);

app.get('/api/getimage/:name',(req, res) => {
  // console.log('param:', req.params.name);
  const ps = util.createStreamFromImage(res, `${__dirname}/asset/${req.params.name}`)
  ps.pipe(res)
})
