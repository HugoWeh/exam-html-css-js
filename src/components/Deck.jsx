import { motion } from "framer-motion";
import Card from "./Card";

const Deck = ({ title, cards, onChange, isUserDeck }) => {
  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-green-800 to-green-600 p-5 rounded-lg shadow-lg">
      <h1 className="text-5xl mb-4 text-yellow-300 font-bold text-shadow-lg">
        {title}
      </h1>
      <div className="w-full flex flex-row justify-center gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.5 }}
          >
            <Card
              card={card}
              onChange={isUserDeck ? () => onChange(index) : null}
              isUserCard={isUserDeck}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Deck;
