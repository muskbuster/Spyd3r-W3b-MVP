const express = require('express')
const app = express()
const port = 7000
const { messenger } =require('./Controllers/MailController.js');
const {config} = require('./DB_config/config.js');

messenger();
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
