import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBoard from "@/components/GameBoard";

interface GameProps {
  world?: string;
}

const Game = ({ world }: GameProps) => {
  const params = useParams();
  const level = world || params.level;

  // Define o ID da fase inicial para cada mundo
  let startingId = 1; // Padrão é a fase 1
  if (level === "lacos") {
    startingId = 10;
  } else if (level === "listas") {
    startingId = 20; 
  } else if (level === "funcoes") {
    startingId = 30; 
  }

  // Define se a lista de fases deve ser filtrada (para mundos avançados)
  const onlyLoopWorld = level === "lacos" || level === "listas";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12">
        <GameBoard onlyLoopWorld={onlyLoopWorld} startingId={startingId} />
      </main>
      <Footer />
    </div>
  );
};

export default Game;