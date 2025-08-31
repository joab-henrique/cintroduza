import React, { useState, useEffect, useCallback} from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Home, CheckCircle } from 'lucide-react';
import { Zap, Trash2, ArrowDownUp, RefreshCw, MinusCircle } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right';
type Position = { x: number; y: number };

interface GameLevel {
    id: number;
    grid: number[][];
    startPosition: Position;
    targetPath: Position[];
    targetList?: (number | string)[];
    code: string[];
    title: string;
}

const GRID_SIZE = 8;

const itemColorMap: { [key: number]: string } = {
    3: 'bg-red-500',
    4: 'bg-orange-500', // Verde agora é Laranja
    5: 'bg-purple-500',
    6: 'bg-blue-500',
    9: 'bg-yellow-400',
};

const itemNameMap: { [key: number]: string } = {
    3: 'vermelho',
    4: 'laranja', // Verde agora é Laranja
    5: 'roxo',
    6: 'azul',
    9: 'amarelo',
};

const levels: GameLevel[] = [
    {
        id: 1,
        title: "Fase 1: Corrida Reta",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { x: 0, y: 0 },
        targetPath: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }],
        code: ["direita()", "direita()", "direita()", "direita()"]
    },
    {
        id: 2,
        title: "Fase 2: O Despertar do Caminho",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { x: 1, y: 1 },
        targetPath: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }],
        code: ["direita()", "direita()", "baixo()", "baixo()"]
    },
    {
        id: 3,
        title: "Fase 3: O Labirinto do Zigue-Zague",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { x: 0, y: 0 },
        targetPath: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
        code: ["direita()", "baixo()", "direita()", "baixo()"]
    },
    {
        id: 4,
        title: "Fase 4: O Quadrado Mágico",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { x: 4, y: 4 },
        targetPath: [{ x: 4, y: 4 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 4, y: 4 }],
        code: ["esquerda()", "cima()", "direita()", "baixo()"]
    },
    {
        id: 5,
        title: "Fase 5: O Desvio do Explorador",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { x: 6, y: 1 },
        targetPath: [{ x: 6, y: 1 }, { x: 6, y: 2 }, { x: 5, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 3, y: 3 }],
        code: ["baixo()", "esquerda()", "esquerda()", "baixo()", "esquerda()"]
    },
    {
        id: 6,
        title: "Fase 6: O Portal Dimensional",
        grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)),
        startPosition: { x: 0, y: 4 },
        targetPath: [{ x: 0, y: 4 }, { x: 7, y: 4 }, { x: 7, y: 3 }, { x: 0, y: 3 }, { x: 0, y: 2 }],
        code: ["esquerda()", "cima()", "direita()", "cima()"]
    },
    {
        id: 7,
        title: "Fase 7: O Quadrado Lógico",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 3, x: 1 },
        targetPath: [{ y: 3, x: 1 }, { y: 4, x: 1 }, { y: 4, x: 2 }, { y: 3, x: 2 }, { y: 3, x: 3 },],
        code: ["desvio_ativo = True", "baixo()", "", "if desvio_ativo:", "    direita()", "    cima()", "    direita()", "    desvio_ativo = False", "else:", "    baixo()",]
    },
    {
        id: 8,
        title: "Fase 8: O Não-Quadrado Lógico",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 3, x: 1 },
        targetPath: [{ y: 3, x: 1 }, { y: 4, x: 1 }, { y: 5, x: 1 },],
        code: ["desvio_ativo = False", "baixo()", "", "if desvio_ativo:", "    direita()", "    cima()", "    direita()", "    desvio_ativo = False", "else:", "    baixo()",]
    },
    {
        id: 9,
        title: "Fase 9: O Volta-Volta Lógico",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 1, x: 1 },
        targetPath: [{ y: 1, x: 1 }, { y: 1, x: 2 }, { y: 2, x: 2 }, { y: 1, x: 2 }, { y: 1, x: 1 }],
        code: ["rota = 'A'", "direita()", "", "if rota == 'A':", "    baixo()", "    rota = 'B'", "elif rota == 'B':", "    cima()", "    rota = 'C'", "else:", "    esquerda()", "", "if rota == 'A':", "    baixo()", "    rota = 'B'", "elif rota == 'B':", "    cima()", "    rota = 'C'", "else:", "    esquerda()", "", "if rota == 'A':", "    baixo()", "    rota = 'B'", "elif rota == 'B':", "    cima()", "    rota = 'C'", "else:", "    esquerda()"]
    },
    {
        id: 10,
        title: "Fase 10: O Loop do Tapete Vermelho",
        grid: (() => { const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)); for (let i = 0; i < 5; i++) grid[i][2] = 3; grid[5][2] = 4; return grid; })(),
        startPosition: { x: 2, y: 0 },
        targetPath: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }],
        code: ["while chao == vermelho:", "    baixo()"]
    },
    {
        id: 11,
        title: "Fase 11: O Desafio do Tapete Arco-Íris",
        grid: (() => { const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)); for (let i = 0; i < 5; i++) grid[4][i] = 3; grid[4][5] = 4; return grid; })(),
        startPosition: { x: 0, y: 4 },
        targetPath: [{ x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 5, y: 3 }],
        code: ["while chao == vermelho:", "    direita()", "cima()"]
    },
    {
        id: 12,
        title: "Fase 12: O Portal do Desvio",
        grid: (() => { const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)); grid[0][0] = 4; for (let i = 1; i < 6; i++) grid[i][0] = 3; grid[6][0] = 4; for (let i = 1; i < 6; i++) grid[6][i] = 3; grid[6][6] = 4; return grid; })(),
        startPosition: { x: 0, y: 0 },
        targetPath: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }],
        code: ["while chao == vermelho:", "    baixo()", "direita()", "while chao == vermelho:", "    direita()",]
    },
    {
        id: 13,
        title: "Fase 13: O Zigue-Zague Infinito",
        grid: (() => { const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)); for (let i = 0; i < 7; i++) grid[1 * i + 1][i] = 4; for (let i = 0; i < 7; i++) grid[1 * i + 1][i + 1] = 3; return grid; })(),
        startPosition: { x: 0, y: 0 },
        targetPath: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 7 }],
        code: ["while chao == vermelho:", "    baixo()", "direita()", "while chao == vermelho:", "    baixo()", "direita()", "... (repete até o fim do zigue-zague)"]
    },
    {
        id: 14,
        title: "Fase 14: A Escadaria Tortuosa",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 1, x: 4 },
        targetPath: [{ y: 1, x: 4 }, { y: 2, x: 4 }, { y: 2, x: 3 }, { y: 3, x: 3 }, { y: 3, x: 2 }, { y: 4, x: 2 }, { y: 4, x: 1 }, { y: 4, x: 2 }, { y: 5, x: 2 }, { y: 5, x: 3 }, { y: 6, x: 3 }, { y: 5, x: 3 }, { y: 5, x: 4 }, { y: 4, x: 4 }, { y: 4, x: 5 }],
        code: ["for _ in range(3):", "    baixo()", "    esquerda()", "", "for _ in range(2):", "    direita()", "    baixo()", "", "for _ in range(2):", "    cima()", "    direita()"]
    },
    {
        id: 15,
        title: "Fase 15: Atravessando as Bordas",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 7, x: 0 },
        targetPath: [{ y: 7, x: 0 }, { y: 7, x: 1 }, { y: 7, x: 2 }, { y: 7, x: 3 }, { y: 7, x: 4 }, { y: 6, x: 4 }, { y: 6, x: 5 }, { y: 6, x: 6 }, { y: 6, x: 7 }, { y: 6, x: 0 }, { y: 5, x: 0 }, { y: 5, x: 1 }, { y: 5, x: 2 }, { y: 5, x: 3 }, { y: 5, x: 4 }, { y: 4, x: 4 }, { y: 4, x: 5 }, { y: 4, x: 6 }, { y: 4, x: 7 }, { y: 4, x: 0 }, { y: 3, x: 0 }],
        code: ["for _ in range(4):", "    for _ in range(4):", "        direita()", "    cima()",]
    },
    {
        id: 16,
        title: "Fase 16: O Desvio Diagonal",
        grid: [[0, 3, 0, 0, 0, 0, 0, 0], [0, 0, 3, 0, 0, 0, 0, 0], [0, 0, 0, 3, 0, 0, 0, 0], [0, 0, 0, 0, 3, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
        startPosition: { y: 0, x: 0 },
        targetPath: [{ y: 0, x: 0 }, { y: 0, x: 1 }, { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 2, x: 2 }, { y: 2, x: 3 }, { y: 3, x: 3 }, { y: 3, x: 4 }],
        code: ["for i in range(4):", "    if chao == vermelho:", "        baixo()", "    direita()",]
    },
    {
        id: 17,
        title: "Fase 17: A Fuga para a Borda",
        grid: [[3, 3, 3, 0, 0, 0, 0, 0], [0, 0, 0, 3, 3, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
        startPosition: { y: 0, x: 2 },
        targetPath: [{ y: 0, x: 2 }, { y: 0, x: 1 }, { y: 0, x: 0 }, { y: 0, x: 7 }, { y: 7, x: 7 }, { y: 7, x: 0 }],
        code: ["for i in range(33):", "    if chao == vermelho:", "        esquerda()", "", "cima()", "direita()"]
    },
    {
        id: 18,
        title: "Fase 18: A Dança das Cores",
        grid: [[3, 4, 0, 0, 0, 0, 0, 0], [3, 4, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [3, 4, 0, 0, 0, 0, 0, 0], [3, 4, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
        startPosition: { y: 4, x: 1 },
        targetPath: [{ y: 4, x: 1 }, { y: 4, x: 0 }, { y: 3, x: 0 }, { y: 3, x: 1 }, { y: 3, x: 0 }, { y: 2, x: 0 }, { y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 0 }, { y: 0, x: 0 }, { y: 0, x: 1 }, { y: 0, x: 0 }, { y: 7, x: 0 }],
        code: ["for i in range(5):", "    if chao == vermelho:", "        direita()", "    if chao == laranja:", "        esquerda()", "    cima()",]
    },
    {
		id: 19,
		title: "Fase 19 - DESAFIO: O Labirinto Modulado",
		grid: [
			[0, 0, 4, 0, 0, 0, 0, 0],
			[0, 5, 4, 0, 0, 0, 0, 0],
			[0, 4, 0, 0, 0, 0, 0, 0],
			[0, 4, 5, 0, 0, 0, 0, 0],
			[0, 0, 4, 0, 0, 0, 0, 0],
			[0, 5, 4, 0, 0, 0, 0, 0],
			[0, 4, 0, 0, 0, 0, 0, 0],
			[0, 4, 0, 0, 0, 0, 0, 0]
		],
		startPosition: {y: 7, x: 1},
		targetPath: [
			{y: 7, x: 1},
			{y: 6, x: 1},
			{y: 5, x: 1},
			{y: 5, x: 2},
			{y: 4, x: 2},
			{y: 3, x: 2},
			{y: 3, x: 1},
			{y: 2, x: 1},
			{y: 1, x: 1},
			{y: 1, x: 2},
			{y: 0, x: 2}
		],
		code: [
			"passo = 0",
			"while passo < 10:",
			"    if chao == roxo:",
			"        if passo % 2 == 0:",
			"            direita()",
			"        else:",
			"            esquerda()",
			"    else:",
			"        cima()",
			"    passo += 1",
		]
	},
    {
        id: 20,
        title: "Fase 20: A Lista de Compras",
        grid: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 4, 0, 9, 0, 3, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        startPosition: { y: 1, x: 0 },
        targetPath: [{ y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }, { y: 1, x: 4 }, { y: 1, x: 5 }, { y: 1, x: 6 }, { y: 1, x: 7 }],
        targetList: [4, 9, 3], 
        code: [
            "lista = []",
            "// Mova-se até um item e use append()",
            "// Repita para todos os itens...",
			"// Explore os outros comandos",
            "// No final, clique em verificar()",
        ]
    },
    {
        id: 21,
        title: "Fase 21: O Item Indesejado",
        grid: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 3, 4, 5, 6, 10, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
        startPosition: { y: 1, x: 0 },
        targetPath: [{ y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }, { y: 1, x: 4 }, { y: 1, x: 5 }],
        targetList: [3, 4, 6],
        code: ["1. Colete todos os itens.", "2. Sua lista ficará: [vermelho, verde, roxo, azul]", "3. O item 'roxo' está no índice 2 e é indesejado.", "4. Use o comando pop(índice) para removê-lo.", "5. Vá para a SAÍDA e verifique sua lista final!",]
    }
];

interface GameBoardProps {
    initialLevel?: number;
    onlyLoopWorld?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ initialLevel = 0, onlyLoopWorld = false }) => {
    let shownLevels = onlyLoopWorld ? levels.filter(l => l.id >= 10) : levels;
    if (shownLevels.length === 0) {
        shownLevels = onlyLoopWorld ? levels.filter(l => l.id >= 10) : levels;
        if(shownLevels.length === 0) shownLevels = levels;
    }


    const [currentLevel, setCurrentLevel] = useState(0);
    const level = shownLevels[currentLevel];

    const [playerPosition, setPlayerPosition] = useState<Position>(level.startPosition);
    const [playerPath, setPlayerPath] = useState<Position[]>([level.startPosition]);
    const [gameState, setGameState] = useState<'playing' | 'success' | 'error'>('playing');
    const [inventory, setInventory] = useState<(number | string)[]>([]);

    const isListLevel = level.id >= 20;

    const resetGame = useCallback(() => {
        setPlayerPosition(level.startPosition);
        setPlayerPath([level.startPosition]);
        setInventory([]);
        setGameState('playing');
    }, [level.startPosition]);

    useEffect(() => {
        resetGame();
    }, [currentLevel, resetGame]);

    const handleAppend = () => {
        if (gameState !== 'playing') return;
        const currentTile = level.grid[playerPosition.y][playerPosition.x];
        if (itemColorMap[currentTile]) {
            setInventory(prev => [...prev, currentTile]);
        }
    };

    const handlePop = () => {
        if (gameState !== 'playing') return;
        setInventory(prev => prev.slice(0, -1));
    };
    
    const handleRemove = () => {
        if (gameState !== 'playing' || inventory.length === 0) return;

        const indexStr = window.prompt("Qual índice você quer remover?", "0");
        if (indexStr === null) return;

        const index = parseInt(indexStr, 10);

        if (isNaN(index) || index < 0 || index >= inventory.length) {
            alert("Índice inválido! Por favor, insira um número entre 0 e " + (inventory.length - 1));
            return;
        }

        setInventory(prev => prev.filter((_, i) => i !== index));
    };

    const handleSort = () => {
        if (gameState !== 'playing') return;
        setInventory(prev =>
            [...prev].sort((a, b) =>
                itemNameMap[a as number].localeCompare(itemNameMap[b as number], 'pt-BR')
            )
        );
    };



    const handleReverse = () => {
        if (gameState !== 'playing') return;
        setInventory(prev => [...prev].reverse());
    };
    
    const handleVerify = () => {
        if (gameState !== 'playing') return;
        const currentTile = level.grid[playerPosition.y][playerPosition.x];
        if (currentTile !== 10) return;

        const isCorrect = JSON.stringify(inventory) === JSON.stringify(level.targetList);
        
        if (isCorrect) {
            setGameState('success');
            setTimeout(() => {
                if (currentLevel < shownLevels.length - 1) {
                    setCurrentLevel(lvl => lvl + 1);
                }
            }, 800);
        } else {
            setGameState('error');
            setTimeout(() => setGameState('playing'), 800);
        }
    };

    const movePlayer = useCallback((direction: Direction) => {
        if (gameState !== 'playing') return;

        setPlayerPosition(prev => {
            let newPos = { ...prev };
            switch (direction) {
                case 'up': newPos.y = (prev.y - 1 + GRID_SIZE) % GRID_SIZE; break;
                case 'down': newPos.y = (prev.y + 1) % GRID_SIZE; break;
                case 'left': newPos.x = (prev.x - 1 + GRID_SIZE) % GRID_SIZE; break;
                case 'right': newPos.x = (prev.x + 1) % GRID_SIZE; break;
            }

            if (isListLevel) {
                 setPlayerPath(prevPath => [...prevPath, newPos]);
                 return newPos;
            }

            const newPlayerPath = [...playerPath, newPos];
            setPlayerPath(newPlayerPath);
            const nextStepIndex = playerPath.length;
            const isPathCorrect =
                level.targetPath[nextStepIndex] &&
                newPos.x === level.targetPath[nextStepIndex].x &&
                newPos.y === level.targetPath[nextStepIndex].y;

            if (!isPathCorrect) {
                setGameState('error');
                setTimeout(() => resetGame(), 400);
                return newPos;
            }

            if (newPlayerPath.length === level.targetPath.length) {
                setGameState('success');
                setTimeout(() => {
                    if (currentLevel < shownLevels.length - 1) {
                        setCurrentLevel(lvl => lvl + 1);
                    }
                }, 400);
            }
            return newPos;
        });
    }, [gameState, level, playerPath, resetGame, currentLevel, shownLevels.length, isListLevel]);

    const goToHome = () => { window.location.href = '/'; };

    const isPlayerPath = (x: number, y: number) => playerPath.some(pos => pos.x === x && pos.y === y);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            switch (event.key) {
                case 'ArrowUp': event.preventDefault(); movePlayer('up'); break;
                case 'ArrowDown': event.preventDefault(); movePlayer('down'); break;
                case 'ArrowLeft': event.preventDefault(); movePlayer('left'); break;
                case 'ArrowRight': event.preventDefault(); movePlayer('right'); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer, gameState]);

    const renderGridCell = (row: number, col: number) => {
        const cellValue = level.grid[row][col];
        let bgColor = 'bg-game-path';

        if (itemColorMap[cellValue]) {
            bgColor = itemColorMap[cellValue];
        } else if (cellValue === 10) {
            bgColor = 'bg-cyan-400';
        }
        
        if (isPlayerPath(col, row) && !isListLevel) {
             bgColor = 'bg-blue-500';
        }
        
        if (playerPosition.x === col && playerPosition.y === row) {
            return 'bg-game-player shadow-glow scale-110';
        }
        return bgColor;
    };

    return (
        <div className="min-h-screen bg-gradient-animated bg-[length:400%_400%] animate-gradient-shift p-4">
            <div className="max-w-6xl mx-auto">
                 <header className="text-center mb-8">
                     <h1 className="text-5xl font-bold text-foreground mb-2 drop-shadow-lg">CIntroduza - Python</h1>
                     <p className="text-xl text-muted-foreground mb-4">Aprenda listas de forma interativa!</p>
                     <div className="inline-block bg-gradient-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold shadow-glow">
                         Fase {level.id}
                     </div>
                 </header>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card className="p-6 bg-gradient-card border-border shadow-card">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-card-foreground">{level.title}</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={goToHome} className="border-border hover:bg-secondary"><Home className="w-4 h-4 mr-2" />Voltar</Button>
                                    <Button variant="outline" size="sm" onClick={resetGame} className="border-border hover:bg-secondary"><RotateCcw className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-8 gap-1 aspect-square bg-game-grid p-4 rounded-lg">
                                {Array.from({ length: GRID_SIZE }).map((_, row) =>
                                    Array.from({ length: GRID_SIZE }).map((_, col) => (
                                        <div key={`${row}-${col}`} className={`aspect-square rounded-sm border border-game-grid/30 transition-all duration-300 ${renderGridCell(row, col)}`} />
                                    ))
                                )}
                            </div>
                        </Card>
                        
                        {isListLevel && (
                            <Card className="p-6 bg-gradient-card border-border shadow-card">
                                <h3 className="text-lg font-semibold text-card-foreground mb-4">Inventário (Sua Lista):</h3>
                                <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-2 min-h-[60px]">
                                    <span className="font-mono text-muted-foreground">lista = [</span>
                                    {inventory.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full ${itemColorMap[item as number] || 'bg-gray-400'}`}></div>
                                            <span className="text-xs font-mono text-muted-foreground mt-1">{index}</span>
                                        </div>
                                    ))}
                                    <span className="font-mono text-muted-foreground">]</span>
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 bg-gradient-card border-border shadow-card">
                            <h3 className="text-lg font-semibold text-card-foreground mb-4">Código para Executar:</h3>
                            <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm" style={{ whiteSpace: 'pre' }}>
                                {level.code.map((line, index) => <div key={index} className="py-1 px-2 rounded text-card-foreground">{`${index + 1}. ${line}`}</div>)}
                            </div>
                        </Card>
                        
                        <Card className="p-6 bg-gradient-card border-border shadow-card">
                             <h3 className="text-lg font-semibold text-card-foreground mb-4">Controles:</h3>
                            {isListLevel ? (
                                <div>
                                    <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto mb-6">
                                        <div></div>
                                        <Button variant="outline" size="lg" onClick={() => movePlayer('up')} disabled={gameState !== 'playing'} className="border-border hover:bg-secondary h-12"><ChevronUp className="w-6 h-6" /></Button>
                                        <div></div>
                                        <Button variant="outline" size="lg" onClick={() => movePlayer('left')} disabled={gameState !== 'playing'} className="border-border hover:bg-secondary h-12"><ChevronLeft className="w-6 h-6" /></Button>
                                        <Button variant="outline" size="lg" onClick={() => movePlayer('down')} disabled={gameState !== 'playing'} className="border-border hover:bg-secondary h-12"><ChevronDown className="w-6 h-6" /></Button>
                                        <Button variant="outline" size="lg" onClick={() => movePlayer('right')} disabled={gameState !== 'playing'} className="border-border hover:bg-secondary h-12"><ChevronRight className="w-6 h-6" /></Button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        <Button onClick={handleAppend} disabled={gameState !== 'playing'} className="flex items-center gap-2 bg-green-600 hover:bg-green-700"> <Zap className="w-4 h-4"/> append() </Button>
                                        <Button onClick={handlePop} disabled={gameState !== 'playing'} className="flex items-center gap-2 bg-red-600 hover:bg-red-700"> <Trash2 className="w-4 h-4"/> pop() </Button>
                                        <Button onClick={handleSort} disabled={gameState !== 'playing'} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"> <ArrowDownUp className="w-4 h-4"/> sort() </Button>
                                        <Button onClick={handleReverse} disabled={gameState !== 'playing'} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"> <RefreshCw className="w-4 h-4"/> reverse() </Button>
                                        <Button onClick={handleRemove} disabled={gameState !== 'playing'} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"> <MinusCircle className="w-4 h-4"/> remove() </Button>
                                        <Button onClick={handleVerify} disabled={gameState !== 'playing'} className="md:col-start-2 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black"> <CheckCircle className="w-4 h-4"/> verificar() </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
                                     <div></div>
                                     <Button variant="outline" size="lg" onClick={() => movePlayer('up')} disabled={gameState !== 'playing'} className="border-border hover:bg-secondary h-12"><ChevronUp className="w-6 h-6" /></Button>
                                     <div></div>
                                     <Button variant="outline" size="lg" onClick={() => movePlayer('left')} disabled={gameState !== 'playing'} className="border-border hover:bg-secondary h-12"><ChevronLeft className="w-6 h-6" /></Button>
                                     <Button variant="outline" size="lg" onClick={() => movePlayer('down')} disabled={gameState !== 'playing'} className="border-border hover:bg-secondary h-12"><ChevronDown className="w-6 h-6" /></Button>
                                     <Button variant="outline" size="lg" onClick={() => movePlayer('right')} disabled={gameState !== 'playing'} className="border-border hover:bg-secondary h-12"><ChevronRight className="w-6 h-6" /></Button>
                                </div>
                            )}
                             <p className="mt-4 text-center text-sm text-muted-foreground">
                                {isListLevel ? "Mova-se pelo grid e use os comandos para manipular sua lista!" : "Use as setas para mover o pontinho e seguir o código!"}
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;