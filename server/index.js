//example stuff we don't need to use all the folders for their intended purposes
// res.send stuff can go in routes folder 
require('dotenv').config()

var firebase = require("firebase/app");
var firebaseData = require('firebase/database');
const express = require('express');
const app = express();
const CORS = require('cors');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
};

// const fireApp = firebase.initializeApp(firebaseConfig);
// const database = firebaseData.getDatabase(fireApp);


// function writeUserData(userId, name) {
//   firebaseData.set(firebaseData.ref(database, 'users/' + userId), {
//     username: name,
//   });
// }


app.use(CORS());  

app.listen(5000, () => console.log('Express listening on port 5000!'));


app.get("/", (req, res) => {
  res.json({ message: "Hello world "});
  // writeUserData("1","Admin");
});