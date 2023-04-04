const express = require('express')
const app = express()
const port = 6000
//import the tracker;
const {trackTransactions} = require('./Controllers/Tracker.js')
trackTransactions();
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
