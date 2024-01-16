//example stuff we don't need to use all the folders for their intended purposes
// res.send stuff can go in routes folder 
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Express listening on port 3000!'));


app.get('*', (req, res) => {
    res.send('404! This is an invalid URL.');
  });