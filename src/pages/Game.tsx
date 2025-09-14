import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBoard from "@/components/GameBoard";
import { useParams } from "react-router-dom";

interface GameProps {
  world?: string;
}

const Game = ({ world }: GameProps) => {
  const params = useParams();
  const level = world || params.level;
  let onlyLoopWorld = false;
  let startingId: number | undefined = undefined;

  if (level === "condicionais") {
    startingId = 1;
  } else if (level === "lacos") {
    startingId = 10;
    onlyLoopWorld = true;
  } else if (level === "listas") {
    startingId = 20;
  } else if (level === "funcoes") {
    startingId = 30;
  } else if (level === "recursao") {
    startingId = 40;
  } else if (!isNaN(Number(level))) {
    startingId = Number(level);
  }

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