import React, { useState } from 'react';
import styled from 'styled-components';
import Search from './Search';

const TeamBuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TeamDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const PokemonCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PokemonImage = styled.img`
  width: 120px;
  height: 120px;
`;

function TeamBuilder() {
  const [team, setTeam] = useState([]);

  const handleAddPokemon = async (selectedPokemon) => {
    if (team.length >= 6) {
      alert('Votre équipe est déjà complète !');
      return;
    }
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon.name}`);
      const data = await response.json();
      setTeam([...team, data]);
    } catch (error) {
      console.error('Error adding Pokemon to team:', error);
      alert('Erreur lors de l\'ajout du Pokémon à l\'équipe. Veuillez réessayer.');
    }
  };

  return (
    <TeamBuilderContainer>
      <h2>Créateur d'Équipe Pokémon</h2>
      <Search onSelect={handleAddPokemon} />
      <TeamDisplay>
        {team.map((pokemon, index) => (
          <PokemonCard key={index}>
            <h3>{pokemon.name}</h3>
            <PokemonImage
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
            />
            <p>Types: {pokemon.types.map((type) => type.type.name).join(', ')}</p>
          </PokemonCard>
        ))}
      </TeamDisplay>
    </TeamBuilderContainer>
  );
}

export default TeamBuilder;

