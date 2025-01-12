'use client';
import { useCountdownContext } from '@/context/Countdown';
import { BoardResDto, positionType } from '@/dto/board.res.dto';
import { cn } from '@/app/utils/tailwind';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand';
import { GameInfoStore } from '@/app/store/GameInfo';
import RankFormModal from './widgets/RankForm';
import { modalStore } from '@/context/Modal';

interface ClientWordSearchDivProps {
	initialBoardData: BoardResDto;
}

const ClientWordSearchDiv: React.FC<ClientWordSearchDivProps> = ({ initialBoardData }) => {
	const [isSelecting, setIsSelecting] = useState(false);
	const [startPos, setStartPos] = useState<positionType | null>(null);
	const [endPos, setEndPos] = useState<positionType | null>(null);
	const { start, isCountdown, reset, count, defaultCount } = useCountdownContext();
	const { addPoints } = useStore(GameInfoStore);
	const { openModal, list } = useStore(modalStore);
	const { grid, words } = initialBoardData;

	const memoizedWords = useMemo(() => {
		const list = words.map((word) => {
			return word.word;
		});
		const correctedList: string[] = [];

		return { list, words, correctedList };

	}, [words]);

	useEffect(() => {
		start();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isCountdown && count === 0 && list.size === 0) {
			openModal(<RankFormModal usedTime={defaultCount} solvedCount={memoizedWords.correctedList.length} entireCount={memoizedWords.words.length} id={'rankForm'} />);
		}
	}, [isCountdown, count, openModal, memoizedWords.correctedList.length, memoizedWords.words.length, list.size, defaultCount]);


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
			memoizedWords.correctedList.push(answer.word);
			const startButton = document.querySelector(`button[data-row="${start.y}"][data-col="${start.x}"]`);
			const endButton = document.querySelector(`button[data-row="${end.y}"][data-col="${end.x}"]`);
			addPoints(answer.word.length * 100);
			if (startButton && endButton) {
				const startRect = startButton.getBoundingClientRect();
				const endRect = endButton.getBoundingClientRect();

				const startX = startRect.left;
				const startY = startRect.top;
				const endX = endRect.left;
				const endY = endRect.top;

				const line = document.createElement('div');
				line.style.position = 'absolute';
				line.style.zIndex = '1';
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

			if (memoizedWords.correctedList.length === memoizedWords.words.length) {
				reset();
				openModal(<RankFormModal usedTime={defaultCount - count} solvedCount={memoizedWords.correctedList.length} entireCount={memoizedWords.words.length} id={'rankForm'} />);
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

	};



	const handleMouseInteractionEnd = () => {
		// e.preventDefault();
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
		<section className={"lg:flex-row flex-col bg-[#EDEDED] lg:justify-center lg:mt-10 items-center flex gap-4"}>
			<div className={"bg-white flex h-max shadow-bottom gap-3 flex-wrap lg:max-w-[40svw] px-4 flex-grow-0 rounded-xl mt-4 lg:mt-8 lg:p-8"}>
				{memoizedWords.list.map((word) => (
					<div data-value={word}
						className={cn("lg:text-5xl text-3xl leading-snug text-black font-normal",
							memoizedWords.correctedList.find((correctedWord) => correctedWord === word) ? 'line-through text-gray-400' : ''
						)} key={word}>
						{word}
					</div>
				))}
			</div>
			<div
				className={cn("grid size-[80svw] lg:size-[36rem] justify-items-center items-top select-none",
					"grid-cols-[repeat(8,_10svw)] grid-rows-[repeat(8,_10svw)]",
					"lg:grid-cols-8 lg:grid-rows-8"
				)}
			>
				{grid.map((row, rowIndex) =>
					row.map((letter, colIndex) => (
						<button
							key={`${rowIndex}-${colIndex}`}
							data-row={rowIndex}
							data-col={colIndex}
							disabled={!isCountdown}
							className={cn("flex-grow-0 w-[90%] h-[80%] shadow-[0px_7px_0px_0px_rgba(0,0,0,0.25)] rounded-[20px] border border-gray-300 flex items-center justify-center font-bold text-2xl md:text-4xl",
								`${isCellHighlighted(rowIndex, colIndex) ? 'bg-blue-200 ' : 'bg-[#D7D7D7]'
								}`)}
							onMouseDown={() => handleInteractionStart(rowIndex, colIndex)}
							onMouseEnter={(e) => handleInteractionMove(e)}
							onMouseUp={() => handleMouseInteractionEnd()}
							onTouchStart={() => handleInteractionStart(rowIndex, colIndex)}
							onTouchMove={handleInteractionMove}
							onTouchEnd={() => handleMouseInteractionEnd()}
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
