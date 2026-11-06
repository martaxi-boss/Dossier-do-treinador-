export type Point = { x: number; y: number };
export type Side = 'casa' | 'fora';
export type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1';
export type Player = { id: string; team: Side; number: number; name: string; x: number; y: number };
export type TacticalArrow = { id: string; start: Point; end: Point; control?: Point; color: string };
export type TacticalStroke = { id: string; points: number[]; color: string };
export type TacticalFrame = { id: string; name: string; playerPositions: Record<string, Point>; ball: Point };
export type Board = {
  version: 1;
  name: string;
  formation: Formation;
  players: Player[];
  ball: Point;
  arrows: TacticalArrow[];
  strokes: TacticalStroke[];
  frames: TacticalFrame[];
};
export type SquadPlayer = { id: string; number: number; name: string; position: string; available: boolean };
export type Training = { id: string; date: string; title: string; objective: string; duration: number; notes: string };
export type Game = { id: string; date: string; opponent: string; place: string; result: string };
export type Club = { name: string; ageGroup: string; season: string; modality: 'Futebol' | 'Futsal'; coach: string };
export type Dossier = { version: 1; club: Club; squad: SquadPlayer[]; trainings: Training[]; games: Game[] };

export const PITCH = { width: 1100, height: 650 };
export const FORMATIONS: Formation[] = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'];
export const uid = () => Math.random().toString(36).slice(2, 11);
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
export const clampPoint = (p: Point): Point => ({ x: clamp(p.x, 40, 1060), y: clamp(p.y, 35, 615) });

export function makePlayers(formation: Formation, side: Side): Player[] {
  const lines = formation.split('-').map(Number);
  const left = side === 'casa';
  const mk = (x: number, y: number, n: number): Player => ({
    id: side + '-' + n, team: side, number: n,
    name: (left ? 'Casa ' : 'Fora ') + n,
    x: left ? x : PITCH.width - x, y,
  });
  const players = [mk(125, 325, 1)];
  let number = 2;
  lines.forEach((count, index) => {
    const x = 292 + index * (lines.length === 4 ? 111 : 141);
    for (let j = 0; j < count; j++) {
      players.push(mk(x, (PITCH.height * (j + 1)) / (count + 1), number++));
    }
  });
  return players;
}

export function createBoard(formation: Formation = '4-3-3'): Board {
  return {
    version: 1, name: 'Jogada de treino', formation,
    players: [...makePlayers(formation, 'casa'), ...makePlayers(formation, 'fora')],
    ball: { x: 550, y: 325 }, arrows: [], strokes: [], frames: [],
  };
}

export function captureFrame(board: Board, name: string): TacticalFrame {
  return {
    id: uid(), name,
    playerPositions: Object.fromEntries(board.players.map(player => [player.id, { x: player.x, y: player.y }])),
    ball: { ...board.ball },
  };
}

export function lerpPoint(a: Point, b: Point, progress: number): Point {
  const t = clamp(progress, 0, 1);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function interpolateFrames(a: TacticalFrame, b: TacticalFrame, progress: number) {
  const positions: Record<string, Point> = {};
  for (const id of Object.keys(a.playerPositions)) {
    positions[id] = lerpPoint(a.playerPositions[id], b.playerPositions[id] || a.playerPositions[id], progress);
  }
  return { playerPositions: positions, ball: lerpPoint(a.ball, b.ball, progress) };
}

const finitePoint = (point: unknown): point is Point => !!point && typeof point === 'object'
  && Number.isFinite((point as Point).x) && Number.isFinite((point as Point).y);

export function isBoard(value: unknown): value is Board {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<Board>;
  return data.version === 1 && typeof data.name === 'string' && FORMATIONS.includes(data.formation as Formation)
    && Array.isArray(data.players) && data.players.length === 22
    && data.players.every(p => typeof p?.id === 'string' && Number.isFinite(p.x) && Number.isFinite(p.y))
    && !!data.ball && Number.isFinite(data.ball.x) && Number.isFinite(data.ball.y)
    && Array.isArray(data.arrows) && Array.isArray(data.strokes) && Array.isArray(data.frames)
    && data.arrows.length < 1000 && data.strokes.length < 1000 && data.frames.length < 100
    && data.arrows.every(arrow => !!arrow && typeof arrow.id === 'string' && typeof arrow.color === 'string'
      && finitePoint(arrow.start) && finitePoint(arrow.end)
      && (arrow.control === undefined || finitePoint(arrow.control)))
    && data.strokes.every(stroke => !!stroke && typeof stroke.id === 'string' && typeof stroke.color === 'string'
      && Array.isArray(stroke.points) && stroke.points.length <= 30000
      && stroke.points.every(value => Number.isFinite(value)))
    && data.frames.every(frame => !!frame && typeof frame.id === 'string'
      && typeof frame.name === 'string' && finitePoint(frame.ball)
      && !!frame.playerPositions && typeof frame.playerPositions === 'object'
      && data.players!.every(player => finitePoint(frame.playerPositions[player.id])));
}

export const demoDossier: Dossier = {
  version: 1,
  club: { name: 'Clube Exemplo', ageGroup: 'Sub-19', season: '2026/2027', modality: 'Futebol', coach: 'Treinador' },
  squad: Array.from({ length: 15 }, (_, i) => ({
    id: 'player-' + (i + 1), number: i + 1,
    name: 'Atleta ' + String(i + 1).padStart(2, '0'),
    position: i === 0 ? 'Guarda-redes' : i < 6 ? 'Defesa' : i < 11 ? 'Médio' : 'Avançado',
    available: true,
  })),
  trainings: [
    { id: 'training-demo', date: '2026-11-09', title: 'Organização ofensiva', objective: 'Saída de bola e ocupação de espaços', duration: 90, notes: 'Sessão de exemplo; editar antes de utilizar.' },
  ],
  games: [],
};
