import { describe, expect, it } from 'vitest';
import { createBoard } from './model';
import { findExercises, isSavedExercise, makeExercise, overwriteExercise } from './library';

describe('exercise library', () => {
  it('creates an independent snapshot, preserving the original after board changes', () => {
    const board = createBoard();
    board.name = 'Saída de bola';
    const entry = makeExercise(board, 'Tática');
    board.players[0].x = 340;
    board.name = 'Alterado';
    expect(entry.title).toBe('Saída de bola');
    expect(entry.board.players[0].x).toBe(125);
    expect(isSavedExercise(entry)).toBe(true);
  });

  it('replaces an exercise without changing its identity or siblings', () => {
    const board = createBoard();
    const first = makeExercise(board, 'Tática');
    const other = makeExercise(board, 'Técnica');
    board.name = 'Correção da jogada';
    board.players[0].y = 430;
    const result = overwriteExercise([first, other], first.id, board);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(first.id);
    expect(result[0].createdAt).toBe(first.createdAt);
    expect(result[0].board.players[0].y).toBe(430);
    expect(result[1]).toBe(other);
  });

  it('supports case-insensitive search, category filter, and safe validation', () => {
    const board = createBoard();
    board.name = 'TRANSIÇÃO ofensiva';
    const first = makeExercise(board, 'Transições');
    board.name = 'Canto ofensivo';
    const second = makeExercise(board, 'Bolas paradas');
    expect(findExercises([first, second], 'transição')).toEqual([first]);
    expect(findExercises([first, second], '', 'Bolas paradas')).toEqual([second]);
    expect(isSavedExercise({ ...first, board: { invalid: true } })).toBe(false);
  });
});
