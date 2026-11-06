import { describe, expect, it } from 'vitest';
import { captureFrame, clampPoint, createBoard, FORMATIONS, interpolateFrames, isBoard, makePlayers } from './model';

describe('tactical domain', () => {
  it('produces two teams of eleven for every formation', () => {
    for (const formation of FORMATIONS) {
      expect(makePlayers(formation, 'casa')).toHaveLength(11);
      const board = createBoard(formation);
      expect(board.players).toHaveLength(22);
      expect(new Set(board.players.map(player => player.id)).size).toBe(22);
    }
  });
  it('bounds player and ball movement within the pitch', () => {
    expect(clampPoint({ x: -300, y: 999 })).toEqual({ x: 40, y: 615 });
  });
  it('interpolates a real change of position and retains all players', () => {
    const board = createBoard();
    const first = captureFrame(board, 'Início');
    board.players[0].x += 80;
    const second = captureFrame(board, 'Passe');
    const mid = interpolateFrames(first, second, 0.5);
    expect(mid.playerPositions['casa-1'].x).toBe(first.playerPositions['casa-1'].x + 40);
    expect(Object.keys(mid.playerPositions)).toHaveLength(22);
  });
  it('rejects malformed imported boards', () => {
    expect(isBoard({ version: 1, players: [] })).toBe(false);
    expect(isBoard(createBoard())).toBe(true);
  });
});
