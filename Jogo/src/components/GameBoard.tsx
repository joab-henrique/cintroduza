import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Home } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right';
type Position = { x: number; y: number };

interface GameLevel {
  id: number;
  grid: number[][];
  startPosition: Position;
  targetPath: Position[];
  code: string[];
  title: string;
}

const GRID_SIZE = 8;

// Geração de obstáculos e caminhos alternativos
function generateLevelWithAlternatives() {
  // Caminho correto
  const targetPath = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 3 }
  ];
  // Gera grid: tudo começa como caminho alternativo (2)
  let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(2));
  // Marca o caminho correto
  targetPath.forEach(pos => {
    grid[pos.y][pos.x] = 1;
  });
  return {
    id: 1,
    title: "Movimentos Básicos",
    grid,
    startPosition: { x: 1, y: 1 },
    targetPath,
    code: [
      "direita()",
      "direita()",
      "baixo()",
      "baixo()"
    ]
  };
}

const levels: GameLevel[] = [generateLevelWithAlternatives(),
  // Exemplo de próxima fase
  {
    id: 2,
    title: "Fase 2: Zig-Zag",
    grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)),
    startPosition: { x: 0, y: 0 },
    targetPath: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }
    ],
    code: ["direita()", "baixo()", "direita()", "baixo()"]
  }
];

const GameBoard: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState<Position>(levels[0].startPosition);
  const [playerPath, setPlayerPath] = useState<Position[]>([levels[0].startPosition]);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'error'>('playing');

  const level = levels[currentLevel];

  const resetGame = useCallback(() => {
    setPlayerPosition(level.startPosition);
    setPlayerPath([level.startPosition]);
    setGameState('playing');
  }, [level.startPosition]);

  useEffect(() => {
    resetGame();
  }, [currentLevel, resetGame]);

  const movePlayer = useCallback((direction: Direction) => {
    if (gameState !== 'playing') return;

    setPlayerPosition(prev => {
      const newPos = { ...prev };
      switch (direction) {
        case 'up':
          newPos.y = Math.max(0, prev.y - 1);
          break;
        case 'down':
          newPos.y = Math.min(GRID_SIZE - 1, prev.y + 1);
          break;
        case 'left':
          newPos.x = Math.max(0, prev.x - 1);
          break;
        case 'right':
          newPos.x = Math.min(GRID_SIZE - 1, prev.x + 1);
          break;
      }

      const newPlayerPath = [...playerPath, newPos];
      setPlayerPath(newPlayerPath);

      // Caminho correto: deve seguir a ordem do targetPath
      const nextStepIndex = playerPath.length;
      const isCorrect =
        level.targetPath[nextStepIndex] &&
        newPos.x === level.targetPath[nextStepIndex].x &&
        newPos.y === level.targetPath[nextStepIndex].y;

      if (!isCorrect) {
        setTimeout(() => resetGame(), 200);
        return newPos; // move, mas reinicia
      }

      // Vitória: chegou ao fim do caminho correto
      if (newPlayerPath.length === level.targetPath.length) {
        setTimeout(() => {
          if (currentLevel < levels.length - 1) {
            setCurrentLevel(lvl => lvl + 1);
          } else {
            setGameState('success');
          }
        }, 400);
      }

      return newPos;
    });
  }, [gameState, level.targetPath, playerPath, resetGame, currentLevel, levels.length]);

  const goToHome = () => {
    window.location.href = '/';
  };

  const isTargetPosition = (x: number, y: number) => {
    return level.targetPath.some(pos => pos.x === x && pos.y === y);
  };

  const isAlternativePath = (x: number, y: number) => {
    return level.grid[y][x] === 2;
  };

  const isPlayerPath = (x: number, y: number) => {
    return playerPath.some(pos => pos.x === x && pos.y === y);
  };

  // Adiciona suporte ao teclado para as setas
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          movePlayer('right');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, gameState]);

  return (
    <div className="min-h-screen bg-gradient-animated bg-[length:400%_400%] animate-gradient-shift p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-2 drop-shadow-lg">
            CIntroduza - Python
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Faça o pontinho seguir o caminho usando comandos de código!
          </p>
          <div className="inline-block bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold shadow-glow">
            Fase {level.id}
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Game Board */}
          <Card className="p-6 bg-gradient-card border-border shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-card-foreground">
                {level.title}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToHome}
                  className="border-border hover:bg-secondary"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetGame}
                  className="border-border hover:bg-secondary"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-1 aspect-square bg-game-grid p-4 rounded-lg">
              {Array.from({ length: GRID_SIZE }).map((_, row) =>
                Array.from({ length: GRID_SIZE }).map((_, col) => (
                  <div
                    key={`${row}-${col}`}
                    className={`aspect-square rounded-sm border border-game-grid/30 transition-all duration-300
                      ${playerPosition.x === col && playerPosition.y === row
                        ? 'bg-game-player shadow-glow scale-110'
                        : isPlayerPath(col, row)
                        ? 'bg-game-player/50'
                        : 'bg-game-path'
                    }`}
                  />
                ))
              )}
            </div>

            {/* Game Status */}
            <div className="mt-4 text-center">
              {gameState === 'success' && (
                <p className="text-game-success font-semibold text-lg">
                  🎉 Parabéns! Você concluiu todas as fases!
                </p>
              )}
              {gameState === 'error' && (
                <p className="text-game-error font-semibold text-lg">
                  ❌ Ops! Tente novamente.
                </p>
              )}
              {gameState === 'playing' && (
                <p className="text-muted-foreground">
                  Siga o caminho azul usando os controles!
                </p>
              )}
            </div>
          </Card>

          {/* Code and Controls */}
          <div className="space-y-6">
            {/* Code Display */}
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Código para Executar:
              </h3>
              <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm">
                {level.code.map((line, index) => (
                  <div
                    key={index}
                    className="py-1 px-2 rounded text-card-foreground"
                  >
                    {index + 1}. {line}
                  </div>
                ))}
              </div>
            </Card>

            {/* Controls */}
            <Card className="p-6 bg-gradient-card border-border shadow-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Controles:
              </h3>
              <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
                <div></div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => movePlayer('up')}
                  disabled={gameState !== 'playing'}
                  className="border-border hover:bg-secondary h-12"
                >
                  <ChevronUp className="w-6 h-6" />
                </Button>
                <div></div>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => movePlayer('left')}
                  disabled={gameState !== 'playing'}
                  className="border-border hover:bg-secondary h-12"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => movePlayer('down')}
                  disabled={gameState !== 'playing'}
                  className="border-border hover:bg-secondary h-12"
                >
                  <ChevronDown className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => movePlayer('right')}
                  disabled={gameState !== 'playing'}
                  className="border-border hover:bg-secondary h-12"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Use as setas para mover o pontinho e seguir o código!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameBoard;