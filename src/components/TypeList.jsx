import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const TypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
`;

const TypeButton = styled(Link)`
  background-color: ${(props) => props.$color};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

function TypeList() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://pokeapi.co/api/v2/type');
      const data = await response.json();
      const sortedTypes = data.results.sort((a, b) => a.name.localeCompare(b.name));
      setTypes(sortedTypes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching types:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <TypeGrid>
      {types.map((type) => (
        <TypeButton key={type.name} to={`/type/${type.name}`} $color={typeColors[type.name] || '#777777'}>
          {type.name}
        </TypeButton>
      ))}
    </TypeGrid>
  );
}

export default TypeList;

