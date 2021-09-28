// See https://docs.battlesnake.com/references/api for all details and examples.

export interface InfoResponse {
  apiversion: string;
  author?: string;
  color?: string;
  head?: string;
  tail?: string;
  version?: string;
}

export interface MoveResponse {
  move: string;
  shout?: string;
}

export interface Game {
  id: string;
  ruleset: { name: string; version: string };
  timeout: number;
}

export interface Coord {
  x: number;
  y: number;
}

export interface Battlesnake {
  id: string;
  name: string;
  health: number;
  body: Coord[];
  latency: string;
  head: Coord;
  length: number;

  // Used in non-standard game modes
  shout: string;
  squad: string;
  neck?: Coord;
}

export interface You extends Battlesnake {
  isHungry?: boolean;
  neck: Coord
}

export interface Board {
  height: number;
  width: number;
  food: Coord[];
  snakes: Battlesnake[];

  // Used in non-standard game modes
  hazards: Coord[];
}

export interface GameState {
  game: Game;
  turn: number;
  board: Board;
  you: You;
}

export interface ScoreGrid {
  [index: number]: number[]
}
export type Move = 'up' | 'down' | 'left' | 'right';
export type Moves = { [key in Move]: boolean };
export type MovesIndex = boolean[]

type ObjectKeys<T> = 
  T extends object ? (keyof T)[] :
  T extends number ? [] :
  T extends Move[] ? Move[] :
  T extends Array<any> | string ? string[] :
  never;

export declare global {
  interface ObjectConstructor {
    keys<T>(o: T): ObjectKeys<T>;
  }
}