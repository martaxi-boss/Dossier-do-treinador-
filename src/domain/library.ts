import { Board, isBoard, uid } from './model';

export const EXERCISE_CATEGORIES = ['Tática', 'Técnica', 'Transições', 'Bolas paradas', 'Organização defensiva', 'Outros'] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export type SavedExercise = {
  id: string;
  title: string;
  category: ExerciseCategory;
  board: Board;
  createdAt: string;
  updatedAt: string;
};

export function isSavedExercise(value: unknown): value is SavedExercise {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SavedExercise>;
  return typeof item.id === 'string' && item.id.length > 0 && item.id.length <= 80
    && typeof item.title === 'string' && item.title.length <= 100
    && EXERCISE_CATEGORIES.includes(item.category as ExerciseCategory)
    && typeof item.createdAt === 'string' && Number.isFinite(Date.parse(item.createdAt))
    && typeof item.updatedAt === 'string' && Number.isFinite(Date.parse(item.updatedAt))
    && isBoard(item.board);
}

export function makeExercise(board: Board, category: ExerciseCategory): SavedExercise {
  const now = new Date().toISOString();
  return {
    id: uid(), title: board.name.trim() || 'Exercício sem nome',
    category, board: structuredClone(board), createdAt: now, updatedAt: now,
  };
}

/** Replacing a library entry creates a new snapshot; all sibling exercises are untouched. */
export function overwriteExercise(list: SavedExercise[], id: string, board: Board): SavedExercise[] {
  return list.map(item => item.id === id
    ? { ...item, title: board.name.trim() || item.title, board: structuredClone(board), updatedAt: new Date().toISOString() }
    : item);
}

export function findExercises(list: SavedExercise[], query: string, category?: ExerciseCategory): SavedExercise[] {
  const text = query.trim().toLocaleLowerCase('pt-PT');
  return list.filter(item => (!category || item.category === category)
    && (!text || item.title.toLocaleLowerCase('pt-PT').includes(text)))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
