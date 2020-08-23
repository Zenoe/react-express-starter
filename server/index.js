const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const fs = require('fs')
const stream = require('stream')

function createStreamFromImage(res, filename){
  const r = fs.createReadStream(`${__dirname}/asset/${filename}`)
  const ps = new stream.PassThrough()
  stream.pipeline(
   r,
   ps,
   (err)=> {
    if (err) {
      console.log(err)
      return res.sendStatus(400);
    }
  })
  return ps;
}
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
  const ps = createStreamFromImage(res, req.params.name)
  ps.pipe(res)
})
