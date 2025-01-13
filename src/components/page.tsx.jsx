import GuessPokemon from './GuessPokemon';
import Link from 'next/link';

export default function QuizPage() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center py-10"
      style={{ backgroundImage: "url('/images/wallpaper.jpg')" }}
    >
      <div className="container mx-auto px-4">
        <nav className="mb-8">
          <ul className="flex justify-center space-x-4">
            <li>
              <Link href="/" className="text-white hover:text-blue-300 transition duration-300">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/quiz" className="text-white hover:text-blue-300 transition duration-300">
                Quiz
              </Link>
            </li>
            {/* Ajoutez d'autres liens vers vos pages existantes ici */}
          </ul>
        </nav>
        <h1 className="text-4xl font-bold text-center mb-10 text-white shadow-text">Quiz Pokémon</h1>
        <GuessPokemon />
      </div>
    </div>
  );
}

