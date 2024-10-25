import { motion } from "framer-motion";

const Card = ({ card, onChange, isUserCard }) => {
  const cardVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="flex items-center justify-center w-24 h-32 bg-white border border-gray-400 rounded-lg shadow-lg"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <span
          className={`text-4xl text-${
            ["♥️", "♦️"].some((symbol) => card.includes(symbol))
              ? "red-500"
              : "black"
          }`}
        >
          {card}
        </span>
      </motion.div>
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
