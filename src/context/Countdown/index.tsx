// CountdownContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface CountdownContextProps {
	isCountdown: number | null;
	count: number;
	defaultCount: number;
	start: () => void;
	stop: () => void;
	reset: () => void;
	setCount: React.Dispatch<React.SetStateAction<number>>;
}

const CountdownContext = createContext<CountdownContextProps | undefined>(undefined);

export const CountdownProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
	const countdown = 180000; // Default countdown value
	const interval = 100; // Default interval value

	const intervalRef = useRef<number>(-1);
	const [count, setCount] = useState<number>(countdown);
	const [isCountdown, setIsCountdown] = useState<number | null>(null);

	useEffect(() => {
		if (isCountdown === null) {
			return;
		}

		intervalRef.current = window.setInterval(() => setCount((prev) => prev - interval), interval);

		return () => {
			window.clearInterval(intervalRef.current);
		};
	}, [interval, isCountdown]);

	useEffect(() => {
		if (count <= 0) {
			setIsCountdown(null);
			setCount(0);
		}
	}, [count]);

	const start = () => setIsCountdown(interval);
	const stop = () => { setIsCountdown(null); };
	const reset = () => {
		setCount(countdown);
		setIsCountdown(null);
	};


	return (
		<CountdownContext.Provider value={{ isCountdown, count, start, stop, reset, setCount, defaultCount: countdown }}>
			{children}
		</CountdownContext.Provider>
	);
};

export const useCountdownContext = (): CountdownContextProps => {
	const context = useContext(CountdownContext);
	if (!context) {
		throw new Error("useCountdownContext must be used within a CountdownProvider");
	}
	return context;
};
