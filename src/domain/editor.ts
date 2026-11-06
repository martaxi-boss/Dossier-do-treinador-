import {
  Board, Point, TacticalArrow, TacticalFrame, captureFrame, clampPoint, uid,
} from './model';

export type ArrowHandle = 'start' | 'control' | 'end';

/** Builds a trajectory with an optional editable mid-point. */
export function createTrajectory(start: Point, end: Point, color: string, curved: boolean): TacticalArrow {
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const arrow: TacticalArrow = {
    id: uid(), start: clampPoint(start), end: clampPoint(end), color,
  };
  if (!curved || distance < 1) return arrow;
  const amount = Math.min(95, Math.max(32, distance * 0.2));
  return {
    ...arrow,
    control: clampPoint({
      x: (start.x + end.x) / 2 - ((end.y - start.y) / distance) * amount,
      y: (start.y + end.y) / 2 + ((end.x - start.x) / distance) * amount,
    }),
  };
}

/** Konva's tension=0.5 turns three anchors into a smooth, editable curve. */
export function trajectoryPoints(arrow: TacticalArrow): number[] {
  const points = [arrow.start.x, arrow.start.y];
  if (arrow.control) points.push(arrow.control.x, arrow.control.y);
  points.push(arrow.end.x, arrow.end.y);
  return points;
}

export function changeTrajectoryHandle(arrow: TacticalArrow, handle: ArrowHandle, point: Point): TacticalArrow {
  return { ...arrow, [handle]: clampPoint(point) };
}

/** Updates a previously recorded step without creating a duplicate step. */
export function overwriteFrame(board: Board, index: number): Board {
  if (index < 0 || index >= board.frames.length) return board;
  const original = board.frames[index];
  const snapshot: TacticalFrame = captureFrame(board, original.name);
  return {
    ...board,
    frames: board.frames.map((frame, i) => i === index ? { ...snapshot, id: original.id } : frame),
  };
}

export function deleteFrame(board: Board, index: number): Board {
  if (index < 0 || index >= board.frames.length) return board;
  return { ...board, frames: board.frames.filter((_, i) => i !== index) };
}

export function applyFrame(board: Board, index: number): Board {
  const frame = board.frames[index];
  if (!frame) return board;
  return {
    ...board,
    ball: { ...frame.ball },
    players: board.players.map(player => ({ ...player, ...(frame.playerPositions[player.id] || {}) })),
  };
}
