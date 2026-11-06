import { test, expect, type Page } from '@playwright/test';

type StoredBoard = {
  players: { id: string; x: number; y: number }[];
  arrows: { id: string; start: { x: number; y: number }; end: { x: number; y: number }; control?: { x: number; y: number } }[];
  frames: { id: string; playerPositions: Record<string, { x: number; y: number }> }[];
};

const getSavedBoard = async (page: Page): Promise<StoredBoard | null> =>
  page.evaluate(() => {
    const raw = localStorage.getItem('campolab.board.v1');
    return raw ? JSON.parse(raw) as StoredBoard : null;
  });

async function pointOnCanvas(page: Page, x: number, y: number) {
  const rect = await page.locator('.board-canvas canvas').first().boundingBox();
  if (!rect) throw new Error('Tactical canvas was not rendered');
  return {
    x: rect.x + (x / 1100) * rect.width,
    y: rect.y + (y / 650) * rect.height,
  };
}

async function drawMouse(page: Page, start: { x: number; y: number }, end: { x: number; y: number }) {
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 12 });
  await page.mouse.up();
}

test('dashboard navigates to a board and player movement persists after reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Mais do que um dossiê/ })).toBeVisible();
  await page.getByRole('button', { name: 'Estúdio tático', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Quadro tático interativo' })).toBeVisible();
  const player = await pointOnCanvas(page, 125, 325);
  const target = await pointOnCanvas(page, 195, 325);
  await drawMouse(page, player, target);
  await expect.poll(async () => (await getSavedBoard(page))?.players.find(p => p.id === 'casa-1')?.x)
    .toBeGreaterThan(165);
  const saved = (await getSavedBoard(page))?.players.find(p => p.id === 'casa-1')?.x;
  await page.reload();
  await page.getByRole('button', { name: 'Estúdio tático', exact: true }).click();
  expect((await getSavedBoard(page))?.players.find(p => p.id === 'casa-1')?.x).toBe(saved);
});

test('curved trajectories can be created and their middle anchor corrected', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Estúdio tático', exact: true }).click();
  await page.getByRole('button', { name: 'Curva', exact: true }).click();
  await drawMouse(page, await pointOnCanvas(page, 350, 200), await pointOnCanvas(page, 650, 390));
  await expect.poll(async () => (await getSavedBoard(page))?.arrows.length).toBe(1);
  const original = (await getSavedBoard(page))!.arrows[0];
  expect(original.control).toBeDefined();
  const anchor = await pointOnCanvas(page, original.control!.x, original.control!.y);
  const target = await pointOnCanvas(page, original.control!.x + 55, original.control!.y + 30);
  await drawMouse(page, anchor, target);
  await expect.poll(async () => (await getSavedBoard(page))!.arrows[0].control?.x).toBeGreaterThan(original.control!.x + 20);
});

test('selected animation step can be replaced instead of duplicated', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Estúdio tático', exact: true }).click();
  await page.getByRole('button', { name: 'Gravar passo' }).click();
  const start = await pointOnCanvas(page, 125, 325);
  const destination = await pointOnCanvas(page, 230, 325);
  await drawMouse(page, start, destination);
  await page.getByRole('button', { name: 'Gravar passo' }).click();
  await expect.poll(async () => (await getSavedBoard(page))?.frames.length).toBe(2);
  await page.getByRole('button', { name: /Passo 1/ }).click();
  await drawMouse(page, await pointOnCanvas(page, 125, 325), await pointOnCanvas(page, 195, 335));
  await page.getByRole('button', { name: 'Atualizar passo' }).click();
  await expect.poll(async () => (await getSavedBoard(page))?.frames[0].playerPositions['casa-1'].x).toBeGreaterThan(150);
  expect((await getSavedBoard(page))?.frames).toHaveLength(2);
});

test('exercise library saves, updates, duplicates and reopens independent boards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Estúdio tático', exact: true }).click();
  await page.getByRole('textbox', { name: 'Nome da jogada' }).fill('Pressão alta');
  await page.getByRole('button', { name: 'Guardar como novo' }).click();
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('campolab.exercises.v1') || '[]').length)).toBe(1);
  await expect(page.getByText('Pressão alta', { exact: true }).last()).toBeVisible();
  await page.getByRole('textbox', { name: 'Nome da jogada' }).fill('Pressão alta revista');
  await page.getByRole('button', { name: 'Atualizar exercício' }).click();
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('campolab.exercises.v1') || '[]')[0]?.title)).toBe('Pressão alta revista');
  await page.getByRole('button', { name: 'Duplicar exercício Pressão alta revista' }).click();
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem('campolab.exercises.v1') || '[]').length)).toBe(2);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Abrir exercício Pressão alta revista' }).click();
  await expect(page.getByRole('textbox', { name: 'Nome da jogada' })).toHaveValue('Pressão alta revista');
});

test.describe('smartphone layout', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test('a real touch sequence drags a player and persists the corrected position', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('button', { name: 'Estúdio tático', exact: true }).click();
    await page.locator('.board-canvas').scrollIntoViewIfNeeded();
    const from = await pointOnCanvas(page, 125, 325);
    const to = await pointOnCanvas(page, 235, 325);
    const touch = await page.context().newCDPSession(page);
    const touchPoint = (x: number, y: number) => [{ x, y, radiusX: 9, radiusY: 9 }];
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: touchPoint(from.x, from.y) });
    for (let i = 1; i <= 10; i++) {
      await touch.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: touchPoint(from.x + ((to.x - from.x) * i) / 10, from.y),
      });
    }
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(async () => (await getSavedBoard(page))?.players.find(p => p.id === 'casa-1')?.x).toBeGreaterThan(195);
  });
  test('the pitch can zoom without overflowing the page and enables horizontal navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('button', { name: 'Estúdio tático', exact: true }).click();
    await page.getByRole('button', { name: 'Ampliar campo' }).click();
    await expect(page.getByRole('button', { name: 'Repor tamanho automático' })).toContainText('125%');
    await page.getByRole('button', { name: 'Navegar', exact: true }).click();
    await expect(page.locator('.board-canvas')).toHaveCSS('touch-action', 'pan-x');
    await expect.poll(() => page.locator('.board-scroll').evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 3)).toBe(true);
  });
});
