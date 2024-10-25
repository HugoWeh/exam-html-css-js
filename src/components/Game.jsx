// src/components/Game.js
import React, { useState, useEffect } from "react";
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
    setState((prevState) => ({
      ...prevState,
      deck: newDeck.sort(() => Math.random() - 0.5),
    }));
  };

  const Pick = () => {
    if (state.deck.length === 0) return;

    setState((prevState) => ({
      ...prevState,
      userDeck: [],
      userScore: {},
      botDeck: [],
      botScore: {},
    }));

    for (let i = 0; i < 8; i++) {
      const card = state.deck.pop();
      i % 2 === 0
        ? setState((prevState) => ({
            ...prevState,
            userDeck: [...prevState.userDeck, card],
          }))
        : setState((prevState) => ({
            ...prevState,
            botDeck: [...prevState.botDeck, card],
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

    setState((state) => ({
      ...state,
      userDeck: [
        ...state.userDeck.slice(0, index),
        state.deck.pop(),
        ...state.userDeck.slice(index + 1),
      ],
      deck: state.deck.slice(0, state.deck.length - 1),
      turn: state.turn - 1,
    }));
  };

  useEffect(() => {
    if (state.turn !== 0) {
      return;
    }

    const getScores = (cardValues) => {
      const score = {};
      cardValues.forEach((value) => {
        score[value] = (score[value] || 0) + 1;
      });
      return score;
    };

    const newUserScore = getScores(
      state.userDeck.map((card) => card.slice(0, -2))
    );
    const newBotScore = getScores(
      state.botDeck.map((card) => card.slice(0, -2))
    );

    setState((state) => ({
      ...state,
      userScore: newUserScore,
      botScore: newBotScore,
    }));

    const evaluateWinner = (score, isUser) => {
      const counts = Object.values(score);
      const maxCount = Math.max(...counts, 0);

      if (maxCount === 4) {
        return isUser
          ? "Vous avez gagné avec un carré"
          : "Bot a gagné avec un carré";
      } else if (maxCount === 3) {
        return isUser
          ? "Vous avez gagné avec un brelan"
          : "Bot a gagné avec un brelan";
      } else if (maxCount === 2) {
        const pairs = counts.filter((count) => count === 2).length;
        return isUser
          ? pairs === 2
            ? "Vous avez gagné avec une double paire"
            : "Vous avez gagné avec une paire"
          : pairs === 2
          ? "Bot a gagné avec une double paire"
          : "Bot a gagné avec une paire";
      }
      return null;
    };

    const userWinStatus = evaluateWinner(newUserScore, true);
    const botWinStatus = evaluateWinner(newBotScore, false);

    if (userWinStatus) {
      setState((prevState) => ({
        ...prevState,
        winner: true,
        winStatus: userWinStatus,
      }));
    } else if (botWinStatus) {
      setState((prevState) => ({
        ...prevState,
        winner: true,
        winStatus: botWinStatus,
      }));
    }
  }, [state.userDeck, state.botDeck, state.turn]);

  const Replay = () => {
    setState(initialState);
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-green-400 to-green-600 w-full h-screen items-center justify-center gap-10 p-5">
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
      <div className="flex flex-row gap-6 justify-center mb-6">
        <button
          onClick={ShuffleDeck}
          className="p-3 font-bold bg-red-500 hover:bg-red-600 active:bg-red-300 text-white rounded-lg transition shadow-lg"
        >
          Mélanger les cartes
        </button>
        <button
          onClick={Pick}
          className="p-3 font-bold bg-blue-500 hover:bg-blue-600 active:bg-blue-300 text-white rounded-lg transition shadow-lg"
          disabled={state.winner}
        >
          Tirer
        </button>
        <button
          onClick={Keep}
          className="p-3 font-bold bg-orange-500 hover:bg-orange-600 active:bg-orange-300 text-white rounded-lg transition shadow-lg"
        >
          Garder
        </button>
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
