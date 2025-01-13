import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AbilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const AbilityCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AbilityName = styled.h3`
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const AbilityDetails = styled.div`
  margin-top: 10px;
`;

const PokemonList = styled.ul`
  list-style-type: none;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
`;

function AbilityList() {
  const [abilities, setAbilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAbility, setExpandedAbility] = useState(null);

  useEffect(() => {
    fetchAbilities();
  }, []);

  const fetchAbilities = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://pokeapi.co/api/v2/ability?limit=100');
      const data = await response.json();
      const detailedAbilities = await Promise.all(
        data.results.map(async (ability) => {
          const abilityResponse = await fetch(ability.url);
          return await abilityResponse.json();
        })
      );
      setAbilities(detailedAbilities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching abilities:', error);
      setLoading(false);
    }
  };

  const toggleAbilityDetails = (abilityId) => {
    if (expandedAbility === abilityId) {
      setExpandedAbility(null);
    } else {
      setExpandedAbility(abilityId);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <AbilityGrid>
      {abilities.map((ability) => (
        <AbilityCard key={ability.id}>
          <AbilityName onClick={() => toggleAbilityDetails(ability.id)}>
            {ability.names.find(name => name.language.name === 'en')?.name} / 
            {ability.names.find(name => name.language.name === 'fr')?.name}
          </AbilityName>
          {expandedAbility === ability.id && (
            <AbilityDetails>
              <p>{ability.effect_entries.find(entry => entry.language.name === 'fr')?.effect}</p>
              <h4>Pokémon avec cette capacité :</h4>
              <PokemonList>
                {ability.pokemon.map((p) => (
                  <li key={p.pokemon.name}>{p.pokemon.name}</li>
                ))}
              </PokemonList>
            </AbilityDetails>
          )}
        </AbilityCard>
      ))}
    </AbilityGrid>
  );
}

export default AbilityList;

