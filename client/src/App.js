import React from "react"
import './App.css';
import Routing from "./routes/index";

function App() {

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:5000/")
        .then(res => res.json())
        .then(resData => {
          setData(resData);
        })
        .catch(err => console.log(err));
  }, []); 

  return (
    <div className="App">
      <header className="App-header">
        {!data ? "Not Loaded" : data.message}
      </header>
      <Routing />
    </div>
  );
}

export default App;
