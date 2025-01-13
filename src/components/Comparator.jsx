import React, { useState } from 'react';
import styled from 'styled-components';
import Search from './Search';

const ComparatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CompareForm = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const ComparisonResult = styled.div`
  display: flex;
  gap: 40px;
`;

const PokemonCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
`;

function Comparator() {
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleSelect = async (selectedPokemon, index) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon.name}`);
      const data = await response.json();
      if (index === 1) {
        setPokemon1(data);
      } else {
        setPokemon2(data);
      }
      if (pokemon1 && pokemon2) {
        setComparisonResult({ pokemon1, pokemon2: data });
      } else if (index === 1 && pokemon2) {
        setComparisonResult({ pokemon1: data, pokemon2 });
      } else if (index === 2 && pokemon1) {
        setComparisonResult({ pokemon1, pokemon2: data });
      }
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  return (
    <ComparatorContainer>
      <h2>Comparateur de Pokémon</h2>
      <CompareForm>
        <Search onSelect={(pokemon) => handleSelect(pokemon, 1)} />
        <Search onSelect={(pokemon) => handleSelect(pokemon, 2)} />
      </CompareForm>
      {comparisonResult && (
        <ComparisonResult>
          <PokemonCard>
            <h3>{comparisonResult.pokemon1.name}</h3>
            <PokemonImage
              src={comparisonResult.pokemon1.sprites.other['official-artwork'].front_default}
              alt={comparisonResult.pokemon1.name}
            />
            <p>Taille: {comparisonResult.pokemon1.height / 10} m</p>
            <p>Poids: {comparisonResult.pokemon1.weight / 10} kg</p>
            <p>Types: {comparisonResult.pokemon1.types.map((type) => type.type.name).join(', ')}</p>
          </PokemonCard>
          <PokemonCard>
            <h3>{comparisonResult.pokemon2.name}</h3>
            <PokemonImage
              src={comparisonResult.pokemon2.sprites.other['official-artwork'].front_default}
              alt={comparisonResult.pokemon2.name}
            />
            <p>Taille: {comparisonResult.pokemon2.height / 10} m</p>
            <p>Poids: {comparisonResult.pokemon2.weight / 10} kg</p>
            <p>Types: {comparisonResult.pokemon2.types.map((type) => type.type.name).join(', ')}</p>
          </PokemonCard>
        </ComparisonResult>
      )}
    </ComparatorContainer>
  );
}

export default Comparator;

