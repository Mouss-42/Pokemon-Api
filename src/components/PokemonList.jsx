import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const PokemonCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PokemonImage = styled.img`
  width: 96px;
  height: 96px;
  image-rendering: pixelated;
`;

const GenerationNav = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const GenerationButton = styled.button`
  background-color: ${props => props.$active ? '#ee1515' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : 'black'};
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.$active ? '#cc1414' : '#e0e0e0'};
  }
`;

const ShinyToggle = styled.button`
  background-color: #ffd700;
  color: black;
  border: none;
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #ffcc00;
  }
`;

const generations = [
  { id: 1, start: 1, end: 151 },
  { id: 2, start: 152, end: 251 },
  { id: 3, start: 252, end: 386 },
  { id: 4, start: 387, end: 493 },
  { id: 5, start: 494, end: 649 },
  { id: 6, start: 650, end: 721 },
  { id: 7, start: 722, end: 809 },
  { id: 8, start: 810, end: 905 },
  { id: 9, start: 906, end: 1010 },
];

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentGeneration, setCurrentGeneration] = useState(1);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    fetchPokemons();
  }, [currentGeneration, isShiny]);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const gen = generations.find(g => g.id === currentGeneration);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${gen.end - gen.start + 1}&offset=${gen.start - 1}`);
      const data = await response.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          try {
            const speciesResponse = await fetch(pokemon.url);
            if (!speciesResponse.ok) {
              throw new Error(`HTTP error! status: ${speciesResponse.status}`);
            }
            const speciesData = await speciesResponse.json();
            const speciesInfoResponse = await fetch(speciesData.species.url);
            if (!speciesInfoResponse.ok) {
              throw new Error(`HTTP error! status: ${speciesInfoResponse.status}`);
            }
            const speciesInfo = await speciesInfoResponse.json();

            const frenchName = speciesInfo.names.find(name => name.language.name === 'fr')?.name || pokemon.name;
            
            return {
              id: speciesData.id,
              name: frenchName,
              image: isShiny ? speciesData.sprites.front_shiny : speciesData.sprites.front_default,
            };
          } catch (error) {
            console.error(`Error fetching details for ${pokemon.name}:`, error);
            return null;
          }
        })
      );

      setPokemons(pokemonDetails.filter(pokemon => pokemon !== null));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      setLoading(false);
    }
  };

  const toggleShiny = () => {
    setIsShiny(!isShiny);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (pokemons.length === 0) {
    return <div>Aucun Pokémon trouvé pour cette génération.</div>;
  }

  return (
    <>
      <GenerationNav>
        {generations.map(gen => (
          <GenerationButton
            key={gen.id}
            $active={currentGeneration === gen.id}
            onClick={() => setCurrentGeneration(gen.id)}
          >
            Génération {gen.id}
          </GenerationButton>
        ))}
      </GenerationNav>
      <ShinyToggle onClick={toggleShiny}>
        {isShiny ? 'Afficher Normal' : 'Afficher Shiny'}
      </ShinyToggle>
      <PokemonGrid>
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id}>
            <Link to={`/pokemon/${pokemon.id}`}>
              <PokemonImage src={pokemon.image} alt={pokemon.name} />
              <h3>{pokemon.name}</h3>
            </Link>
          </PokemonCard>
        ))}
      </PokemonGrid>
    </>
  );
}

export default PokemonList;

