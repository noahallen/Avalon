import React, { useState, useEffect } from "react";

import "./App.css";
import Routing from "./routes/index";
import { GameProvider } from "./components/GameProvider";

// Defining the App component
function App() {
  return (
    // Wrapping the entire app inside GameProvider so that all components have access to the game state
    <GameProvider test-id="game-context">
      <div className="App">
        <header className="App-header"></header>
        <Routing />
      </div>
    </GameProvider>
  );
}

export default App;
