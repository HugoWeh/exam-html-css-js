import { useState, useEffect } from "react";
import Deck from "./Deck";

const symbols = ["♥️", "♦️", "♣️", "♠️"];
const cards = ["7", "8", "9", "10", "J", "Q", "K", "A"];

const initialState = {
  deck: [],
  userDeck: [],
  userScore: {},
  botDeck: [],
  botScore: {},
  winner: false,
  winStatus: null,
  turn: 4,
  shuffle: false,
  pick: false,
};

const Game = () => {
  const [state, setState] = useState(initialState);

  const ShuffleDeck = () => {
    if (state.deck.length === 32 || state.deck.length !== 0) {
      return;
    }

    const newDeck = [];
    for (let card of cards) {
      for (let symbol of symbols) {
        newDeck.push(card + symbol);
      }
    }
    setState((state) => ({
      ...state,
      deck: newDeck.sort(() => Math.random() - 0.5),
      shuffle: true,
    }));
  };

  const Pick = () => {
    if (state.deck.length === 0) return;

    setState((state) => ({
      ...state,
      userDeck: [],
      userScore: {},
      botDeck: [],
      botScore: {},
      pick: true,
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
  };

  const Keep = () => {
    setState((state) => ({ ...state, turn: 0 }));
  };

  const Change = (index) => {
    if (state.turn === 0 || state.deck.length === 0) {
      return;
    }

    const newDeck = [...state.deck];
    const newCard = newDeck.pop();
    const newUserDeck = [
      ...state.userDeck.slice(0, index),
      newCard,
      ...state.userDeck.slice(index + 1),
    ];

    setState((state) => ({
      ...state,
      userDeck: newUserDeck,
      deck: newDeck,
      turn: state.turn - 1,
    }));
  };

  useEffect(() => {
    if (state.turn !== 0) return;

    const getScores = (deck) =>
      deck.reduce((score, card) => {
        const value = card.slice(0, -2);
        score[value] = (score[value] || 0) + 1;
        return score;
      }, {});

    const userScore = getScores(state.userDeck);
    const botScore = getScores(state.botDeck);

    const evaluateWinner = (score, isUser) => {
      const maxCount = Math.max(...Object.values(score), 0);
      if (maxCount === 4)
        return isUser
          ? "Vous avez gagné avec un carré"
          : "Bot a gagné avec un carré";
      if (maxCount === 3)
        return isUser
          ? "Vous avez gagné avec un brelan"
          : "Bot a gagné avec un brelan";

      const pairs = Object.values(score).filter((count) => count === 2).length;
      if (maxCount === 2)
        return isUser
          ? pairs === 2
            ? "Vous avez gagné avec une double paire"
            : "Vous avez gagné avec une paire"
          : pairs === 2
          ? "Bot a gagné avec une double paire"
          : "Bot a gagné avec une paire";

      return null;
    };

    const userWinStatus = evaluateWinner(userScore, true);
    const botWinStatus = evaluateWinner(botScore, false);

    if (userWinStatus || botWinStatus) {
      setState((state) => ({
        ...state,
        winner: true,
        winStatus: userWinStatus || botWinStatus,
      }));
    } else {
      const cardValues = (deck) =>
        deck.map((card) => cards.indexOf(card.slice(0, -2)));
      const userHighestCard = Math.max(...cardValues(state.userDeck));
      const botHighestCard = Math.max(...cardValues(state.botDeck));

      const winStatus =
        userHighestCard > botHighestCard
          ? "Vous avez gagné avec la carte la plus forte"
          : botHighestCard > userHighestCard
          ? "Bot a gagné avec la carte la plus forte"
          : "Match nul, les cartes sont égales";

      setState((state) => ({
        ...state,
        winner: true,
        winStatus,
      }));
    }
  }, [state.userDeck, state.botDeck, state.turn]);

  const Replay = () => {
    setState(initialState);
  };

  return (
    <div className="flex flex-col bg-green-900 w-full h-screen items-center justify-center gap-10 p-5">
      {state.winner ? (
        <>
          <p className="text-3xl font-bold text-center text-white mb-4 animate-pulse">
            <span className="text-yellow-400">{state.winStatus}</span>
          </p>
          <button
            onClick={Replay}
            className="p-3 font-bold bg-purple-600 hover:bg-purple-700 active:bg-purple-500 text-white rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
          >
            Rejouer
          </button>
        </>
      ) : (
        <h1 className="text-6xl text-white">
          {state.deck.length} cartes restantes
        </h1>
      )}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl text-white font-semibold mb-2">Actions</h2>
        <div className="flex flex-row justify-center gap-6">
          <button
            onClick={ShuffleDeck}
            disabled={state.shuffle}
            className="p-4 font-bold bg-red-500 hover:bg-red-600 active:bg-red-300 text-white rounded-lg transition shadow-lg w-32"
          >
            Mélanger
          </button>
          <button
            onClick={Pick}
            disabled={state.pick}
            className="p-4 font-bold bg-blue-500 hover:bg-blue-600 active:bg-blue-300 text-white rounded-lg transition shadow-lg w-32"
          >
            Tirer
          </button>
          <button
            onClick={Keep}
            disabled={!state.pick}
            className="p-4 font-bold bg-orange-500 hover:bg-orange-600 active:bg-orange-300 text-white rounded-lg transition shadow-lg w-32"
          >
            Garder
          </button>
        </div>
      </div>

      <div className="flex flex-row gap-64">
        <Deck
          title="Votre deck"
          cards={state.userDeck}
          onChange={Change}
          isUserDeck={true}
        />
        <Deck title="Deck de l'ordinateur" cards={state.botDeck} />
      </div>
    </div>
  );
};

export default Game;
