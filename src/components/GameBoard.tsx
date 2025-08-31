
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

// Fases customizadas
const levels: GameLevel[] = [
	// 1. direita, direita, direita, direita
	{
		id: 1,
		title: "Fase 1: Corrida Reta",
		grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
		startPosition: { x: 0, y: 0 },
		targetPath: [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 }
		],
		code: ["direita()", "direita()", "direita()", "direita()"]
	},
	// 2. baixo, baixo, direita, direita
	{
		id: 2,
		title: "Fase 2: O Despertar do Caminho",
		grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
		startPosition: { x: 1, y: 1 },
		targetPath: [
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 3, y: 1 },
			{ x: 3, y: 2 },
			{ x: 3, y: 3 }
		],
		code: ["direita()", "direita()", "baixo()", "baixo()"]
	},
	// 3. zig-zag
	{
		id: 3,
		title: "Fase 3: O Labirinto do Zigue-Zague",
		grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
		startPosition: { x: 0, y: 0 },
		targetPath: [
			{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }
		],
		code: ["direita()", "baixo()", "direita()", "baixo()"]
	},
	// 4. esquerda, cima, direita, baixo
	{
		id: 4,
		title: "Fase 4: O Quadrado Mágico",
		grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
		startPosition: { x: 4, y: 4 },
		targetPath: [
			{ x: 4, y: 4 },
			{ x: 3, y: 4 },
			{ x: 3, y: 3 },
			{ x: 4, y: 3 },
			{ x: 4, y: 4 }
		],
		code: ["esquerda()", "cima()", "direita()", "baixo()"]
	},
	// 5. baixo, esquerda, esquerda, baixo, esquerda
	{
		id: 5,
		title: "Fase 5: O Desvio do Explorador",
		grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
		startPosition: { x: 6, y: 1 },
		targetPath: [
			{ x: 6, y: 1 },
			{ x: 6, y: 2 },
			{ x: 5, y: 2 },
			{ x: 4, y: 2 },
			{ x: 4, y: 3 },
			{ x: 3, y: 3 }
		],
		code: ["baixo()", "esquerda()", "esquerda()", "baixo()", "esquerda()"]
	},
	// 6. atravessa de um lado para o outro
	{
		id: 6,
		title: "Fase 6: O Portal Dimensional",
		grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)),
		startPosition: { x: 0, y: 4 },
		targetPath: [
			{ x: 0, y: 4 }, // começa na borda esquerda
			{ x: 7, y: 4 }, // atravessa para a borda direita
			{ x: 7, y: 3 },
			{ x: 0, y: 3 }, // atravessa para a borda esquerda
			{ x: 0, y: 2 }
		],
		code: ["esquerda()", "cima()", "direita()", "cima()"]
	},
	{
		id: 7,
		title: "Fase 7: O Quadrado Lógico",
		grid: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		startPosition: {'y': 3, 'x': 1},
		targetPath: [
			{'y': 3, 'x': 1},
			{'y': 4, 'x': 1},
			{'y': 4, 'x': 2},
			{'y': 3, 'x': 2},
			{'y': 3, 'x': 3},
		],
		code: [
			"desvio_ativo = True",
			"baixo()",
			"",
			"if desvio_ativo:",
			"    direita()",
			"    cima()",
			"    direita()",
			"    desvio_ativo = False",
			"else:",
			"    baixo()",
		]
	},
	{
		id: 8,
		title: "Fase 8: O Não-Quadrado Lógico",
		grid: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		startPosition: {'y': 3, 'x': 1},
		targetPath: [
			{'y': 3, 'x': 1},
			{'y': 4, 'x': 1},
			{'y': 5, 'x': 1},
		],
		code: [
			"desvio_ativo = False",
			"baixo()",
			"",
			"if desvio_ativo:",
			"    direita()",
			"    cima()",
			"    direita()",
			"    desvio_ativo = False",
			"else:",
			"    baixo()",
		]
	},
	{
		id: 9,
		title: "Fase 9: O Volta-Volta Lógico",
		grid: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		startPosition: {y: 1, x: 1},
		targetPath: [
			{y: 1, x: 1},
			{y: 1, x: 2},
			{y: 2, x: 2},
			{y: 1, x: 2},
			{y: 1, x: 1}
		],
		code: [
			"rota = 'A'",
			"direita()",
			"",
			"if rota == 'A':",
			"    baixo()",
			"    rota = 'B'",
			"elif rota == 'B':",
			"    cima()",
			"    rota = 'C'",
			"else:",
			"    esquerda()",
			"",
			"if rota == 'A':",
			"    baixo()",
			"    rota = 'B'",
			"elif rota == 'B':",
			"    cima()",
			"    rota = 'C'",
			"else:",
			"    esquerda()",
			"",
			"if rota == 'A':",
			"    baixo()",
			"    rota = 'B'",
			"elif rota == 'B':",
			"    cima()",
			"    rota = 'C'",
			"else:",
			"    esquerda()"
		]
	},

	// Início dos Loops (10+):
	{
		id: 10,
		title: "Fase 10: O Loop do Tapete Vermelho",
		grid: (() => {
			const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
			for (let i = 0; i < 5; i++) grid[i][2] = 3; // vermelho
			grid[5][2] = 4; // verde
			return grid;
		})(),
		startPosition: { x: 2, y: 0 },
		targetPath: [
			{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }
		],
		code: ["while chao == vermelho:", "        baixo()"]
	},
	{
		id: 11,
		title: "Fase 11: O Desafio do Tapete Arco-Íris",
		grid: (() => {
			const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
			for (let i = 0; i < 5; i++) grid[4][i] = 3; // vermelho
			grid[4][5] = 4; // verde
			return grid;
		})(),
		startPosition: { x: 0, y: 4 },
		targetPath: [
			{ x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 5, y: 3 }
		],
		code: ["while chao == vermelho:", "        direita()", "cima()"]
	},
	{
		id: 12,
		title: "Fase 12: O Portal do Desvio",
		grid: (() => {
			const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
			grid[0][0] = 4; // verde inicial
			for (let i = 1; i < 6; i++) grid[i][0] = 3; // vermelho
			grid[6][0] = 4; // verde
			for (let i = 1; i < 6; i++) grid[6][i] = 3; // vermelho
			grid[6][6] = 4; // verde final
			return grid;
		})(),
		startPosition: { x: 0, y: 0 },
		targetPath: [
			{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }
		],
		code: ["while chao == vermelho:", "        baixo()", "direita()", "while chao == vermelho:", "        direita()",]
	},
	{
		id: 13,
		title: "Fase 13: O Zigue-Zague Infinito",
		grid: (() => {
			const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
			for (let i = 0; i < 7; i++) grid[1 * i + 1][i] = 4; // verde
			for (let i = 0; i < 7; i++) grid[1 * i + 1][i + 1] = 3; // vermelho
			return grid;
		})(),
		startPosition: { x: 0, y: 0 },
		targetPath: [
			{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 7, y: 7 }
		],
		code: [
			"while chao == vermelho:",
			"        baixo()",
			"direita()",
			"while chao == vermelho:",
			"        baixo()",
			"direita()",
			"... (repete até o fim do zigue-zague)"
		]
	},
	{
		id: 14,
		title: "Fase 14: A Escadaria Tortuosa",
		grid: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		startPosition: {'y': 1, 'x': 4},
		targetPath: [
			{'y': 1, 'x': 4},
			{'y': 2, 'x': 4}, {'y': 2, 'x': 3},
			{'y': 3, 'x': 3}, {'y': 3, 'x': 2},
			{'y': 4, 'x': 2}, {'y': 4, 'x': 1},
			{'y': 4, 'x': 2}, {'y': 5, 'x': 2},
			{'y': 5, 'x': 3}, {'y': 6, 'x': 3},
			{'y': 5, 'x': 3}, {'y': 5, 'x': 4},
			{'y': 4, 'x': 4}, {'y': 4, 'x': 5}
		],
		code: [
			"for _ in range(3):",
			"    baixo()",
			"    esquerda()",
			"",
			"for _ in range(2):",
			"    direita()",
			"    baixo()",
			"",
			"for _ in range(2):",
			"    cima()",
			"    direita()"
		]
	},
	{
		id: 15,
		title: "Fase 15: Atravessando as Bordas",
		grid: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		startPosition: {y: 7, x: 0},
		targetPath: [
			{y: 7, x: 0},
			{y: 7, x: 1}, {y: 7, x: 2}, {y: 7, x: 3}, {y: 7, x: 4},
			{y: 6, x: 4},
			{y: 6, x: 5}, {y: 6, x: 6}, {y: 6, x: 7}, {y: 6, x: 0},
			{y: 5, x: 0},
			{y: 5, x: 1}, {y: 5, x: 2}, {y: 5, x: 3}, {y: 5, x: 4},
			{y: 4, x: 4},
			{y: 4, x: 5}, {y: 4, x: 6}, {y: 4, x: 7}, {y: 4, x: 0},
			{y: 3, x: 0}
		],
		code: [
			"for _ in range(4):",
			"    for _ in range(4):",
			"        direita()",
			"    cima()",
		]
	},
	{
		id: 16,
		title: "Fase 16: O Desvio Diagonal",
		grid: [
			[0, 3, 0, 0, 0, 0, 0, 0],
			[0, 0, 3, 0, 0, 0, 0, 0],
			[0, 0, 0, 3, 0, 0, 0, 0],
			[0, 0, 0, 0, 3, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		startPosition: {y: 0, x: 0},
		targetPath: [
			{y: 0, x: 0},
			{y: 0, x: 1},
			{y: 1, x: 1},
			{y: 1, x: 2},
			{y: 2, x: 2},
			{y: 2, x: 3},
			{y: 3, x: 3},
			{y: 3, x: 4}
		],
		code: [
			"for i in range(4):",
			"    if chao == vermelho:",
			"        baixo()",
			"    direita()",
		]
	},
	{
		id: 17,
		title: "Fase 17: A Extrema Repetição?",
		grid: [
			[3, 3, 3, 0, 0, 0, 0, 0],
			[0, 0, 0, 3, 3, 3, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		],
		startPosition: {y: 0, x: 2},
		targetPath: [
			{y: 0, x: 2},
			{y: 0, x: 1},
			{y: 0, x: 0},
			{y: 0, x: 7},
			{y: 7, x: 7},
			{y: 7, x: 0}
		],
		code: [
			"for _ in range(200):",
			"    if chao == vermelho:",
			"        esquerda()",
			"",
			"cima()",
			"direita()"
		]
	},
	{
		id: 19,
		title: "Fase 19: O Labirinto Modulado",
		grid: [
			[0, 0, 4, 0, 0, 0, 0, 0],
			[0, 0, 4, 0, 0, 0, 0, 0],
			[0, 0, 4, 0, 0, 0, 0, 0],
			[0, 0, 4, 5, 0, 0, 0, 0],
			[0, 0, 5, 0, 0, 0, 0, 0],
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
	}
];

interface GameBoardProps {
	initialLevel?: number;
	onlyLoopWorld?: boolean;
}
const GameBoard: React.FC<GameBoardProps> = ({ initialLevel = 0, onlyLoopWorld = false }) => {
		// Corrigir filtro: se não houver fases, usar todas
		let shownLevels = onlyLoopWorld ? levels.filter(l => l.id >= 10) : levels.filter(l => l.id < 10);
		// fallback: se filtro não retornar nada, mostra todas as fases
		if (shownLevels.length === 0) shownLevels = [levels[0]];
		const [currentLevel, setCurrentLevel] = useState(0);
		const [playerPosition, setPlayerPosition] = useState<Position>(shownLevels[0].startPosition);
		const [playerPath, setPlayerPath] = useState<Position[]>([shownLevels[0].startPosition]);
		const [gameState, setGameState] = useState<'playing' | 'success' | 'error'>('playing');

		// Se não houver fases válidas, mostrar mensagem amigável
		if (!shownLevels.length) {
			return <div className="p-8 text-center text-lg text-red-600">Nenhuma fase disponível para este mundo.</div>;
		}

		const level = shownLevels[currentLevel];

	const resetGame = useCallback(() => {
		setPlayerPosition(level.startPosition);
		setPlayerPath([level.startPosition]);
		setGameState('playing');
	}, [level.startPosition]);

	useEffect(() => {
		resetGame();
	}, [currentLevel, resetGame, onlyLoopWorld]);

	const movePlayer = useCallback((direction: Direction) => {
		if (gameState !== 'playing') return;

				setPlayerPosition(prev => {
					let newPos = { ...prev };

					switch (direction) {
						case 'up':
							newPos.y = (prev.y - 1 + GRID_SIZE) % GRID_SIZE;
							break;
						case 'down':
							newPos.y = (prev.y + 1) % GRID_SIZE;
							break;
						case 'left':
							newPos.x = (prev.x - 1 + GRID_SIZE) % GRID_SIZE;
							break;
						case 'right':
							newPos.x = (prev.x + 1) % GRID_SIZE;
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

					// Fase 8: enquanto vermelho, direita; ao sair do vermelho, cima
					if (level.id === 8) {
						// Se está no verde e acabou de sair do vermelho
						if (level.grid[prev.y][prev.x] === 3 && level.grid[newPos.y][newPos.x] === 4) {
							// Permite um movimento para cima após sair do vermelho
							// (o jogador deve apertar cima manualmente, não avança automaticamente)
							// Não avança de fase ainda
							return newPos;
						}
						// Se já está no verde e foi para cima, avança de fase
						if (level.grid[prev.y][prev.x] === 4 && direction === 'up') {
							setTimeout(() => {
								if (currentLevel < shownLevels.length - 1) {
									setCurrentLevel(lvl => lvl + 1);
								} else {
									setGameState('success');
								}
							}, 400);
							return newPos;
						}
					}

							// Para a fase 7, encerra ao chegar no verde. Para 9 e 10, só encerra ao completar o caminho.
							if (level.id === 7 && level.grid[newPos.y][newPos.x] === 4) {
								setTimeout(() => {
									if (currentLevel < shownLevels.length - 1) {
										setCurrentLevel(lvl => lvl + 1);
									} else {
										setGameState('success');
									}
								}, 400);
								return newPos;
							}

					if (!isCorrect) {
						setTimeout(() => resetGame(), 200);
						return newPos; // move, mas reinicia
					}

					// Vitória: chegou ao fim do caminho correto
					if (newPlayerPath.length === level.targetPath.length) {
						setTimeout(() => {
							if (currentLevel < shownLevels.length - 1) {
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
																				? 'bg-blue-500'
																				: shownLevels[currentLevel].grid[row][col] === 3
																				? 'bg-red-500'
																				: shownLevels[currentLevel].grid[row][col] === 4
																				? 'bg-green-500'
																				: 'bg-game-path'
																			}`}
																	/>
								))
							)}
						</div>

						{/* Game Status */}
						<div className="mt-4 text-center">
									{gameState === 'success' && (
										<>
											{onlyLoopWorld || currentLevel !== 8 ? (
												<p className="text-game-success font-semibold text-lg">
												🎉 Parabéns! Você concluiu todas as fases!
												</p>
											) : (
												<div className="flex flex-col items-center gap-4">
													<p className="text-game-success font-semibold text-lg">
														🎉 Parabéns! Você concluiu os Algoritmos Básicos!
													</p>
													<a href="/python/lacos">
														<button className="bg-gradient-python text-white px-6 py-2 rounded-lg shadow-lg font-bold hover:scale-105 transition-all">
															Avançar para Laços de Repetição
														</button>
													</a>
												</div>
											)}
										</>
									)}
							{gameState === 'error' && (
								<p className="text-game-error font-semibold text-lg">
									❌ Ops! Tente novamente.
								</p>
							)}
							{gameState === 'playing' && (
								<p className="text-muted-foreground">
									Execute o código usando os controles!
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
									<div className="bg-muted/20 rounded-lg p-4 font-mono text-sm" style={{ whiteSpace: 'pre' }}>
										{level.code.map((line, index) => (
											<div
												key={index}
												className="py-1 px-2 rounded text-card-foreground"
											>
												{`${index + 1}. ${line}`}
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
