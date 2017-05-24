// const livereload = require('express-livereload')
const express = require('express')
const app = express()
// livereload(app, config={})

app.get('/', function (req, res) {
  res.send('Hello World 2!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
