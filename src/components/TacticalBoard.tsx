import { useEffect, useRef, useState } from 'react';
import { Arrow, Circle, Group, Layer, Line, Rect, Stage, Text } from 'react-konva';
import type Konva from 'konva';
import {
  ArrowUpRight, Brush, Eraser, Hand, ImageDown, Maximize2,
  MousePointer2, Pause, Play, Plus, Redo2, RotateCcw,
  Save, Undo2, Upload,
} from 'lucide-react';
import {
  Board, Point, FORMATIONS, Formation, PITCH, TacticalArrow, TacticalStroke,
  captureFrame, clampPoint, createBoard, interpolateFrames, uid,
} from '../domain/model';
import { downloadFile, importBoardFile, loadBoard, saveBoard } from '../services/local';

type Tool = 'mover' | 'seta' | 'caneta' | 'editar' | 'apagar';
type Draft = { kind: 'seta'; start: Point; end: Point } | { kind: 'caneta'; points: number[] };
type Preview = ReturnType<typeof interpolateFrames>;

const TOOLS: { id: Tool; label: string; icon: typeof Hand }[] = [
  { id: 'mover', label: 'Mover', icon: Hand },
  { id: 'seta', label: 'Movimento', icon: ArrowUpRight },
  { id: 'caneta', label: 'Desenhar', icon: Brush },
  { id: 'editar', label: 'Corrigir', icon: MousePointer2 },
  { id: 'apagar', label: 'Apagar', icon: Eraser },
];
const PITCH_COLOR = '#1c7653';
const LINES = 'rgba(237,255,245,.7)';
const INITIAL_WIDTH = 980;

function Pitch() {
  return <>
    <Rect x={0} y={0} width={PITCH.width} height={PITCH.height} cornerRadius={16} fill={PITCH_COLOR} />
    {Array.from({ length: 10 }, (_, i) => (
      <Rect key={i} x={i * 110} y={0} width={110} height={650} fill={i % 2 ? '#0a5f47' : '#1b7958'} opacity={0.55} />
    ))}
    <Rect x={40} y={38} width={1020} height={574} stroke={LINES} strokeWidth={3} />
    <Line points={[550, 38, 550, 612]} stroke={LINES} strokeWidth={3} />
    <Circle x={550} y={325} radius={79} stroke={LINES} strokeWidth={3} />
    <Circle x={550} y={325} radius={5} fill={LINES} />
    <Rect x={40} y={185} width={167} height={280} stroke={LINES} strokeWidth={3} />
    <Rect x={893} y={185} width={167} height={280} stroke={LINES} strokeWidth={3} />
    <Rect x={40} y={259} width={62} height={132} stroke={LINES} strokeWidth={3} />
    <Rect x={998} y={259} width={62} height={132} stroke={LINES} strokeWidth={3} />
    <Circle x={145} y={325} radius={5} fill={LINES} />
    <Circle x={955} y={325} radius={5} fill={LINES} />
    <Line points={[40, 293, 21, 293, 21, 357, 40, 357]} stroke={LINES} strokeWidth={3} />
    <Line points={[1060, 293, 1079, 293, 1079, 357, 1060, 357]} stroke={LINES} strokeWidth={3} />
    <Text x={55} y={55} text="CASA" fontFamily="Arial" fontSize={14} fontStyle="bold" fill="#d2f7e1" />
    <Text x={1000} y={55} text="FORA" fontFamily="Arial" fontSize={14} fontStyle="bold" fill="#d2f7e1" />
  </>;
}

export default function TacticalBoard() {
  const [board, setBoard] = useState<Board>(() => loadBoard() || createBoard());
  const [undoStack, setUndoStack] = useState<Board[]>([]);
  const [redoStack, setRedoStack] = useState<Board[]>([]);
  const [tool, setTool] = useState<Tool>('mover');
  const [width, setWidth] = useState(INITIAL_WIDTH);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [selectedArrow, setSelectedArrow] = useState<string | null>(null);
  const [inkColor, setInkColor] = useState('#f3bd4b');
  const [playing, setPlaying] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [notice, setNotice] = useState('Arrasta jogadores e a bola. Guarda dois passos para animar a jogada.');
  const stage = useRef<Konva.Stage>(null);
  const boardContainer = useRef<HTMLDivElement>(null);
  const fullscreenTarget = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const draftRef = useRef<Draft | null>(null);

  useEffect(() => { saveBoard(board); }, [board]);
  useEffect(() => {
    const target = boardContainer.current;
    if (!target) return;
    const update = () => setWidth(Math.max(780, target.getBoundingClientRect().width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || board.frames.length < 2) return;
    let request = 0;
    let started: number | null = null;
    const frameDuration = 1200;
    const frames = board.frames;
    const tick = (now: number) => {
      if (started === null) started = now;
      const time = (now - started) / frameDuration;
      if (time >= frames.length - 1) {
        setPreview(interpolateFrames(frames[frames.length - 2], frames[frames.length - 1], 1));
        setPlaying(false);
        return;
      }
      const index = Math.floor(time);
      setPreview(interpolateFrames(frames[index], frames[index + 1], time - index));
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [playing, board.frames]);

  const commit = (next: Board) => {
    setUndoStack(history => [...history.slice(-49), board]);
    setRedoStack([]);
    setBoard(next);
  };
  const undo = () => {
    if (!undoStack.length || playing) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(history => [...history, board]);
    setUndoStack(history => history.slice(0, -1));
    setBoard(previous);
    setSelectedArrow(null);
  };
  const redo = () => {
    if (!redoStack.length || playing) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(history => [...history, board]);
    setRedoStack(history => history.slice(0, -1));
    setBoard(next);
    setSelectedArrow(null);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'z') return;
      if (event.target instanceof HTMLElement && /INPUT|TEXTAREA/.test(event.target.tagName)) return;
      event.preventDefault();
      if (event.shiftKey) redo(); else undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const pointer = (): Point | undefined => {
    const point = stage.current?.getPointerPosition();
    if (!point) return;
    const s = width / PITCH.width;
    return clampPoint({ x: point.x / s, y: point.y / s });
  };
  const startDrawing = () => {
    if (playing || (tool !== 'seta' && tool !== 'caneta')) return;
    const p = pointer();
    if (!p) return;
    const next: Draft = tool === 'seta'
      ? { kind: 'seta', start: p, end: p }
      : { kind: 'caneta', points: [p.x, p.y] };
    draftRef.current = next;
    setDraft(next);
  };
  const moveDrawing = () => {
    const current = draftRef.current;
    if (!current || playing) return;
    const p = pointer();
    if (!p) return;
    const next: Draft = current.kind === 'seta'
      ? { ...current, end: p }
      : { ...current, points: [...current.points, p.x, p.y] };
    draftRef.current = next;
    setDraft(next);
  };
  const endDrawing = () => {
    const current = draftRef.current;
    draftRef.current = null;
    setDraft(null);
    if (!current || playing) return;
    if (current.kind === 'seta') {
      const distance = Math.hypot(current.end.x - current.start.x, current.end.y - current.start.y);
      if (distance < 12) return;
      const nextArrow: TacticalArrow = { id: uid(), start: current.start, end: current.end, color: inkColor };
      commit({ ...board, arrows: [...board.arrows, nextArrow] });
      setSelectedArrow(nextArrow.id);
      setTool('editar');
      setNotice('Movimento criado. Em Corrigir, arrasta uma das duas extremidades.');
    } else if (current.points.length > 5) {
      const nextStroke: TacticalStroke = { id: uid(), color: inkColor, points: current.points };
      commit({ ...board, strokes: [...board.strokes, nextStroke] });
    }
  };
  const updateArrow = (arrow: TacticalArrow, point: 'start' | 'end', p: Point) => {
    commit({
      ...board,
      arrows: board.arrows.map(item => item.id === arrow.id ? { ...item, [point]: clampPoint(p) } : item),
    });
  };
  const handleArrowClick = (id: string) => {
    if (tool === 'apagar') {
      commit({ ...board, arrows: board.arrows.filter(arrow => arrow.id !== id) });
      setSelectedArrow(null);
    } else if (tool === 'editar') setSelectedArrow(id);
  };
  const handleStrokeClick = (id: string) => {
    if (tool === 'apagar') commit({ ...board, strokes: board.strokes.filter(stroke => stroke.id !== id) });
  };
  const changeFormation = (formation: Formation) => {
    if (formation === board.formation) return;
    if (!window.confirm('Mudar a formação repõe as posições e apaga os desenhos e passos desta jogada. Continuar?')) return;
    commit({ ...createBoard(formation), name: board.name });
    setPreview(null);
    setSelectedArrow(null);
  };
  const recordFrame = () => {
    if (board.frames.length >= 20) { setNotice('Máximo de 20 passos nesta versão.'); return; }
    commit({ ...board, frames: [...board.frames, captureFrame(board, 'Passo ' + (board.frames.length + 1))] });
    setNotice('Passo gravado. Move os jogadores e grava o passo seguinte.');
  };
  const applyFrame = (index: number) => {
    if (playing) return;
    const frame = board.frames[index];
    commit({
      ...board,
      ball: { ...frame.ball },
      players: board.players.map(player => ({ ...player, ...(frame.playerPositions[player.id] || {}) })),
    });
    setPreview(null);
  };
  const togglePlay = () => {
    if (playing) { setPlaying(false); setPreview(null); return; }
    if (board.frames.length < 2) { setNotice('Grava pelo menos dois passos para reproduzir uma jogada.'); return; }
    setPreview(null);
    setPlaying(true);
  };
  const removeLastFrame = () => {
    if (!board.frames.length || playing) return;
    commit({ ...board, frames: board.frames.slice(0, -1) });
    setPreview(null);
  };
  const exportJSON = () => downloadFile('jogada-campolab.json', JSON.stringify(board, null, 2), 'application/json');
  const exportPNG = () => {
    const data = stage.current?.toDataURL({ pixelRatio: 2 });
    if (!data) return;
    const link = document.createElement('a');
    link.download = 'quadro-tatico-campolab.png';
    link.href = data;
    link.click();
  };
  const importJSON = async (file: File) => {
    try {
      const imported = await importBoardFile(file);
      commit(imported);
      setPreview(null);
      setNotice('Jogada importada e guardada neste dispositivo.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Não foi possível importar o ficheiro.');
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };
  const fullscreen = () => {
    if (document.fullscreenElement) { void document.exitFullscreen(); return; }
    if (fullscreenTarget.current?.requestFullscreen) {
      void fullscreenTarget.current.requestFullscreen().catch(() => setNotice('Ecrã inteiro indisponível neste dispositivo.'));
    } else setNotice('Ecrã inteiro indisponível neste dispositivo.');
  };

  return <section className="tactics-panel">
    <div className="section-heading">
      <div>
        <p className="eyebrow">ESTÚDIO TÁTICO / VERSÃO EXPERIMENTAL</p>
        <h2>Quadro tático interativo</h2>
        <p className="muted">Desenha, corrige e apresenta movimentos com o dedo, rato ou caneta.</p>
      </div>
      <span className="status-pill"><span className="status-dot" /> Guardado no dispositivo</span>
    </div>
    <div className="board-topline">
      <label className="labelled-input">Nome da jogada
        <input value={board.name} maxLength={70} onChange={e => setBoard({ ...board, name: e.target.value })} aria-label="Nome da jogada" />
      </label>
      <label className="labelled-input">Formação casa
        <select value={board.formation} disabled={playing} onChange={e => changeFormation(e.target.value as Formation)} aria-label="Formação">
          {FORMATIONS.map(formation => <option key={formation} value={formation}>{formation}</option>)}
        </select>
      </label>
      <div className="board-legend"><i className="legend-dot home" /> Casa <i className="legend-dot away" /> Fora <i className="legend-dot ball" /> Bola</div>
    </div>
    <div className="tactics-toolbar">
      <div className="tool-group">
        {TOOLS.map(item => <button key={item.id} type="button" disabled={playing}
          className={'tool-button ' + (tool === item.id ? 'selected' : '')}
          aria-pressed={tool === item.id} title={item.label}
          onClick={() => { setTool(item.id); setSelectedArrow(null); }}>
          <item.icon size={17} /><span>{item.label}</span>
        </button>)}
      </div>
      <div className="tool-group compact">
        <button type="button" className="icon-button" title="Desfazer (Ctrl+Z)" aria-label="Desfazer" disabled={!undoStack.length || playing} onClick={undo}><Undo2 size={18} /></button>
        <button type="button" className="icon-button" title="Refazer (Ctrl+Shift+Z)" aria-label="Refazer" disabled={!redoStack.length || playing} onClick={redo}><Redo2 size={18} /></button>
        {['#f3bd4b', '#ffffff', '#5dd4f0', '#f4728b'].map(color =>
          <button type="button" key={color} title={'Cor ' + color} aria-label={'Selecionar cor ' + color}
            aria-pressed={inkColor === color} className={'color-swatch ' + (inkColor === color ? 'on' : '')}
            style={{ backgroundColor: color }} onClick={() => setInkColor(color)} />)}
      </div>
    </div>
    <div className="pitch-shell" ref={fullscreenTarget}>
      <div className="board-scroll">
        <div className="board-canvas" ref={boardContainer}>
          <Stage ref={stage} width={width} height={width * PITCH.height / PITCH.width}
            scaleX={width / PITCH.width} scaleY={width / PITCH.width}
            onMouseDown={startDrawing} onTouchStart={startDrawing}
            onMouseMove={moveDrawing} onTouchMove={moveDrawing}
            onMouseUp={endDrawing} onTouchEnd={endDrawing}
            onMouseLeave={endDrawing}>
            <Layer>
              <Pitch />
              {board.strokes.map(stroke => <Line key={stroke.id} points={stroke.points} stroke={stroke.color}
                strokeWidth={5} opacity={.92} lineCap="round" lineJoin="round"
                hitStrokeWidth={22} onClick={() => handleStrokeClick(stroke.id)} onTap={() => handleStrokeClick(stroke.id)} />)}
              {board.arrows.map(arrow => <Group key={arrow.id}>
                <Arrow points={[arrow.start.x, arrow.start.y, arrow.end.x, arrow.end.y]}
                  stroke={arrow.color} fill={arrow.color} strokeWidth={selectedArrow === arrow.id ? 7 : 5}
                  pointerWidth={17} pointerLength={18} hitStrokeWidth={27} opacity={.97}
                  onClick={() => handleArrowClick(arrow.id)} onTap={() => handleArrowClick(arrow.id)} />
                {selectedArrow === arrow.id && tool === 'editar' && !playing && (['start', 'end'] as const).map(point => (
                  <Circle key={point} x={arrow[point].x} y={arrow[point].y} radius={12} fill="#fff"
                    stroke={arrow.color} strokeWidth={4} draggable
                    onDragEnd={e => updateArrow(arrow, point, e.target.position())} />
                ))}
              </Group>)}
              {board.players.map(player => {
                const position = preview?.playerPositions[player.id] || player;
                const home = player.team === 'casa';
                const fill = home ? '#c7f278' : '#d6edff';
                const textColor = '#0b1e23';
                return <Group key={player.id} x={position.x} y={position.y}
                  draggable={tool === 'mover' && !playing}
                  onDragEnd={e => {
                    const next = clampPoint(e.target.position());
                    commit({ ...board, players: board.players.map(p => p.id === player.id ? { ...p, ...next } : p) });
                    e.target.position(next);
                  }}>
                  <Circle radius={22} fill={fill} stroke={home ? '#324e25' : '#407999'} strokeWidth={3}
                    shadowColor="#00160f" shadowBlur={8} shadowOpacity={0.3} />
                  <Text x={-21} y={-11} width={42} height={23} align="center" verticalAlign="middle"
                    text={String(player.number)} fontSize={20} fontStyle="bold" fontFamily="Arial" fill={textColor} listening={false} />
                </Group>;
              })}
              <Group x={preview?.ball.x ?? board.ball.x} y={preview?.ball.y ?? board.ball.y}
                draggable={tool === 'mover' && !playing}
                onDragEnd={e => {
                  const next = clampPoint(e.target.position());
                  commit({ ...board, ball: next });
                  e.target.position(next);
                }}>
                <Circle radius={13} fill="#ffffff" stroke="#192630" strokeWidth={3} shadowBlur={6} shadowOpacity={.4} />
                <Circle radius={5} fill="#18252f" listening={false} />
              </Group>
              {draft?.kind === 'seta' && <Arrow points={[draft.start.x, draft.start.y, draft.end.x, draft.end.y]}
                stroke={inkColor} fill={inkColor} strokeWidth={5} pointerLength={18} pointerWidth={18} listening={false} />}
              {draft?.kind === 'caneta' && <Line points={draft.points} stroke={inkColor}
                strokeWidth={5} lineCap="round" lineJoin="round" listening={false} />}
            </Layer>
          </Stage>
        </div>
      </div>
      <button type="button" className="fullscreen-btn" onClick={fullscreen} title="Apresentar em ecrã inteiro"><Maximize2 size={17} /> Ecrã inteiro</button>
    </div>
    <p className="helper-text" role="status">{notice}</p>
    <div className="timeline-section">
      <div className="timeline-title">
        <div><p className="eyebrow">MOVIMENTO ANIMADO</p><h3>Sequência de passos</h3></div>
        <div className="timeline-actions">
          <button type="button" className="button-subtle" disabled={playing} onClick={recordFrame}><Plus size={17} /> Gravar passo</button>
          <button type="button" className="button-primary" onClick={togglePlay}>{playing ? <Pause size={17} /> : <Play size={17} />}{playing ? 'Parar' : 'Reproduzir'}</button>
        </div>
      </div>
      <p className="muted small">Grava a posição inicial, arrasta os jogadores para a posição seguinte e grava outro passo. Assim podes mostrar os movimentos.</p>
      <div className="frame-list">
        {board.frames.map((frame, index) => <button className="frame-chip" disabled={playing} type="button" key={frame.id} onClick={() => applyFrame(index)}>
          <span className="frame-number">{index + 1}</span><span>{frame.name}</span>
        </button>)}
        {!board.frames.length && <span className="empty-frames">Ainda não existem passos gravados.</span>}
        {!!board.frames.length && <button type="button" className="frame-remove" onClick={removeLastFrame} disabled={playing} title="Remover o último passo"><RotateCcw size={15} /> Remover último</button>}
      </div>
    </div>
    <div className="export-bar">
      <div className="export-description"><Save size={19} /><span><strong>A tua jogada é guardada automaticamente.</strong><small>Exporta uma cópia para não dependeres deste dispositivo.</small></span></div>
      <div className="export-actions">
        <button type="button" className="button-subtle" onClick={exportPNG}><ImageDown size={16} /> PNG</button>
        <button type="button" className="button-subtle" onClick={exportJSON}><Save size={16} /> Exportar JSON</button>
        <button type="button" className="button-subtle" onClick={() => fileInput.current?.click()}><Upload size={16} /> Importar</button>
        <input ref={fileInput} hidden type="file" accept=".json,application/json" onChange={e => { const file = e.target.files?.[0]; if (file) void importJSON(file); }} />
      </div>
    </div>
  </section>;
}
