import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fonction utilitaire pour normaliser les chaînes de caractères
function normalizeString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const difficultyLevels = [
  { name: 'Facile', value: 'easy' },
  { name: 'Intermédiaire', value: 'medium' },
  { name: 'Difficile', value: 'hard' },
];

const TOTAL_POKEMON = 1025;

function usePokemonData() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllPokemon() {
      const pokemonList = [];

      for (let i = 1; i <= TOTAL_POKEMON; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const data = await response.json();
        
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        const frenchName = speciesData.names.find((name) => name.language.name === 'fr')?.name || data.name;

        pokemonList.push({
          id: data.id,
          name: data.name,
          frenchName: frenchName,
          types: data.types.map((type) => type.type.name),
          generation: speciesData.generation.url.split('/')[6],
          stats: data.stats.map((stat) => ({ name: stat.stat.name, value: stat.base_stat })),
          cryUrl: `https://play.pokemonshowdown.com/audio/cries/${data.name.toLowerCase()}.mp3`,
        });
      }

      setPokemonList(pokemonList);
      setLoading(false);
    }

    fetchAllPokemon();
  }, []);

  return { pokemonList, loading };
}

export default function Quiz() {
  const { pokemonList, loading } = usePokemonData();
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [showTypeAndGen, setShowTypeAndGen] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (pokemonList.length > 0) {
      selectRandomPokemon();
    }
  }, [pokemonList]);

  useEffect(() => {
    const checkGuess = () => {
      if (!currentPokemon) return;

      const normalizedGuess = normalizeString(guess);
      const normalizedName = normalizeString(currentPokemon.name);
      const normalizedFrenchName = normalizeString(currentPokemon.frenchName);

      if (normalizedGuess === normalizedName || normalizedGuess === normalizedFrenchName) {
        handleCorrectGuess();
      }
    };

    checkGuess();
  }, [guess, currentPokemon]);

  const selectRandomPokemon = () => {
    const randomPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    setCurrentPokemon(randomPokemon);
    setGuess('');
    setMessage('');
    setRevealed(false);
  };

  const handleCorrectGuess = () => {
    setScore(score + 1);
    setStreak(streak + 1);
    if (streak + 1 > bestScore) {
      setBestScore(streak + 1);
    }
    setMessage('Correct ! Bien joué !');
    setRevealed(true);
    setTimeout(selectRandomPokemon, 2000);
  };

  const handleSkip = () => {
    if (!currentPokemon) return;
    setMessage(`La réponse était ${currentPokemon.frenchName} (${currentPokemon.name}).`);
    setStreak(0);
    setRevealed(true);
    setTimeout(selectRandomPokemon, 2000);
  };

  const getImageUrl = () => {
    if (!currentPokemon) return '';
    const baseUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`;
    switch (difficulty) {
      case 'easy':
        return `${baseUrl}${currentPokemon.id}.png`;
      case 'medium':
        return `${baseUrl}versions/generation-v/black-white/animated/${currentPokemon.id}.gif`;
      case 'hard':
      default:
        return `${baseUrl}${currentPokemon.id}.png`;
    }
  };

  const playCry = () => {
    if (audioRef.current && currentPokemon) {
      audioRef.current.src = currentPokemon.cryUrl;
      audioRef.current.play();
    }
  };

  if (loading) {
    return <div className="text-center text-white text-2xl">Chargement des données Pokémon...</div>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center py-10"
      style={{ backgroundImage: "url('/images/wallpaper.jpg')" }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-white shadow-text">Quiz Pokémon</h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto mt-8 p-6 bg-white bg-opacity-90 rounded-lg shadow-lg"
        >
          <div className="text-center mb-6">
            <p className="text-lg">Score total actuel : <span className="font-bold text-green-600">{score}</span></p>
            <p className="text-lg">Meilleur Série : <span className="font-bold text-purple-600">{bestScore}</span></p>
            <p className="text-lg">Série actuelle : <span className="font-bold text-orange-600">{streak}</span></p>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Difficulté :</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficultyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showTypeAndGen}
                onChange={() => setShowTypeAndGen(!showTypeAndGen)}
                className="mr-2 form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Afficher le type et la génération</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showStats}
                onChange={() => setShowStats(!showStats)}
                className="mr-2 form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Afficher les statistiques</span>
            </label>
          </div>
          {currentPokemon && (
            <div className="mb-6">
              <img
                src={getImageUrl()}
                alt="Pokemon"
                className={`mx-auto w-48 h-48 object-contain ${revealed ? '' : 'filter brightness-0'}`}
              />
              <AnimatePresence>
                {showTypeAndGen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-center"
                  >
                    <p className="font-semibold">Type(s) : <span className="text-blue-600">{currentPokemon.types.join(', ')}</span></p>
                    <p className="font-semibold">Génération : <span className="text-blue-600">{currentPokemon.generation}</span></p>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showStats && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <h3 className="font-semibold mb-2">Statistiques :</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {currentPokemon.stats.map((stat, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{stat.name}:</span>
                          <span className="font-bold">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <div className="mb-6">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Entrez le nom du Pokémon"
              className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
            >
              Passer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playCry}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
            >
              Écouter le cri
            </motion.button>
          </div>
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center font-bold mt-4 text-lg text-blue-600"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
          <audio ref={audioRef} />
        </motion.div>
      </div>
    </div>
  );
}

