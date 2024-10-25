const Card = ({ card, onChange, isUserCard }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center w-24 h-32 bg-white border border-gray-400 rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-fade-in">
        <span
          className={`text-4xl text-${
            ["♥️", "♦️"].some((symbol) => card.includes(symbol))
              ? "red-500"
              : "black"
          }`}
        >
          {card}
        </span>
      </div>
      {isUserCard && (
        <button
          onClick={onChange}
          className="mt-2 p-2 bg-gray-300 hover:bg-gray-400 text-black rounded-lg font-bold"
        >
          Changer
        </button>
      )}
    </div>
  );
};

export default Card;
