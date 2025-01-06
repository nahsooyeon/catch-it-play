"use client";

import { create } from "zustand";

interface GameStoreProps {
	level: number | null;
	points: number;
	setLevel: (level: number) => void;
	addPoints: (points: number) => void;
	reset: () => void;
}

export const GameInfoStore = create<GameStoreProps>((set, get) => ({
	level: 1,
	points: 0,
	setLevel: (level: number) => set({ level }),
	addPoints: (points: number) => {
		set({ points: get().points + points });
	},
	reset: () => set({ level: null, points: 0 }),

}));