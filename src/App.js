import React, { useState } from 'react';
import TraitSelector from './components/TraitSelector';

function App() {
  const [selectedTraits, setSelectedTraits] = useState([]);

  const handleSelectTrait = (trait) => {
    setSelectedTraits((prevTraits) =>
      prevTraits.includes(trait)
        ? prevTraits.filter((t) => t !== trait)
        : [...prevTraits, trait]
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to the Johari Window Game</h1>
      <p>This tool helps you discover yourself and grow by understanding how you see yourself and how others see you.</p>

      <TraitSelector
        selectedTraits={selectedTraits}
        onSelectTrait={handleSelectTrait}
      />

      <div style={{ marginTop: '20px' }}>
        <h2>Your Selected Traits:</h2>
        <ul>
          {selectedTraits.map((trait) => (
            <li key={trait}>{trait}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
