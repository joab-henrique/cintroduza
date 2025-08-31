import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Clock, Target, Star, Zap, Shield, Sword } from "lucide-react";
// import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameBoard from "@/components/GameBoard";

import { useParams } from "react-router-dom";
interface GameProps {
  world?: string;
}
const Game = ({ world }: GameProps) => {
  // Se vier da rota /python/algoritmos ou /python/lacos, usa prop world
  // Se vier de /python/:level, usa useParams
  const params = useParams();
    const level = world || params.level; 
    // Se for algoritmos, mostra só as fases 1-6; se for laços, só as 7+.
    const onlyLoopWorld = level === "lacos";
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12">
          <GameBoard onlyLoopWorld={onlyLoopWorld} />
      </main>
      <Footer />
    </div>
  );
};

export default Game;