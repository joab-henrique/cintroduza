import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Lock, CheckCircle, Star, Trophy, Target, Zap } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// THIS PAGE IS OBSOLETE FOR NOW!!!

const Level = () => {
  const { language, level } = useParams();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  // Mock data for demonstration - Obsolete
  const levelData = {
    algoritmos: {
      title: "🎯 Algoritmos Básicos",
      description: "Aprenda os fundamentos da programação e lógica computacional",
      phases: 8,
      emoji: "🚀",
      color: "bg-gradient-primary"
    },
    lacos: {
      title: "🔄 Laços de Repetição",
      description: "Domine estruturas de repetição: for, while e loops avançados",
      phases: 6,
      emoji: "🌀",
      color: "bg-gradient-python"
    },
    listas: {
      title: "📋 Listas e Arrays",
      description: "Manipule listas e estruturas de dados como um ninja",
      phases: 7,
      emoji: "📊",
      color: "bg-gradient-java"
    },
    funcoes: {
      title: "⚡ Funções",
      description: "Crie e otimize funções eficientemente",
      phases: 5,
      emoji: "🛠️",
      color: "bg-gradient-c"
    },
    recursao: {
      title: "🌪️ Recursão",
      description: "Entenda a magia dos algoritmos recursivos",
      phases: 4,
      emoji: "🧙‍♂️",
      color: "bg-gradient-gaming"
    },
    estruturas: {
      title: "🗃️ Tuplas & Dicionários",
      description: "Explore estruturas de dados avançadas",
      phases: 6,
      emoji: "💎",
      color: "bg-gradient-dark"
    }
  };

  const currentLevel = levelData[level as keyof typeof levelData];
  
  if (!currentLevel) {
    return <div>Nível não encontrado</div>;
  }

  // All stages always released (for now)
  const phases = Array.from({ length: currentLevel.phases }, (_, i) => ({
    number: i + 1,
    title: `Boss Battle ${i + 1}`,
    description: `Desafio épico ${i + 1} de ${currentLevel.title}`,
    xp: '',
    isCompleted: false,
    isCurrent: false,
    isLocked: false
  }));

  const handlePhaseClick = (phaseNumber: number) => {
    setSelectedPhase(phaseNumber);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <header className={`${currentLevel.color} text-white py-16 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-20 w-20 h-20 bg-primary-glow rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link to={`/${language}`}>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105">
                <ArrowLeft className="w-5 h-5 mr-2" />
                🏠 Voltar aos Mundos
              </Button>
            </Link>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center animate-pulse-glow shadow-neon">
                <div className="text-5xl">{currentLevel.emoji}</div>
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2">{currentLevel.title}</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                  <span className="text-sm font-semibold">🎮 WORLD {Object.keys(levelData).indexOf(level!) + 1}</span>
                </div>
              </div>
            </div>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {currentLevel.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <div className="font-bold">{currentLevel.phases} Boss Battles</div>
                <div className="text-sm opacity-80">Desafios épicos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Star className="w-8 h-8 mx-auto mb-2 text-blue-300" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Target className="w-8 h-8 mx-auto mb-2 text-red-300" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Zap className="w-8 h-8 mx-auto mb-2 text-green-300" />
                {/* Coming soon, here's something about progress and XP */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Battle Selection */}
      <section className="py-20 bg-gradient-dark text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-gaming bg-clip-text text-transparent">
            ⚔️ Selecione sua Batalha
          </h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {phases.map((phase, index) => (
              <Button
                key={phase.number}
                variant="phase"
                size="lg"
                className={`relative min-w-20 h-20 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-neon ${selectedPhase === phase.number ? 'ring-4 ring-primary/50 scale-110' : ''}`}
                onClick={() => handlePhaseClick(phase.number)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-2xl font-bold">{phase.number}</div>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Phase Details */}
      {selectedPhase && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-neon border-2 border-primary/30 bg-gradient-card animate-slide-up">
                <CardHeader className="text-center bg-gradient-primary text-white rounded-t-lg">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                      <div className="text-3xl">{currentLevel.emoji}</div>
                    </div>
                    <div>
                      <CardTitle className="text-4xl mb-2">
                        Boss Battle {selectedPhase}
                      </CardTitle>
                      <CardDescription className="text-xl text-white/90">
                        {phases[selectedPhase - 1]?.title}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-12 text-center space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                      <Trophy className="w-12 h-12 mx-auto mb-3 text-primary" />
                      <h3 className="font-bold text-lg mb-2">Recompensa</h3>
                      <div className="text-2xl font-bold text-primary">{phases[selectedPhase - 1]?.xp} XP</div>
                    </div>
                    
                    <div className="bg-python/10 rounded-xl p-6 border border-python/20">
                      <Star className="w-12 h-12 mx-auto mb-3 text-python" />
                      <h3 className="font-bold text-lg mb-2">Dificuldade</h3>
                      <div className="text-lg font-bold text-python">
                        {selectedPhase <= 2 ? 'Iniciante' : selectedPhase <= 4 ? 'Médio' : 'Difícil'}
                      </div>
                    </div>
                    
                    <div className="bg-java/10 rounded-xl p-6 border border-java/20">
                      <Target className="w-12 h-12 mx-auto mb-3 text-java" />
                      <h3 className="font-bold text-lg mb-2">Tipo</h3>
                      <div className="text-lg font-bold text-java">Boss Battle</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-dark text-white rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6">🎯 Objetivos da Missão</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">1</span>
                        </div>
                        <span>Resolver o algoritmo principal</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-python rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <span>Otimizar a solução</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-java rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">3</span>
                        </div>
                        <span>Passar em todos os testes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-c-lang rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">4</span>
                        </div>
                        <span>Conquistar pontuação máxima</span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/${language}/${level}/fase/${selectedPhase}`}>
                    <Button variant="hero" size="lg" className="w-full max-w-md mx-auto text-xl py-6">
                      <Play className="w-6 h-6 mr-3" />
                      🚀 Entrar na Batalha!
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

  {/* ... estatísticas e progresso... */}

      <Footer />
    </div>
  );
};

export default Level;