import React from 'react';

const traits = [
  "Able", "Accepting", "Adaptable", "Bold", "Brave",
  "Calm", "Caring", "Cheerful", "Clever", "Complex",
  "Dependable", "Dignified", "Empathetic", "Energetic", "Friendly",
  "Giving", "Happy", "Helpful", "Idealistic", "Independent"
];

const TraitSelector = ({ selectedTraits, setSelectedTraits }) => {
  const toggleTrait = (trait) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(t => t !== trait));
    } else {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {traits.map((trait) => (
        <button
          key={trait}
          onClick={() => toggleTrait(trait)}
          className={`px-3 py-1 rounded-full border ${
            selectedTraits.includes(trait) ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          {trait}
        </button>
      ))}
    </div>
  );
};

export default TraitSelector;
