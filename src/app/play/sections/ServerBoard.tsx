import { BoardResDto } from "@/app/dto/board.res.dto";
import ClientWordBoard from "./ClientWordBoard";

const getServerSideBoard = async () => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/game`, {
			method: 'POST',
		});
		const data: BoardResDto = await response.json();
		return data.grid;
	} catch (error) {
		console.error(error);
		throw new Error('Failed to fetch board data');
	}

};

const ServerSideBoard = async () => {
	const board = await getServerSideBoard();

	return <ClientWordBoard initialBoard={board} />;
};

export default ServerSideBoard;