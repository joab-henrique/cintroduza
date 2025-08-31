import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Code, Repeat, List, Zap, RotateCcw, Database, Star, Trophy, Target, Flame } from "lucide-react";
import { Link } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import GameBoard from "@/components/GameBoard";

const Python = () => {
  const levels = [
    {
      id: "algoritmos",
      title: "🎯 Algoritmos Básicos",
      description: "Fundamentos e lógica de programação",
      icon: Code,
      phases: 9,
      color: "bg-gradient-primary",
      emoji: "🚀"
    },
    {
      id: "lacos",
      title: "🔄 Laços de Repetição",
      description: "Dominando for, while e loops avançados",
      icon: Repeat,
      phases: 6,
      color: "bg-gradient-python",
      emoji: "🌀"
    },
    {
      id: "listas",
      title: "📋 Listas e Arrays",
      description: "Manipulação de estruturas de dados",
      icon: List,
      phases: 7,
      color: "bg-gradient-java",
      emoji: "📊"
    },
    {
      id: "funcoes",
      title: "⚡ Funções",
      description: "Criação e otimização de funções",
      icon: Zap,
      phases: 5,
      color: "bg-gradient-c",
      emoji: "🛠️"
    },
    {
      id: "recursao",
      title: "🌪️ Recursão",
      description: "Algoritmos recursivos e suas magias",
      icon: RotateCcw,
      phases: 4,
      color: "bg-gradient-gaming",
      emoji: "🧙‍♂️"
    },
    {
      id: "estruturas",
      title: "🗃️ Tuplas & Dicionários",
      description: "Estruturas de dados complexas",
      icon: Database,
      phases: 6,
      color: "bg-gradient-dark",
      emoji: "💎"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Iniciante": return "text-success";
      case "Básico": return "text-python";
      case "Intermediário": return "text-warning";
      case "Avançado": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                🗺️ Mapa de Aventuras
              </h2>
              <p className="text-xl text-muted-foreground">
                Cada nível é uma nova jornada. Você está pronto para o desafio?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Botão Algoritmos Básicos */}
              <Link to="/python/algoritmos" className="group">
                <Card className="h-full hover:shadow-neon transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden border-2 border-primary/20 hover:border-primary/60 animate-slide-up">
                  <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <CardHeader className="text-center pb-4 relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                      <div className="text-3xl">🚀</div>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">Algoritmos Básicos e Condicionais</CardTitle>
                    <CardDescription className="text-sm">Fundamentos e lógica de programação</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4 relative z-10">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gradient-card rounded-lg p-3 border border-border">
                        <div className="text-2xl font-bold text-primary">9</div>
                        <p className="text-xs text-muted-foreground">Fases</p>
                      </div>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/20 transition-colors duration-300">
                      <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                        <span>Entrar no Mundo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              {/* Botão Laços de Repetição */}
              <Link to="/python/lacos" className="group">
                <Card className="h-full hover:shadow-neon transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden border-2 border-python/20 hover:border-python/60 animate-slide-up">
                  <div className="absolute inset-0 bg-gradient-python opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <CardHeader className="text-center pb-4 relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-python rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-glow">
                      <div className="text-3xl">🌀</div>
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-python transition-colors">Laços de Repetição</CardTitle>
                    <CardDescription className="text-sm">Dominando for, while e loops avançados</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4 relative z-10">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gradient-card rounded-lg p-3 border border-border">
                        <div className="text-2xl font-bold text-python">2</div>
                        <p className="text-xs text-muted-foreground">Fases</p>
                      </div>
                    </div>
                    <div className="bg-python/10 rounded-lg p-3 group-hover:bg-python/20 transition-colors duration-300">
                      <div className="flex items-center justify-center gap-2 text-python font-semibold">
                        <span>Entrar no Mundo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Python;