import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const DetailsContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PokemonImage = styled.img`
  width: 200px;
  height: 200px;
`;

const StatBar = styled.div`
  background-color: #f0f0f0;
  height: 20px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const StatFill = styled.div`
  background-color: #4caf50;
  height: 100%;
  border-radius: 10px;
  width: ${(props) => props.$percentage}%;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const NavButton = styled(Link)`
  background-color: #ee1515;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;

  &:hover {
    background-color: #cc1414;
  }
`;

const FormSelect = styled.select`
  margin-bottom: 20px;
  padding: 5px;
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

function PokemonDetails() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [forms, setForms] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    fetchPokemonDetails();
  }, [id]);

  const fetchPokemonDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();
      
      const frenchName = speciesData.names.find(name => name.language.name === 'fr')?.name || data.name;
      
      const formResponses = await Promise.all(
        speciesData.varieties.map(variety => fetch(variety.pokemon.url).then(res => res.json()))
      );

      setPokemon({ ...data, name: frenchName });
      setForms(formResponses);
      setCurrentForm(formResponses[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pokemon details:', error);
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const selectedForm = forms.find(form => form.name === e.target.value);
    setCurrentForm(selectedForm);
  };

  const toggleShiny = () => {
    setIsShiny(!isShiny);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!pokemon || !currentForm) {
    return <div>Pokémon non trouvé</div>;
  }

  return (
    <DetailsContainer>
      <h2>{pokemon.name}</h2>
      {forms.length > 1 && (
        <FormSelect onChange={handleFormChange} value={currentForm.name}>
          {forms.map(form => (
            <option key={form.name} value={form.name}>
              {form.name}
            </option>
          ))}
        </FormSelect>
      )}
      <ShinyToggle onClick={toggleShiny}>
        {isShiny ? 'Afficher Normal' : 'Afficher Shiny'}
      </ShinyToggle>
      <PokemonImage
        src={isShiny ? currentForm.sprites.other['official-artwork'].front_shiny : currentForm.sprites.other['official-artwork'].front_default}
        alt={currentForm.name}
      />
      <div>
        <h3>Types</h3>
        <ul>
          {currentForm.types.map((type) => (
            <li key={type.type.name}>{type.type.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Capacités</h3>
        <ul>
          {currentForm.abilities.map((ability) => (
            <li key={ability.ability.name}>{ability.ability.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Statistiques</h3>
        {currentForm.stats.map((stat) => (
          <div key={stat.stat.name}>
            <p>{stat.stat.name}: {stat.base_stat}</p>
            <StatBar>
              <StatFill $percentage={(stat.base_stat / 255) * 100} />
            </StatBar>
          </div>
        ))}
      </div>
      <Navigation>
        <NavButton to={`/pokemon/${parseInt(id) - 1}`}>Précédent</NavButton>
        <NavButton to={`/pokemon/${parseInt(id) + 1}`}>Suivant</NavButton>
      </Navigation>
    </DetailsContainer>
  );
}

export default PokemonDetails;

