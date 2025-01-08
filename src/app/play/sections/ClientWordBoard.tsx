'use client';
import { BoardResDto, positionType } from '@/app/dto/board.res.dto';
import { cn } from '@/app/utils/tailwind';
import React, { MouseEvent, useCallback, useMemo, useState } from 'react';

interface ClientWordSearchDivProps {
	initialBoardData: BoardResDto;
}

const ClientWordSearchDiv: React.FC<ClientWordSearchDivProps> = ({ initialBoardData }) => {
	const [isSelecting, setIsSelecting] = useState(false);
	const [startPos, setStartPos] = useState<positionType | null>(null);
	const [endPos, setEndPos] = useState<positionType | null>(null);
	const { grid, words } = initialBoardData;

	const memoizedWords = useMemo(() => {
		const list = words.map((word) => {
			return word.word;
		});
		const correctedList: string[] = [];

		return { list, words, correctedList };

	}, [words]);


	const handleInteractionStart = (row: number, col: number) => {
		setIsSelecting(true);
		setStartPos({ x: col, y: row });
		setEndPos({ x: col, y: row });
	};

	const checkIsWordCorrect = (start: positionType, end: positionType) => {

		const answer = memoizedWords.words.find((word) => {
			const isStartCorrect = word.start.x === start.x && word.start.y === start.y;
			const isEndCorrect = word.end.x === end.x && word.end.y === end.y;
			return isStartCorrect && isEndCorrect;
		});

		if (answer) {
			const startButton = document.querySelector(`button[data-row="${start.y}"][data-col="${start.x}"]`);
			const endButton = document.querySelector(`button[data-row="${end.y}"][data-col="${end.x}"]`);

			if (startButton && endButton) {
				const startRect = startButton.getBoundingClientRect();
				const endRect = endButton.getBoundingClientRect();

				const startX = startRect.left;
				const startY = startRect.top;
				const endX = endRect.left;
				const endY = endRect.top;

				const line = document.createElement('div');
				line.style.position = 'absolute';
				line.style.zIndex = '10';
				line.style.width = `${Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)}px`;
				line.style.height = '8px';
				line.style.backgroundColor = 'rgba(178, 48, 80, 0.60)';
				line.style.borderRadius = '10px';

				const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
				line.style.transform = `rotate(${angle}deg)`;
				line.style.transformOrigin = '0 0';

				line.style.left = `${startX + startRect.width / 2}px`;
				line.style.top = `${startY + startRect.height / 2}px`;

				document.body.appendChild(line);

			}
		}

		setStartPos(null);
		setEndPos(null);


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



	const handleMouseInteractionEnd = (e: MouseEvent) => {
		e.preventDefault();
		setIsSelecting(false);
		if (startPos && endPos)
			checkIsWordCorrect(startPos, endPos);
	};

	const isValidLine = useCallback((dx: number, dy: number) => {
		return (
			dx === 0 ||
			dy === 0 ||
			Math.abs(dx) === Math.abs(dy) // Horizontal, vertical, or diagonal
		);
	}, []);

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
		<section className={"md:flex-row flex-col flex gap-4"}>
			<div style={{
				boxShadow: '0px 7px 0px 0px rgba(0, 0, 0, 0.25)',
			}} className={"bg-white flex h-max gap-3 flex-wrap lg:max-w-[40svw] flex-grow-0 rounded-xl p-8"}>
				{memoizedWords.list.map((word) => (
					<div data-value={word}
						className={cn("md:text-5xl text-3xl leading-normal text-black font-normal",
							memoizedWords.correctedList.find((correctedWord) => correctedWord === word) ? 'line-through text-gray-400' : ''
						)} key={word}>
						{word}
					</div>
				))}
			</div>
			<div
				className={cn("grid size-[100svw] md:size-[36rem] justify-items-center items-top select-none",
					"grid-cols-[repeat(8,_12.5svw)] grid-rows-[repeat(8,_12.5svw)]",
					"md:grid-cols-8 md:grid-rows-8"
				)}
			// onMouseLeave={handleInteractionEnd}
			>
				{grid.map((row, rowIndex) =>
					row.map((letter, colIndex) => (
						<button
							key={`${rowIndex}-${colIndex}`}
							data-row={rowIndex}
							data-col={colIndex}
							className={cn("flex-grow-0 w-[90%] h-[80%] shadow-[0px_7px_0px_0px_rgba(0,0,0,0.25)] rounded-[20px] border border-gray-300 flex items-center justify-center font-bold text-2xl md:text-4xl",
								`${isCellHighlighted(rowIndex, colIndex) ? 'bg-blue-200 ' : 'bg-[#D7D7D7]'
								}`)}
							onMouseDown={() => handleInteractionStart(rowIndex, colIndex)}
							onMouseEnter={(e) => handleInteractionMove(e)}
							onMouseUp={(e) => handleMouseInteractionEnd(e)}
							onTouchStart={() => handleInteractionStart(rowIndex, colIndex)}
							onTouchMove={handleInteractionMove}
							onTouchEnd={(e) => handleInteractionMove(e)}
						>
							{letter}
						</button>
					))
				)}
			</div>
		</section>
	);
};

export default ClientWordSearchDiv;
