import { useState, useEffect } from 'react';

export interface Pokemon {
  id: number;
  name: string;
  frenchName: string;
  types: string[];
  generation: number;
  colors: string[];
  stats: { name: string; value: number }[];
  cryUrl: string;
}

const TOTAL_POKEMON = 1025;

export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const pokemonList: Pokemon[] = [];

  for (let i = 1; i <= TOTAL_POKEMON; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await response.json();
    
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    const frenchName = speciesData.names.find((name: any) => name.language.name === 'fr')?.name || data.name;

    pokemonList.push({
      id: data.id,
      name: data.name,
      frenchName: frenchName,
      types: data.types.map((type: any) => type.type.name),
      generation: speciesData.generation.url.split('/')[6],
      colors: speciesData.color ? [speciesData.color.name] : [],
      stats: data.stats.map((stat: any) => ({ name: stat.stat.name, value: stat.base_stat })),
      cryUrl: `https://play.pokemonshowdown.com/audio/cries/${data.name.toLowerCase()}.mp3`,
    });
  }

  return pokemonList;
}

export function usePokemonData() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPokemon().then((data) => {
      setPokemonList(data);
      setLoading(false);
    });
  }, []);

  return { pokemonList, loading };
}

export function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export const difficultyLevels = [
  { name: 'Facile', value: 'easy' },
  { name: 'Intermédiaire', value: 'medium' },
  { name: 'Difficile', value: 'hard' },
];

