import { useState, useEffect } from "react";
import "./App.css";

const symbols = ["♥️", "♦️", "♣️", "♠️"];
const cards = ["7", "8", "9", "10", "J", "Q", "K", "1"];

const initialState = {
  deck: [],
  userDeck: [],
  userScore: {},
  botDeck: [],
  botScore: {},
  winner: false,
};

const App = () => {
  const [state, setState] = useState(initialState);

  const ShuffleDeck = () => {
    if (state.deck.length === 32 || state.deck.length !== 0) {
      return;
    }

    for (let card of cards) {
      for (let symbol of symbols) {
        setState((state) => ({
          ...state,
          deck: [...state.deck, card + symbol],
        }));
      }
    }
    setState((state) => ({
      ...state,
      deck: state.deck.sort(() => Math.random() - 0.5),
    }));
    return;
  };

  const StartGame = () => {
    if (state.deck.length === 0) {
      return;
    }

    setState((state) => ({
      ...state,
      userDeck: [],
      userScore: {},
      botDeck: [],
      botScore: {},
    }));
    for (let i = 0; i < 8; i++) {
      const card = state.deck.pop();
      i % 2 === 0
        ? setState((state) => ({
            ...state,
            userDeck: [...state.userDeck, card],
          }))
        : setState((state) => ({
            ...state,
            botDeck: [...state.botDeck, card],
          }));
    }
    return;
  };

  useEffect(() => {
    const userCardValues = state.userDeck.map((card) => card.slice(0, -2));
    const botCardValues = state.botDeck.map((card) => card.slice(0, -2));

    const newUserScore = {};
    const newBotScore = {};

    userCardValues.forEach((value) => {
      newUserScore[value] = (newUserScore[value] || 0) + 1;
    });

    botCardValues.forEach((value) => {
      newBotScore[value] = (newBotScore[value] || 0) + 1;
    });

    setState((state) => ({
      ...state,
      userScore: newUserScore,
      botScore: newBotScore,
    }));

    const counts = Object.values(newUserScore);
    const maxCount = Math.max(...counts);

    console.log(counts, maxCount);

    if (maxCount === 4) {
      console.log("Vous avez un carré!");
      setState((state) => ({ ...state, winner: true }));
    } else if (maxCount === 3) {
      console.log("Vous avez un brelan!");
      setState((state) => ({ ...state, winner: true }));
    } else if (maxCount === 2) {
      if (counts.filter((count) => count === 2).length === 2) {
        console.log("Vous avez une double paire!");
        setState((state) => ({ ...state, winner: true }));
      } else {
        console.log("Vous avez une paire!");
        setState((state) => ({ ...state, winner: true }));
      }
    } else {
      console.log("Pas de combinaison spéciale!");
    }
  }, [state.userDeck, state.botDeck]);

  return (
    <div className="flex flex-col bg-green-500 w-full h-screen items-center justify-center gap-10">
      <h1 className="text-6xl">{state.deck.length} cartes restantes</h1>
      <div className="flex flex-row gap-6 justify-center mb-6">
        <button
          onClick={ShuffleDeck}
          className="p-3 font-bold bg-red-500 hover:bg-red-600 active:bg-red-300 text-white rounded-lg transition"
          aria-label="Shuffle the deck"
        >
          Shuffle Deck
        </button>

        <button
          onClick={StartGame}
          className="p-3 font-bold bg-blue-500 hover:bg-blue-600 active:bg-blue-300 text-white rounded-lg transition"
          disabled={state.winner}
          aria-label="Start the game"
        >
          Start Game
        </button>
      </div>
      <div className="flex flex-row gap-64">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl mb-4">Votre deck</h1>
          <div className="w-full flex flex-row justify-center gap-6">
            {state.userDeck.map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-16 h-24 bg-white border border-gray-400 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <span
                  className={`text-${
                    ["♥️", "♦️"].some((symbol) => card.includes(symbol))
                      ? "red-500"
                      : "black"
                  }`}
                >
                  {card}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl mb-4">Deck de l'ordinateur</h1>
          <div className="w-full flex flex-row justify-center gap-6">
            {state.botDeck.map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-16 h-24 bg-white border border-gray-400 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <span
                  className={`text-${
                    ["♥️", "♦️"].some((symbol) => card.includes(symbol))
                      ? "red-500"
                      : "black"
                  }`}
                >
                  {card}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
