import React from "react";
import PropTypes from "prop-types";

export const GameContext = React.createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = React.useState({
    //The numPlayers is how many players are in a game
    numPlayers: 0,

    //Here the players object should contain:
    // 1. The player's displayName
    // 2. The player's userName
    // 3. The player's index relative to the admin (with admin being 0)
    // 4. The player's role in the game
    players: {},
  });

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};
