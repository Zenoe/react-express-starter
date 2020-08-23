const fs = require('fs')
const stream = require('stream')

module.exports = {
  createStreamFromImage :(res, filename) =>{
    const r = fs.createReadStream(filename)
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
}
