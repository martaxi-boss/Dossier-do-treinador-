import { describe, expect, it } from 'vitest';
import { captureFrame, createBoard, isBoard } from './model';
import {
  applyFrame, changeTrajectoryHandle, createTrajectory, deleteFrame, overwriteFrame, trajectoryPoints,
} from './editor';

describe('editable tactical trajectories', () => {
  it('creates a straight movement and a curved one', () => {
    const start = { x: 100, y: 200 };
    const end = { x: 460, y: 220 };
    const straight = createTrajectory(start, end, '#ffffff', false);
    const curve = createTrajectory(start, end, '#f3bd4b', true);
    expect(straight.control).toBeUndefined();
    expect(trajectoryPoints(straight)).toEqual([100, 200, 460, 220]);
    expect(curve.control).toBeDefined();
    expect(trajectoryPoints(curve)).toHaveLength(6);
  });

  it('corrects a middle control point without moving either endpoint', () => {
    const original = createTrajectory({ x: 120, y: 120 }, { x: 520, y: 380 }, '#fff', true);
    const changed = changeTrajectoryHandle(original, 'control', { x: 400, y: 240 });
    expect(changed.control).toEqual({ x: 400, y: 240 });
    expect(changed.start).toEqual(original.start);
    expect(changed.end).toEqual(original.end);
    expect(original.control).not.toEqual(changed.control);
  });

  it('bounds edits and validates curved arrows on import', () => {
    const board = createBoard();
    const curved = createTrajectory({ x: 90, y: 90 }, { x: 500, y: 500 }, '#fff', true);
    board.arrows.push(changeTrajectoryHandle(curved, 'end', { x: 10000, y: -200 }));
    expect(board.arrows[0].end).toEqual({ x: 1060, y: 35 });
    expect(isBoard(board)).toBe(true);
    board.arrows[0].control = { x: Number.POSITIVE_INFINITY, y: 2 };
    expect(isBoard(board)).toBe(false);
  });
});

describe('recorded frames', () => {
  it('applies and overwrites a specific step without modifying its id or siblings', () => {
    const board = createBoard();
    const first = captureFrame(board, 'Inicio');
    board.players[0].x = 400;
    const second = captureFrame(board, 'Ataque');
    board.frames = [first, second];
    const earlier = applyFrame(board, 0);
    expect(earlier.players[0].x).toBe(first.playerPositions['casa-1'].x);
    earlier.players[0].x = 270;
    const replaced = overwriteFrame(earlier, 0);
    expect(replaced.frames[0].playerPositions['casa-1'].x).toBe(270);
    expect(replaced.frames[0].id).toBe(first.id);
    expect(replaced.frames[1]).toBe(second);
    expect(deleteFrame(replaced, 0).frames).toEqual([second]);
    expect(overwriteFrame(replaced, 99)).toBe(replaced);
  });

  it('rejects corrupted frame data instead of crashing after import', () => {
    const board = createBoard();
    board.frames = [captureFrame(board, 'Passo')];
    expect(isBoard(board)).toBe(true);
    board.frames[0].playerPositions['casa-1'] = { x: NaN, y: 1 };
    expect(isBoard(board)).toBe(false);
  });
});
