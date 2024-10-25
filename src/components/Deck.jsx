import Card from "./Card";

const Deck = ({ title, cards, onChange, isUserDeck }) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl mb-4 text-white">{title}</h1>
      <div className="w-full flex flex-row justify-center gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            onChange={isUserDeck ? () => onChange(index) : null}
            isUserCard={isUserDeck}
          />
        ))}
      </div>
    </div>
  );
};

export default Deck;
