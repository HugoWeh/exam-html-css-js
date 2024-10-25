import { useState } from "react";
import "./App.css";

const symbols = ["♥️", "♦️", "♣️", "♠️"];
const cards = ["7", "8", "9", "10", "J", "Q", "K", "As"];

const initialState = {
  deck: [],
  userDeck: [],
  userScore: {},
  botDeck: [],
  botScore: {},
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
    Win();
    return;
  };

  const Win = () => {
    const userCardValues = state.userDeck.map((card) => card.slice(0, -2));
    const botCardValues = state.botDeck.map((card) => card.slice(0, -2));

    userCardValues.forEach((value) => {
      setState((state) => ({
        ...state,
        userScore: {
          ...state.userScore,
          [value]: (state.userScore[value] || 0) + 1,
        },
      }));
    });

    const counts = Object.values(state.userScore);
    const maxCount = Math.max(...counts);
    console.log(counts, maxCount);

    if (maxCount === 4) {
      console.log("Vous avez un carré!");
    } else if (maxCount === 3) {
      console.log("Vous avez un brelan!");
    } else if (maxCount === 2) {
      if (counts.filter((count) => count === 2).length === 2) {
        console.log("Vous avez une double paire!");
      } else {
        console.log("Vous avez une paire!");
      }
    } else {
      console.log("Pas de combinaison spéciale!");
    }
  };

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
