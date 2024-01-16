//example stuff we don't need to use all the folders for their intended purposes
// res.send stuff can go in routes folder 
const express = require('express');
const app = express();
const CORS = require('cors');

app.use(CORS());  

app.listen(5000, () => console.log('Express listening on port 5000!'));


app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});