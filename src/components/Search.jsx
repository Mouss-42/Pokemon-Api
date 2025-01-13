import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ee1515;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const SearchResults = styled.div`
  width: 300px;
`;

const SearchResultItem = styled(Link)`
  display: block;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 10px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function Search({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);

  useEffect(() => {
    fetchAllPokemon();
  }, []);

  const fetchAllPokemon = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await response.json();
      setAllPokemon(data.results);
    } catch (error) {
      console.error('Error fetching all Pokemon:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 1) {
      const filteredResults = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelect = (pokemon) => {
    if (onSelect) {
      onSelect(pokemon);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <SearchContainer>
      <h2>Rechercher un Pokémon</h2>
      <SearchInput
        type="text"
        placeholder="Entrez le nom d'un Pokémon"
        value={searchTerm}
        onChange={handleSearch}
      />
      <SearchResults>
        {searchResults.map((pokemon) => (
          <SearchResultItem
            key={pokemon.name}
            to={onSelect ? '#' : `/pokemon/${pokemon.name}`}
            onClick={() => handleSelect(pokemon)}
          >
            {pokemon.name}
          </SearchResultItem>
        ))}
      </SearchResults>
    </SearchContainer>
  );
}

export default Search;

