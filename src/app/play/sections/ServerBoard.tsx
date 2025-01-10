import { BoardResDto } from "@/dto/board.res.dto";
import ClientWordSearchDiv from "./ClientWordBoard";

const getServerSideBoard = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/game`, {
		method: 'POST',
		body: JSON.stringify({
			seed: Math.random()
		}),
		cache: 'no-cache',
	});
	const data: BoardResDto = await response.json();
	return data;
};

const ServerSideBoard = async () => {
	const board = await getServerSideBoard();

	return <ClientWordSearchDiv initialBoardData={board} />;
};

export default ServerSideBoard;