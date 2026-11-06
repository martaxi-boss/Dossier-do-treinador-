import { Board, Dossier, demoDossier, isBoard } from '../domain/model';

const BOARD_KEY = 'campolab.board.v1';
const DOSSIER_KEY = 'campolab.dossier.v1';

export function loadBoard(): Board | undefined {
  try {
    const value = JSON.parse(localStorage.getItem(BOARD_KEY) || 'null') as unknown;
    return isBoard(value) ? value : undefined;
  } catch { return undefined; }
}
export function saveBoard(board: Board) {
  try { localStorage.setItem(BOARD_KEY, JSON.stringify(board)); } catch { /* storage may be disabled/full */ }
}
export function loadDossier(): Dossier {
  try {
    const raw = localStorage.getItem(DOSSIER_KEY);
    if (!raw) return demoDossier;
    const data = JSON.parse(raw) as Dossier;
    if (data.version === 1 && data.club && Array.isArray(data.squad) && Array.isArray(data.trainings) && Array.isArray(data.games)) return data;
  } catch { /* fallback to demo */ }
  return demoDossier;
}
export function saveDossier(data: Dossier) {
  try { localStorage.setItem(DOSSIER_KEY, JSON.stringify(data)); } catch { /* local storage unavailable */ }
}
export function downloadFile(name: string, contents: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export async function importBoardFile(file: File): Promise<Board> {
  if (file.size > 1024 * 1024) throw new Error('Ficheiro demasiado grande (máximo: 1 MB).');
  let data: unknown;
  try { data = JSON.parse(await file.text()); } catch { throw new Error('O ficheiro não contém JSON válido.'); }
  if (!isBoard(data)) throw new Error('Este ficheiro não contém uma jogada CampoLab válida.');
  return data;
}
