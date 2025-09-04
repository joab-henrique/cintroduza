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
    verificationPosition?: Position;
    requiredCollections?: number;
    requiredDiscards?: number;
    code: string[];
    title: string;
}

const GRID_SIZE = 8;

const itemColorMap: { [key: number]: string } = {
    3: 'bg-red-500',
    4: 'bg-orange-500',
    5: 'bg-purple-500',
    6: 'bg-blue-500',
    9: 'bg-yellow-400',
};

const itemNameMap: { [key: number]: string } = {
    3: 'vermelho',
    4: 'laranja',
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
        code: ["for _ in range(4):", "    if chao == vermelho:", "        baixo()", "    direita()",]
    },
    {
        id: 17,
        title: "Fase 17: A Fuga para a Borda",
        grid: [[3, 3, 3, 0, 0, 0, 0, 0], [0, 0, 0, 3, 3, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
        startPosition: { y: 0, x: 2 },
        targetPath: [{ y: 0, x: 2 }, { y: 0, x: 1 }, { y: 0, x: 0 }, { y: 0, x: 7 }, { y: 7, x: 7 }, { y: 7, x: 0 }],
        code: ["for _ in range(33):", "    if chao == vermelho:", "        esquerda()", "", "cima()", "direita()"]
    },
    {
        id: 18,
        title: "Fase 18: A Dança das Cores",
        grid: [[3, 4, 0, 0, 0, 0, 0, 0], [3, 4, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [3, 4, 0, 0, 0, 0, 0, 0], [3, 4, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
        startPosition: { y: 4, x: 1 },
        targetPath: [{ y: 4, x: 1 }, { y: 4, x: 0 }, { y: 3, x: 0 }, { y: 3, x: 1 }, { y: 3, x: 0 }, { y: 2, x: 0 }, { y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 0 }, { y: 0, x: 0 }, { y: 0, x: 1 }, { y: 0, x: 0 }, { y: 7, x: 0 }],
        code: ["for _ in range(5):", "    if chao == vermelho:", "        direita()", "    if chao == laranja:", "        esquerda()", "    cima()",]
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
        title: "Fase 20: O Início da Coleta",
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
        targetPath: [{ y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }, { y: 1, x: 4 }, { y: 1, x: 5 }],
        targetList: [4, 9, 3], 
        code: [
            "lista = []",
            "",
            "while len(lista) < 3:",
            "    direita()",
            "    if chao != branco:",
            "        lista.append(chao)",
            "",
            "verificar()",
        ]
    },
    {
        id: 21,
        title: "Fase 21: O Último da Fila",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[2][1] = 6;
            grid[2][3] = 3;
            grid[2][5] = 5;
            return grid;
        })(),
        startPosition: { y: 2, x: 0 },
        targetPath: [
            { y: 2, x: 0 }, { y: 2, x: 1 }, { y: 2, x: 2 }, { y: 2, x: 3 }, 
            { y: 2, x: 4 }, { y: 2, x: 5 }
        ],
        verificationPosition: { y: 2, x: 5 },
        targetList: [6, 3],
        requiredCollections: 3,
        requiredDiscards: 1,
        code: [
            "lista = []",
            "",
            "for _ in range(5):",
            "    direita()",
            "    if chao != branco:",
            "        lista.append(chao)",
            "",
            "lista.pop()",
            "",
            "verificar()",
        ]
    },
    {
        id: 22,
        title: "Fase 22: O Intruso",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[4][2] = 9;
            grid[4][4] = 4;
            grid[4][6] = 3;
            return grid;
        })(),
        startPosition: { y: 4, x: 1 },
        targetPath: [{ y: 4, x: 1 }, { y: 4, x: 2 }, { y: 4, x: 3 }, { y: 4, x: 4 }, { y: 4, x: 5 }, { y: 4, x: 6 }],
        verificationPosition: { y: 4, x: 6 },
        targetList: [9, 3],
        requiredCollections: 3,
        requiredDiscards: 1,
        code: [
            "lista = []",
            "",
            "while len(lista) < 3:",
            "    direita()",
            "    if chao != branco:",
            "        lista.append(chao)",
            "",
            "lista.remove(1)",
            "",
            "verificar()",
        ]
    },
    {
        id: 23,
        title: "Fase 23: Mundo Invertido",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[1][1] = 3;
            grid[2][1] = 6;
            grid[3][1] = 9;
            return grid;
        })(),
        startPosition: { y: 0, x: 1 },
        targetPath: [{ y: 0, x: 1 }, { y: 1, x: 1 }, { y: 2, x: 1 }, { y: 3, x: 1 }],
        verificationPosition: { y: 3, x: 1 },
        targetList: [9, 6, 3],
        code: [
            "lista = []",
            "",
            "for _ in range(3):",
            "    baixo()",
            "    if chao != branco:",
            "        lista.append(chao)",
            "",
            "lista.reverse()",
            "",
            "verificar()",
        ]
    },
    {
        id: 24,
        title: "Fase 24: Colocando a Casa em Ordem",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[5][2] = 5;
            grid[5][4] = 3;
            grid[5][6] = 6;
            return grid;
        })(),
        startPosition: { y: 5, x: 1 },
        targetPath: [{ y: 5, x: 1 }, { y: 5, x: 2 }, { y: 5, x: 3 }, { y: 5, x: 4 }, { y: 5, x: 5 }, { y: 5, x: 6 }],
        verificationPosition: { y: 5, x: 6 },
        targetList: [6, 5, 3],
        code: [
            "lista = []",
            "",
            "while len(lista) < 3:",
            "    direita()",
            "    if chao != branco:",
            "        lista.append(chao)",
            "",
            "lista.sort()",
            "",
            "verificar()",
        ]
    },
    {
        id: 25,
        title: "Fase 25: A Ordem Decrescente",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[3][5] = 4;
            grid[3][3] = 9;
            grid[3][1] = 6;
            return grid;
        })(),
        startPosition: { y: 3, x: 0 },
        targetPath: [{ y: 3, x: 0 }, { y: 3, x: 1 }, { y: 3, x: 2 }, { y: 3, x: 3 }, { y: 3, x: 4 }, { y: 3, x: 5 }],
        verificationPosition: { y: 3, x: 5 },
        targetList: [4, 6, 9],
        code: [
            "lista = []",
            "",
            "while len(lista) < 3:",
            "    direita()",
            "    if chao != branco:",
            "        lista.append(chao)",
            "",
            "lista.sort()",
            "lista.reverse()",
            "",
            "verificar()",
        ]
    },
    {
        id: 26,
        title: "Fase 26: A Carga Vermelha Duplicada",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[6][1] = 3;
            grid[6][3] = 6;
            grid[6][5] = 3;
            grid[6][7] = 9;
            return grid;
        })(),
        startPosition: { y: 6, x: 0 },
        targetPath: [{ y: 6, x: 0 }, { y: 6, x: 1 }, { y: 6, x: 2 }, { y: 6, x: 3 }, { y: 6, x: 4 }, { y: 6, x: 5 }, { y: 6, x: 6 }, { y: 6, x: 7 }],
        verificationPosition: { y: 6, x: 7 },
        targetList: [6, 3, 9],
        requiredCollections: 4,
        requiredDiscards: 1,
        code: [
            "lista = []",
            "",
            "for _ in range(7):",
            "    direita()",
            "    if chao != branco:",
            "        lista.append(chao)",
            "",
            "# Na caixa do remove, informe o índice do item",
            "while lista.count(vermelho) > 1:",
            "    lista.remove(lista.index(vermelho))",

            "",
            "verificar()",
        ]
    },
    {
        id: 27,
        title: "Fase 27: Uma Pedra no Meio do Caminho",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[2][1] = 9;
            grid[2][2] = 5;
            grid[2][3] = 3;
            grid[3][3] = 6;
            return grid;
        })(),
        startPosition: { y: 2, x: 0 },
        targetPath: [{ y: 2, x: 0 }, { y: 2, x: 1 }, { y: 2, x: 2 }, { y: 2, x: 3 }, { y: 3, x: 3 }, { y: 2, x: 3 }],
        verificationPosition: { y: 2, x: 3 },
        targetList: [3, 6],
        requiredCollections: 3,
        requiredDiscards: 1,
        code: [
            "lista = []",
            "desvio_ativo = False",
            "",
            "direita()",
            "lista.append(chao)",
            "direita()",
            "",
            "if chao == roxo:",
            "    lista.pop()",
            "direita()",
            "lista.append(chao)",
            "",
            "if chao == vermelho:",
            "    desvio_ativo = True",
            "",
            "if desvio_ativo:",
            "    baixo()",
            "    lista.append(chao)",
            "    cima()",
            "",
            "verificar()",
        ]
    },
    {
        id: 28,
        title: "Fase 28: A Limpeza Seletiva",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[1][1] = 9;   // Amarelo
            grid[1][2] = 5;   // Roxo
            grid[1][3] = 4;   // Laranja
            grid[1][4] = 3;   // Vermelho
            grid[1][5] = 6;   // Azul
            return grid;
        })(),
        startPosition: { y: 1, x: 0 },
        targetPath: [{ y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }, { y: 1, x: 4 }, { y: 1, x: 5 }],
        verificationPosition: { y: 1, x: 5 },
        targetList: [5, 4, 3],
        requiredCollections: 5,
        requiredDiscards: 2,
        code: [
            "lista = []",
            "",
            "for _ in range(5):",
            "    direita()",
            "    lista.append(chao)",
            "",
            "if amarelo in lista:",
            "    lista.remove(0)",
            "    ",
            "if azul in lista:",
            "    lista.remove(len(lista) - 1)",
            "",
            "lista.sort()",
            "",
            "verificar()",
        ]
    },
    {
        id: 29,
        title: "Fase 29: A Lista Perfeita",
        grid: (() => {
            const grid = Array.from({ length: 10 }, () => Array(10).fill(0));
            grid[5][1] = 9;   // Amarelo
            grid[5][2] = 5;   // Roxo
            grid[5][3] = 9;   // Amarelo
            grid[5][4] = 9;   // Amarelo
            grid[5][5] = 5;   // Roxo
            grid[5][6] = 3;   // Vermelho
            grid[5][7] = 4;   // Laranja
            grid[5][8] = 6;   // Azul
            grid[5][9] = 3;   // Vermelho
            grid[5][10] = 5;  // Roxo
            return grid;
        })(),
        startPosition: { x: 0, y: 5 },
        targetPath: [
            { x: 0, y: 5 },
            { x: 1, y: 5 },
            { x: 2, y: 5 },
            { x: 3, y: 5 },
            { x: 4, y: 5 },
            { x: 5, y: 5 },
            { x: 6, y: 5 },
            { x: 7, y: 5 },
        ],
        verificationPosition: { x: 7, y: 5 },
        targetList: [9, 4, 5, 3],
        requiredCollections: 7,
        requiredDiscards: 3,
        code: [
            "lista = []",
            "",
            "for _ in range(7):",
            "    direita()",
            "    if chao != branco:",
            "        lista.append(chao)",
            "",
            "# Na caixa do remove, informe o índice do item",
            "while lista.count(amarelo) > 1:",
            "    lista.remove(lista.index(amarelo))",
            "while lista.count(lista.index(roxo)) > 1:",
            "    lista.remove(lista.index(roxo))",
            "while lista.count(lista.index(vermelho)) > 1:",
            "    lista.remove(lista.index(vermelho))",
            "while lista.count(lista.index(laranja)) > 1:",
            "    lista.remove(lista.index(laranja))",
            "",
            "lista.sort()",
            "",
            "verificar()",
        ]
    },
    {
        id: 30,
        title: "Fase 30: O Encanto da Repetição",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            return grid;
        })(),
        startPosition: { y: 2, x: 0 },
        targetPath: [
            { y: 2, x: 0 }, { y: 2, x: 1 }, { y: 2, x: 2 }, { y: 2, x: 3 }, { y: 2, x: 4 },
            { y: 3, x: 4 }, { y: 4, x: 4 },
            { y: 4, x: 5 }, { y: 4, x: 6 }, { y: 4, x: 7 }
        ],
        code: [
            "def andar_direita():",
            "    direita()",
            "    direita()",
            "    direita()",
            "",
            "andar_direita()",
            "direita()",
            "baixo()",
            "baixo()",
            "andar_direita()",
        ]
    },
    {
        id: 31,
        title: "Fase 31: O Teleporte Funcional",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            return grid;
        })(),
        startPosition: { y: 2, x: 3 },
        targetPath: [
            { y: 2, x: 3 }, { y: 2, x: 2 }, { y: 2, x: 1 }, { y: 2, x: 0 },
            { y: 3, x: 0 }, { y: 4, x: 0 }, { y: 4, x: 7 }, { y: 4, x: 6 }
        ],
        code: [
            "def mover_esquerda(vezes):",
            "    for _ in range(vezes):",
            "        esquerda()",
            "",
            "mover_esquerda(3)",
            "baixo()",
            "baixo()",
            "mover_esquerda(2)",
        ]
    },
    {
        id: 32,
        title: "Fase 32: O Oráculo Numérico",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 3, x: 1 },
        targetPath: [{ y: 3, x: 1 }, { y: 3, x: 2 }, { y: 3, x: 3 }, { y: 3, x: 4 }],
        code: [
            "def passos_para_andar():",
            "    return 3",
            "",
            "def mover(vezes):",
            "    for _ in range(vezes):",
            "        direita()",
            "",
            "quantidade = passos_para_andar()",
            "mover(quantidade)",
        ]
    },
    {
        id: 33,
        title: "Fase 33: A Sentinela Booleana",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[2][2] = 5;
            return grid;
        })(),
        startPosition: { y: 4, x: 2 },
        targetPath: [{ y: 4, x: 2 }, { y: 3, x: 2 }, { y: 3, x: 3 }, { y: 2, x: 3 }, { y: 1, x: 3 }],
        code: [
            "def parede_a_frente():",
            "    if chao_a_frente == roxo:",
            "        return True",
            "    else:",
            "        return False",
            "",
            "for _ in range(4):",
            "    if parede_a_frente():",
            "        direita()",
            "    else:",
            "        cima()",
        ]
    },
    {
        id: 34,
        title: "Fase 34: A Colheita Automatizada",
        grid: [
            [0,0,0,0,0,0,0,0],
            [0,4,4,0,3,3,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ],
        startPosition: { y: 1, x: 0 },
        targetPath: [
            { y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }, { y: 1, x: 4 }, { y: 1, x: 5 }
        ],
        targetList: [4, 4, 3, 3],
        verificationPosition: { y: 1, x: 5 },
        code: [
            "lista = []",
            "",
            "def coletar_dois_itens():",
            "    direita()",
            "    lista.append(chao)",
            "    direita()",
            "    lista.append(chao)",
            "",
            "coletar_dois_itens()",
            "direita()",
            "coletar_dois_itens()",
            "",
            "verificar()",
        ]
    },
    {
        id: 35,
        title: "Fase 35: A Receita do Mago",
        grid: [
            [0,0,0,0,0,0,0,0],
            [0,3,4,6,9,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ],
        startPosition: { y: 1, x: 0 },
        targetPath: [ { y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }, { y: 1, x: 4 } ],
        targetList: [3, 6, 9],
        verificationPosition: { y: 1, x: 4 },
        code: [
            "def pegar_item():",
            "    return [vermelho, amarelo, azul]",
            "",
            "lista = []",
            "",
            "for _ in range(4):",
            "    direita()",
            "    if chao in pegar_item():",
            "        lista.append(chao)",
            "",
            "verificar()",
        ]
    },
    {
        id: 36,
        title: "Fase 36: O Passo Opcional",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 7, x: 1 },
        targetPath: [
            { y: 7, x: 1 },
            { y: 6, x: 1 }, { y: 5, x: 1 }, { y: 4, x: 1 }, { y: 3, x: 1 },
            { y: 3, x: 2 },
            { y: 3, x: 3 },
            { y: 4, x: 3 }, { y: 5, x: 3 }, { y: 6, x: 3 }, { y: 7, x: 3 }, 
            { y: 7, x: 2 }
        ],
        code: [
            "def mover(direcao, passos=1):",
            "    for _ in range(passos):",
            "        if direcao == 'cima':",
            "            cima()",
            "        elif direcao == 'direita':",
            "            direita()",
            "        elif direcao == 'baixo':",
            "            baixo()",
            "        elif direcao == 'esquerda':",
            "            esquerda()",
            "",
            "mover('cima', 4)",
            "mover('direita')",
            "mover('direita')",
            "mover('baixo', 4)",
            "mover('esquerda')",
        ]
    },
    {
        id: 37,
        title: "Fase 37: O Navegador Automático",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 6, x: 2 },
        targetPath: [
            { y: 6, x: 2 }, { y: 6, x: 3 }, { y: 6, x: 4 },
            { y: 5, x: 4 }, { y: 4, x: 4 },
            { y: 4, x: 3 }
        ],
        code: [
            "mapa_do_tesouro = ['direita', 'direita',",
            "                   'cima', 'cima', 'esquerda']",
            "",
            "def seguir_mapa(mapa):",
            "    for direcao in mapa:",
            "        if direcao == 'direita':",
            "            direita()",
            "        elif direcao == 'cima':",
            "            cima()",
            "        elif direcao == 'esquerda':",
            "            esquerda()",
            "",
            "seguir_mapa(mapa_do_tesouro)",
        ]
    },
    {
        id: 38,
        title: "Fase 38: Gasparzinho e o Contador de Passos ",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 1, x: 1 },
        targetPath: [{ y: 1, x: 1 }, { y: 2, x: 1 }, { y: 3, x: 1 }, { y: 4, x: 1 }, { y: 5, x: 1 }],
        code: [
            "passos = 1",
            "",
            "def somar_passos_fixos():",
            "    passos = 3",
            "    return 0;",
            "",
            "def somar_passos(quantidade):",
            "    return quantidade + 2",
            "",
            "passos += somar_passos_fixos()",
            "passos += somar_passos(passos)",
            "",
            "for _ in range(passos):",
            "    baixo()",
        ]
    },
    {
        id: 39,
        title: "Fase 39 - DESAFIO: O Legado do Programador",
        grid: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 3, 0, 4, 0, 9, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 5, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 6, 0, 0, 0, 3, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        startPosition: { y: 1, x: 0 },
        targetPath: [
            { y: 1, x: 0 },
            { y: 1, x: 1 },
            { y: 2, x: 1 }, { y: 3, x: 1 },
            { y: 2, x: 1 }, { y: 1, x: 1 },
            { y: 1, x: 2 }, { y: 1, x: 3 },
            { y: 1, x: 4 }, { y: 1, x: 5 },
            { y: 2, x: 5 }, { y: 3, x: 5 }, { y: 4, x: 5 }, { y: 5, x: 5 },
            { y: 5, x: 4 }, { y: 5, x: 3 }, { y: 5, x: 2 }, { y: 5, x: 1 }
        ],
        targetList: [3, 4, 9, 3, 6],
        verificationPosition: { y: 5, x: 1 },
        code: [
            "tesouros_verdadeiros = [vermelho, laranja,",
            "                        amarelo, azul]",
            "mapa = [['direita', 1], ['baixo', 2],",
            "        ['direita', 2], ['direita', 2],",
            "        ['baixo', 4], ['esquerda', 4]]",
            "lista = []",
            "",
            "def buscar_tesouro(direcao, passos):",
            "    for _ in range(passos):",
            "        if direcao == 'direita': direita()",
            "        elif direcao == 'baixo': baixo()",
            "        elif direcao == 'esquerda': esquerda()",
            "    ",
            "    if chao in tesouros_verdadeiros:",
            "        lista.append(chao)",
            "    else:",
            "        for _ in range(passos):",
            "            if direcao == 'direita': esquerda()",
            "            elif direcao == 'baixo': cima()",
            "            elif direcao == 'esquerda': direita()",
            "",
            "for instrucao in mapa:",
            "    direcao_mapa = instrucao[0]",
            "    passos_mapa = instrucao[1]",
            "    buscar_tesouro(direcao_mapa, passos_mapa)",
            "",
            "verificar()",
        ]
    },
    {
        id: 40,
        title: "Fase 40: O Eco no Corredor",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[3][6] = 5;
            return grid;
        })(),
        startPosition: { y: 3, x: 1 },
        targetPath: [{ y: 3, x: 1 }, { y: 3, x: 2 }, { y: 3, x: 3 }, { y: 3, x: 4 }, { y: 3, x: 5 }, { y: 3, x: 6 }],
        code: [
            "def andar():",
            "    if chao != roxo:",
            "        direita()",
            "        andar()",
            "",
            "andar()",
        ]
    },
    {
        id: 41,
        title: "Fase 41: A Contagem Regressiva",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 5, x: 1 },
        targetPath: [{ y: 5, x: 1 }, { y: 5, x: 2 }, { y: 5, x: 3 }, { y: 5, x: 4 }, { y: 5, x: 5 }],
        code: [
            "def mover_recursivo(passos):",
            "    if passos == 0:",
            "        return",
            "",
            "    direita()",
            "    mover_recursivo(passos - 1)",
            "",
            "mover_recursivo(4)",
        ]
    },
    {
        id: 42,
        title: "Fase 42: O Zigue-Zague Eterno",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[1][5] = 3;
            return grid;
        })(),
        startPosition: { y: 4, x: 2 },
        targetPath: [
            { y: 4, x: 2 }, { y: 3, x: 2 }, { y: 3, x: 3 },
            { y: 2, x: 3 }, { y: 2, x: 4 },
            { y: 1, x: 4 }, { y: 1, x: 5 }
        ],
        code: [
            "def zig():",
            "    cima()",
            "    if chao != vermelho:",
            "        zag()",
            "",
            "def zag():",
            "    direita()",
            "    if chao != vermelho:",
            "        zig()",
            "",
            "zig()",
        ]
    },
    {
        id: 43,
        title: "Fase 43: A Matrioska de Dados",
        grid: [[0,0,0,0,0,0,0,0], [0,3,4,5,6,9,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]],
        startPosition: { y: 1, x: 0 },
        targetPath: [{ y: 1, x: 0 }, { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }, { y: 1, x: 4 }],
        targetList: [3, 4, 5],
        verificationPosition: { y: 1, x: 4 },
        code: [
            "lista = []",
            "",
            "def construir_lista(n):",
            "    direita()",
            "    if n > 0:",
            "        lista.append(chao)",
            "        construir_lista(n - 1)",
            "",
            "construir_lista(3)",
            "",
            "verificar()",
        ]
    },
    {
        id: 44,
        title: "Fase 44: A Exploração da Sabedoria Absoluta",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[5][2] = 5;
            grid[4][2] = 4;
            grid[5][3] = 6;
            return grid;
        })(),
        startPosition: { y: 6, x: 2 },
        targetPath: [
            { y: 6, x: 2 }, { y: 5, x: 2 },
            { y: 4, x: 2 }, { y: 5, x: 2 },
            { y: 5, x: 3 }, { y: 5, x: 2 }
        ],
        targetList: [4, 6],
        verificationPosition: { y: 5, x: 2 },
        code: [
            "lista = []",
            "",
            "def explorar():",
            "    if chao == laranja or chao == azul:",
            "        lista.append(chao)",
            "",
            "    if chao == roxo:",
            "        cima(); explorar(); baixo()",
            "        direita(); explorar(); esquerda()",
            "",
            "cima()",
            "explorar()",
            "verificar()",
        ]
    },
    {
        id: 45,
        title: "Fase 45: O Caminho de Fibonacci",
        grid: Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)),
        startPosition: { y: 1, x: 1 },
        targetPath: [
            { y: 1, x: 1 }, { y: 1, x: 2 }, { y: 1, x: 3 }, { y: 1, x: 4 },
            { y: 2, x: 4 }, { y: 3, x: 4 }, { y: 4, x: 4 },
            { y: 4, x: 3 }, { y: 4, x: 2 }
        ],
        code: [
            "def fibonacci(n):",
            "    if n <= 1:",
            "        return n",
            "    else:",
            "        return fibonacci(n-1) + fibonacci(n-2)",
            "",
            "total_de_passos = fibonacci(6)",
            "",
            "for i in range(total_de_passos):",
            "    if i < 3:",
            "        direita()",
            "    elif i < 6:",
            "        baixo()",
            "    else:",
            "        esquerda()",
        ]
    },
    {
        id: 46,
        title: "Fase 46 - DESAFIO: A Prova do Mestre Recursivo",
        grid: (() => {
            const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
            grid[3][1] = 5; grid[3][3] = 4; grid[3][5] = 6; 
            return grid;
        })(),
        startPosition: { y: 3, x: 1 }, // Começa na estação da Haste A
        targetPath: [
            { y: 3, x: 1 }, // Posição inicial (Haste A)
            // Passo 1: Mover de A para C
            { y: 3, x: 2 }, { y: 3, x: 3 }, { y: 3, x: 4 }, { y: 3, x: 5 },
            // Passo 2: Mover de A para B
            { y: 3, x: 4 }, { y: 3, x: 3 }, { y: 3, x: 2 }, { y: 3, x: 1 },
            { y: 3, x: 2 }, { y: 3, x: 3 },
            // Passo 3: Mover de C para B
            { y: 3, x: 4 }, { y: 3, x: 5 },
            { y: 3, x: 4 }, { y: 3, x: 3 },
            // Passo 4: Mover de A para C
            { y: 3, x: 2 }, { y: 3, x: 1 },
            { y: 3, x: 2 }, { y: 3, x: 3 }, { y: 3, x: 4 }, { y: 3, x: 5 },
            // Passo 5: Mover de B para A
            { y: 3, x: 4 }, { y: 3, x: 3 },
            { y: 3, x: 2 }, { y: 3, x: 1 },
            // Passo 6: Mover de B para C
            { y: 3, x: 2 }, { y: 3, x: 3 },
            { y: 3, x: 4 }, { y: 3, x: 5 },
            // Passo 7: Mover de A para C
            { y: 3, x: 4 }, { y: 3, x: 3 }, { y: 3, x: 2 }, { y: 3, x: 1 },
            { y: 3, x: 2 }, { y: 3, x: 3 }, { y: 3, x: 4 }, { y: 3, x: 5 }
        ],
        targetList: [5, 6, 5, 4, 6, 4, 5, 6, 4, 5, 4, 6, 5, 6],
        verificationPosition: { y: 3, x: 5 },
        code: [
            "def mover(n, A, B, C):",
            "    if n > 0:",
            "        mover(n-1, A, C, B)",
            "        mover(n-1, B, A, C)",
            "",
            "mover(3, 'A', 'B', 'C')",
            "",
            "# O roxo é A, laranja é B, azul é C",
            "# Ao chegar em um ponto, colete-o,",
            "   independentemente se for início ou",
            "   fim do movimento, inclusive o spawn.",
            "# Ao chegar no final, use verificar()",
        ]
    }
];


interface GameBoardProps {
    startingId?: number;
    onlyLoopWorld?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ startingId = 1, onlyLoopWorld = false }) => {
    let shownLevels = onlyLoopWorld ? levels.filter(l => l.id >= 10) : levels;
    if (shownLevels.length === 0) {
        shownLevels = onlyLoopWorld ? levels.filter(l => l.id >= 10) : levels;
        if(shownLevels.length === 0) shownLevels = levels;
    }

    const findInitialIndex = () => {
        const index = shownLevels.findIndex(l => l.id === startingId);
        return index !== -1 ? index : 0;
    };

    const [currentLevel, setCurrentLevel] = useState(findInitialIndex);

    const level = shownLevels[currentLevel];

    const [playerPosition, setPlayerPosition] = useState<Position>(level.startPosition);
    const [playerPath, setPlayerPath] = useState<Position[]>([level.startPosition]);
    const [gameState, setGameState] = useState<'playing' | 'success' | 'error'>('playing');
    const [inventory, setInventory] = useState<(number | string)[]>([]);

    const isListLevel =                            // Isso define as fases que possuem listas
    [
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,    // Fases de listas
        34, 35, 39,                                // Fases de funções
        43, 44, 46                                 // Fase de recursão
    ].includes(level.id);; 

    const [collectCount, setCollectCount] = useState(0);
    const [discardCount, setDiscardCount] = useState(0);

    const resetGame = useCallback(() => {
        setPlayerPosition(level.startPosition);
        setPlayerPath([level.startPosition]);
        setInventory([]);
        setCollectCount(0);
        setDiscardCount(0);
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
            setCollectCount(c => c + 1);
        }
    };

    const handlePop = () => {
        if (gameState !== 'playing') return;
        if (inventory.length > 0) {
            setDiscardCount(c => c + 1);
        }
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
        setDiscardCount(c => c + 1);
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

        if (level.requiredCollections && collectCount < level.requiredCollections) {
            setGameState('error');
            setTimeout(() => resetGame(), 800);
            return;
        }
        if (level.requiredDiscards && discardCount < level.requiredDiscards) {
            setGameState('error');
            setTimeout(() => resetGame(), 800);
            return;
        }

        if (level.verificationPosition) {
            const atVerificationSpot = 
                playerPosition.x === level.verificationPosition.x &&
                playerPosition.y === level.verificationPosition.y;

            if (!atVerificationSpot) {
                setGameState('error');
                setTimeout(() => resetGame(), 800);
                return;
            }
        }

        const isCorrect = JSON.stringify(inventory) === JSON.stringify(level.targetList);
        
        if (isCorrect) {
            setGameState('success');
            setTimeout(() => {
                if (level.id !== 46 && currentLevel < shownLevels.length - 1) {
                    setCurrentLevel(lvl => lvl + 1);
                } else {
                    alert("Parabéns! Você completou a última fase disponível e provou ser um verdadeiro Mestre Recursivo!");
                }
            }, 800);
        } else {
            setGameState('error');
            setTimeout(() => resetGame(), 800);
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

            const newPlayerPath = [...playerPath, newPos];
            setPlayerPath(newPlayerPath);

            const currentMoveIndex = newPlayerPath.length - 1;

            const isPathCorrect =
                level.targetPath[currentMoveIndex] &&
                newPos.x === level.targetPath[currentMoveIndex].x &&
                newPos.y === level.targetPath[currentMoveIndex].y;

            if (!isPathCorrect) {
                setGameState('error');
                setTimeout(() => resetGame(), 400);
                return newPos;
            }

            if (!isListLevel && newPlayerPath.length === level.targetPath.length) {
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
        let cellClasses = 'bg-game-path'; // Cor de fundo padrão (branco)

        // Determine a cor base da célula
        if (itemColorMap[cellValue]) {
            cellClasses = itemColorMap[cellValue];
        } else if (cellValue === 10) { // Se houver outros tipos de chão específicos
            cellClasses = 'bg-cyan-400';
        }

        // Aplica a cor do caminho percorrido pelo jogador apenas nas células passadas e garante que não é a posição atual
        if (isPlayerPath(col, row) && !(playerPosition.x === col && playerPosition.y === row) && !isListLevel) {
            cellClasses = 'bg-blue-500';
        }

        // Se a célula for a posição atual do jogador, dá o destaque
        if (playerPosition.x === col && playerPosition.y === row) {
            return `${cellClasses} bg-game-player shadow-glow scale-110`;
        }

        return cellClasses;
    };

    const getWorldColorClass = (levelId: number): string => {
        if (levelId >= 40) return 'bg-gradient-dark'
        if (levelId >= 30) return 'bg-gradient-c';      // Funções
        if (levelId >= 20) return 'bg-gradient-java';   // Listas
        if (levelId >= 10) return 'bg-gradient-python'; // Laços
        return 'bg-gradient-primary';                   // Algoritmos (Padrão)
    };

    return (
        <div className="min-h-screen bg-gradient-animated bg-[length:400%_400%] animate-gradient-shift p-4">
            <div className="max-w-6xl mx-auto">
                 <header className="text-center mb-8">
                     <h1 className="text-5xl font-bold text-foreground mb-2 drop-shadow-lg">CIntroduza - Python</h1>
                     <p className="text-xl text-muted-foreground mb-4">Desenvolva lógica de programação de forma interativa!</p>
                     <div className={`inline-block ${getWorldColorClass(level.id)} text-primary-foreground px-4 py-2 rounded-lg font-semibold shadow-glow`}>
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
                                <h3 className="text-lg font-semibold text-card-foreground mb-4">Sua Lista:</h3>
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