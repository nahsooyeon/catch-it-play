export type positionType = {
  x: number;
  y: number;
};
export interface BoardResDto {
  seed: string;
  grid: string[][];
  gridsize: positionType;
  wordlist: string[];
  words: wordType[];
}

type wordType = {
  word: string;
  direction: number;
  start: positionType;
  end: positionType;
};
