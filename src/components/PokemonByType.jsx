import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const PokemonCard = styled.div`
  background-color: ${props => props.theme.card};
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
  width: 120px;
  height: 120px;
`;

function PokemonByType() {
  const { type } = useParams();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonsByType();
  }, [type]);

  const fetchPokemonsByType = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await response.json();

      const pokemonDetails = await Promise.all(
        data.pokemon.slice(0, 20).map(async (p) => {
          const res = await fetch(p.pokemon.url);
          const pokemonData = await res.json();
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
          };
        })
      );

      setPokemons(pokemonDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pokemons by type:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2>Pokémon de type {type}</h2>
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
    </div>
  );
}

export default PokemonByType;

