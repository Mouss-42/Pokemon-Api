import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import PokemonList from './components/PokemonList';
import PokemonDetails from './components/PokemonDetails';
import TypeList from './components/TypeList';
import AbilityList from './components/AbilityList';
import Search from './components/Search';
import RandomPokemon from './components/RandomPokemon';
import Comparator from './components/Comparator';
import TeamBuilder from './components/TeamBuilder';
import Quiz from './components/Quiz';

const lightTheme = {
  background: '#f0f0f0',
  text: '#333333',
  primary: '#ee1515',
  secondary: '#3761a8',
  card: '#ffffff',
  navBackground: 'rgba(238, 21, 21, 0.9)',
};

const darkTheme = {
  background: '#1a1a1a',
  text: '#f0f0f0',
  primary: '#ff3e3e',
  secondary: '#4f7dca',
  card: '#2a2a2a',
  navBackground: 'rgba(255, 62, 62, 0.9)',
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
  }
`;

const AppContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Navigation = styled(motion.nav)`
  background-color: ${props => props.theme.navBackground};
  padding: 15px;
  margin-bottom: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 25px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &.active {
    background-color: white;
    color: ${props => props.theme.primary};
  }
`;

const MainContent = styled(motion.main)`
  padding: 30px;
  background-color: ${props => props.theme.card};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  z-index: 1000;
`;

const ErrorMessage = styled(motion.div)`
  background-color: #ffebee;
  color: #c62828;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(30deg);
  }
`;

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPokemons(data.results);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  if (loading) {
    return (
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyle />
        <LoadingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Chargement...
        </LoadingOverlay>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyle />
        <ErrorMessage
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          Erreur : {error}
        </ErrorMessage>
      </ThemeProvider>
    );
  }

  return (
    <Router>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyle />
        <AppContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
          <Navigation
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            <NavContainer>
              <NavLinks>
                <StyledNavLink to="/" end>Accueil</StyledNavLink>
                <StyledNavLink to="/types">Types</StyledNavLink>
                <StyledNavLink to="/abilities">Capacités</StyledNavLink>
                <StyledNavLink to="/search">Recherche</StyledNavLink>
                <StyledNavLink to="/random">Pokémon Aléatoire</StyledNavLink>
                <StyledNavLink to="/compare">Comparateur</StyledNavLink>
                <StyledNavLink to="/team-builder">Créateur d'Équipe</StyledNavLink>
                <StyledNavLink to="/quiz">Quiz</StyledNavLink>
              </NavLinks>
              <ThemeToggle onClick={toggleTheme}>
                {isDarkTheme ? <Sun /> : <Moon />}
              </ThemeToggle>
            </NavContainer>
          </Navigation>
          <MainContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PokemonList pokemons={pokemons} />} />
                <Route path="/pokemon/:id" element={<PokemonDetails />} />
                <Route path="/types" element={<TypeList />} />
                <Route path="/abilities" element={<AbilityList />} />
                <Route path="/search" element={<Search />} />
                <Route path="/random" element={<RandomPokemon />} />
                <Route path="/compare" element={<Comparator />} />
                <Route path="/team-builder" element={<TeamBuilder />} />
                <Route path="/quiz" element={<Quiz />} />
              </Routes>
            </AnimatePresence>
          </MainContent>
          <Footer />
        </AppContainer>
      </ThemeProvider>
    </Router>
  );
}

export default App;

