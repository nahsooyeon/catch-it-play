'use client';
import { cn } from '@/app/utils/tailwind';
import Button from '@/components/Button';
import React, { useState } from 'react';

interface ClientWordSearchDivProps {
	initialBoard: string[][];
}

const ClientWordSearchDiv: React.FC<ClientWordSearchDivProps> = ({ initialBoard }) => {
	const [isSelecting, setIsSelecting] = useState(false);
	const [startPos, setStartPos] = useState<{ x: number; y: number; } | null>(null);
	const [endPos, setEndPos] = useState<{ x: number; y: number; } | null>(null);

	const handleInteractionStart = (row: number, col: number) => {
		setIsSelecting(true);
		setStartPos({ x: col, y: row });
		setEndPos({ x: col, y: row });
	};

	const handleInteractionMove = (e: React.TouchEvent | React.MouseEvent) => {
		if (!isSelecting || !startPos) return;

		const touch = 'touches' in e ? e.touches[0] : null;
		const clientX = touch?.clientX || (e as React.MouseEvent).clientX;
		const clientY = touch?.clientY || (e as React.MouseEvent).clientY;

		const target = document.elementFromPoint(clientX, clientY) as HTMLElement;
		if (target?.dataset.row && target?.dataset.col) {
			const row = parseInt(target.dataset.row, 10);
			const col = parseInt(target.dataset.col, 10);
			setEndPos({ x: col, y: row });
		}

		if ('preventDefault' in e) e.preventDefault();
	};

	const handleInteractionEnd = () => {
		setIsSelecting(false);

		console.log('startPos', startPos);
		console.log('endPos', endPos);
		// 시작점과 끝점 사이를 잇는 선을 그린다.

		setEndPos(null);
		setStartPos(null);

	};

	const isValidLine = (dx: number, dy: number) => {
		return (
			dx === 0 ||
			dy === 0 ||
			Math.abs(dx) === Math.abs(dy) // Horizontal, vertical, or diagonal
		);
	};

	const isCellHighlighted = (row: number, col: number) => {
		if (!startPos || !endPos) return false;
		const dx = endPos.x - startPos.x;
		const dy = endPos.y - startPos.y;
		if (!isValidLine(dx, dy)) return false;

		const steps = Math.max(Math.abs(dx), Math.abs(dy));

		for (let step = 0; step <= steps; step++) {
			const x = startPos.x + Math.round((dx / steps) * step);
			const y = startPos.y + Math.round((dy / steps) * step);
			if (x === col && y === row) return true;
		}
		return false;
	};

	return (
		<div
			className={cn("grid size-[100svw] md:size-[36rem] justify-items-center items-top select-none",
				"grid-cols-[repeat(8,_12.5svw)] grid-rows-[repeat(8,_12.5svw)]",
				"md:grid-cols-8 md:grid-rows-8"
			)}
			onMouseLeave={handleInteractionEnd}
		>
			{initialBoard.map((row, rowIndex) =>
				row.map((letter, colIndex) => (
					<Button
						key={`${rowIndex}-${colIndex}`}
						data-row={rowIndex}
						data-col={colIndex}
						className={`${isCellHighlighted(rowIndex, colIndex) ? 'bg-blue-200 ' : 'bg-white'
							}`}
						onMouseDown={() => handleInteractionStart(rowIndex, colIndex)}
						onMouseEnter={(e) => handleInteractionMove(e)}
						onMouseUp={handleInteractionEnd}
						onTouchStart={() => handleInteractionStart(rowIndex, colIndex)}
						onTouchMove={handleInteractionMove}
						onTouchEnd={handleInteractionEnd}
					>
						{letter}
					</Button>
				))
			)}
		</div>
	);
};

export default ClientWordSearchDiv;
