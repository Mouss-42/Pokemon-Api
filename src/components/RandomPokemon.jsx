import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const RandomPokemonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PokemonCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
`;

const RefreshButton = styled.button`
  background-color: #ee1515;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #cc1414;
  }
`;

function RandomPokemon() {
  const [randomPokemon, setRandomPokemon] = useState(null);

  const fetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      setRandomPokemon(data);
    } catch (error) {
      console.error('Error fetching random Pokemon:', error);
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  if (!randomPokemon) {
    return <div>Chargement...</div>;
  }

  return (
    <RandomPokemonContainer>
      <h2>Pokémon Aléatoire</h2>
      <PokemonCard>
        <PokemonImage
          src={randomPokemon.sprites.other['official-artwork'].front_default}
          alt={randomPokemon.name}
        />
        <h3>{randomPokemon.name}</h3>
        <p>Type(s): {randomPokemon.types.map((type) => type.type.name).join(', ')}</p>
        <Link to={`/pokemon/${randomPokemon.name}`}>Voir les détails</Link>
      </PokemonCard>
      <RefreshButton onClick={fetchRandomPokemon}>Nouveau Pokémon Aléatoire</RefreshButton>
    </RandomPokemonContainer>
  );
}

export default RandomPokemon;

