import { FormEvent, useEffect, useState } from 'react';
import {
  Activity, ArrowRight, BookOpen, CalendarDays, ChevronRight, ClipboardList,
  Download, Dumbbell, LayoutDashboard, Menu, Plus, Shield, ShieldCheck,
  SlidersHorizontal, Trash2, Trophy, Users, X,
} from 'lucide-react';
import TacticalBoard from './components/TacticalBoard';
import { Dossier, SquadPlayer, Training, Game, uid } from './domain/model';
import { downloadFile, loadDossier, saveDossier } from './services/local';

type Page = 'visao' | 'plantel' | 'treinos' | 'tatica' | 'jogos' | 'clube' | 'relatorios';
const menu: { id: Page; label: string; icon: typeof Shield }[] = [
  { id: 'visao', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'plantel', label: 'Plantel', icon: Users },
  { id: 'treinos', label: 'Treinos', icon: Dumbbell },
  { id: 'tatica', label: 'Estúdio tático', icon: SlidersHorizontal },
  { id: 'jogos', label: 'Jogos', icon: Trophy },
  { id: 'clube', label: 'Clube', icon: Shield },
  { id: 'relatorios', label: 'Relatórios', icon: ClipboardList },
];
const formatDate = (date: string) => date ? new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z')) : '—';
const newDate = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [page, setPage] = useState<Page>('visao');
  const [data, setData] = useState<Dossier>(loadDossier);
  const [mobileNav, setMobileNav] = useState(false);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [showGameForm, setShowGameForm] = useState(false);

  useEffect(() => saveDossier(data), [data]);
  const go = (target: Page) => { setPage(target); setMobileNav(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const available = data.squad.filter(player => player.available).length;
  const upcoming = [...data.trainings].sort((a, b) => a.date.localeCompare(b.date));
  const addPlayer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name') || '').trim();
    if (!name) return;
    const player: SquadPlayer = {
      id: uid(), name, number: Number(values.get('number')) || 0,
      position: String(values.get('position') || 'Médio'), available: true,
    };
    setData(previous => ({ ...previous, squad: [...previous.squad, player] }));
    form.reset(); setShowPlayerForm(false);
  };
  const addTraining = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const title = String(values.get('title') || '').trim();
    if (!title) return;
    const training: Training = {
      id: uid(), date: String(values.get('date') || newDate()), title,
      objective: String(values.get('objective') || ''),
      duration: Number(values.get('duration')) || 90,
      notes: String(values.get('notes') || ''),
    };
    setData(previous => ({ ...previous, trainings: [...previous.trainings, training] }));
    form.reset(); setShowTrainingForm(false);
  };
  const addGame = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const opponent = String(values.get('opponent') || '').trim();
    if (!opponent) return;
    const game: Game = {
      id: uid(), date: String(values.get('date') || newDate()), opponent,
      place: String(values.get('place') || 'Casa'),
      result: String(values.get('result') || ''),
    };
    setData(previous => ({ ...previous, games: [...previous.games, game] }));
    form.reset(); setShowGameForm(false);
  };
  const exportDossier = () => {
    downloadFile('dossie-tecnico-campolab.json', JSON.stringify(data, null, 2), 'application/json');
  };

  return <div className="app-shell">
    <aside className={'sidebar ' + (mobileNav ? 'mobile-open' : '')}>
      <div className="brand-row">
        <div className="brand-mark"><ShieldCheck size={25} strokeWidth={2.2} /></div>
        <div className="brand-name"><strong>CampoLab</strong><small>DOSSIÊ DE TREINADOR</small></div>
        <button type="button" className="nav-close" aria-label="Fechar menu" onClick={() => setMobileNav(false)}><X size={20} /></button>
      </div>
      <div className="sidebar-label">ÁREA DE TRABALHO</div>
      <nav aria-label="Navegação principal">
        {menu.map(item => <button type="button" key={item.id} className={'nav-link ' + (page === item.id ? 'active' : '')}
          onClick={() => go(item.id)} aria-current={page === item.id ? 'page' : undefined}>
          <item.icon size={19} strokeWidth={1.9} /><span>{item.label}</span>
          {page === item.id && <ChevronRight size={16} className="nav-chevron" />}
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-highlight"><span className="little-tag">PROTÓTIPO</span><strong>O teu campo.<br />As tuas ideias.</strong>
          <p>Planeia e corrige movimentos com liberdade total.</p>
          <button type="button" onClick={() => go('tatica')}>Abrir quadro <ArrowRight size={14} /></button>
        </div>
        <p className="sidebar-footer">CampoLab v0.1 · Apenas armazenamento local</p>
      </div>
    </aside>

    {mobileNav && <button className="nav-backdrop" type="button" aria-label="Fechar navegação" onClick={() => setMobileNav(false)} />}
    <div className="main-column">
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-menu" type="button" aria-label="Abrir menu" onClick={() => setMobileNav(true)}><Menu size={22} /></button>
          <span className="crumb">Área técnica</span><ChevronRight size={15} color="#9aa5af" />
          <strong>{menu.find(item => item.id === page)?.label}</strong>
        </div>
        <div className="topbar-right"><span className="local-badge"><span /> Dados locais</span><div className="avatar">DT</div></div>
      </header>

      <main className="page-content">
        {page === 'visao' && <>
          <div className="welcome-panel">
            <div className="welcome-copy">
              <p className="eyebrow lime">ÁREA TÉCNICA · FUTEBOL E FUTSAL</p>
              <h1>Mais do que um dossiê.<br /><em>Um laboratório tático.</em></h1>
              <p>Organiza a equipa, prepara sessões e transforma ideias em movimentos que podes demonstrar no campo.</p>
              <button type="button" className="button-primary" onClick={() => go('tatica')}>Entrar no estúdio tático <ArrowRight size={18} /></button>
            </div>
            <div className="welcome-graphic" aria-hidden="true">
              <div className="graph-pitch"><span className="graph-center" /><i className="graph-player one" /><i className="graph-player two" /><i className="graph-player three" /><i className="graph-player four" /><div className="graph-trajectory" /></div>
              <span className="graphic-caption">JOGADA 01 · ORGANIZAÇÃO OFENSIVA</span>
            </div>
          </div>
          <div className="club-strip"><div className="club-logo"><Shield size={25} /></div><div><span className="eyebrow">CLUBE ATUAL</span><strong>{data.club.name}</strong><small>{data.club.ageGroup} · {data.club.season} · {data.club.modality}</small></div><button type="button" className="link-button" onClick={() => go('clube')}>Editar clube <ArrowRight size={16} /></button></div>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-icon"><Users size={20} /></div><small>Jogadores no plantel</small><strong>{data.squad.length}</strong><span>{available} disponíveis</span></div>
            <div className="metric-card"><div className="metric-icon"><Dumbbell size={20} /></div><small>Sessões planeadas</small><strong>{data.trainings.length}</strong><span>Registos de treino</span></div>
            <div className="metric-card"><div className="metric-icon"><Trophy size={20} /></div><small>Jogos registados</small><strong>{data.games.length}</strong><span>Calendário desportivo</span></div>
            <div className="metric-card"><div className="metric-icon"><Activity size={20} /></div><small>Quadro tático</small><strong>LIVE</strong><span>Movimentos editáveis</span></div>
          </div>
          <div className="dashboard-grid">
            <section className="content-card">
              <div className="card-header"><div><p className="eyebrow">PLANEAMENTO</p><h3>Próximas sessões</h3></div><button type="button" className="link-button" onClick={() => go('treinos')}>Ver treinos <ArrowRight size={15} /></button></div>
              {upcoming.slice(0, 4).map(training => <div className="activity-row" key={training.id}><div className="date-icon"><CalendarDays size={19} /></div><div><strong>{training.title}</strong><small>{training.objective || 'Sem objetivo definido'}</small></div><span className="activity-date">{formatDate(training.date)}</span></div>)}
              {!upcoming.length && <p className="empty-message">Ainda não existem sessões. Cria o teu primeiro treino.</p>}
            </section>
            <section className="content-card insight-card"><p className="eyebrow">PRÓXIMO PASSO</p><h3>Desenha uma jogada e vê-a acontecer.</h3><p>No estúdio tático podes mover jogadores, desenhar percursos e gravar vários passos para reproduzir uma sequência.</p><button type="button" className="button-subtle" onClick={() => go('tatica')}>Explorar ferramentas <ArrowRight size={17} /></button></section>
          </div>
        </>}

        {page === 'tatica' && <TacticalBoard />}

        {page === 'plantel' && <>
          <div className="section-heading"><div><p className="eyebrow">GESTÃO DESPORTIVA</p><h2>Plantel</h2><p className="muted">Jogadores, posições e disponibilidade para o trabalho diário.</p></div><button type="button" className="button-primary" onClick={() => setShowPlayerForm(value => !value)}><Plus size={17} /> Adicionar jogador</button></div>
          {showPlayerForm && <form className="content-card form-grid" onSubmit={addPlayer}>
            <label>Nome <input name="name" required maxLength={90} placeholder="Nome do jogador" /></label>
            <label>Número <input name="number" type="number" min={0} max={99} defaultValue={16} /></label>
            <label>Posição <select name="position"><option>Guarda-redes</option><option>Defesa</option><option>Médio</option><option>Avançado</option></select></label>
            <button type="submit" className="button-primary">Guardar jogador</button>
          </form>}
          <div className="content-card"><div className="table-wrap"><table><thead><tr><th>Nº</th><th>Jogador</th><th>Posição</th><th>Disponibilidade</th><th aria-label="Remover" /></tr></thead><tbody>
            {data.squad.map(player => <tr key={player.id}><td><span className="player-shirt">{player.number}</span></td><td><strong>{player.name}</strong></td><td>{player.position}</td><td><button type="button" className={'availability ' + (player.available ? 'yes' : 'no')}
              onClick={() => setData(current => ({ ...current, squad: current.squad.map(p => p.id === player.id ? { ...p, available: !p.available } : p) }))}>{player.available ? 'Disponível' : 'Indisponível'}</button></td>
              <td><button type="button" className="icon-button danger" title={'Remover ' + player.name} aria-label={'Remover ' + player.name}
                onClick={() => { if (window.confirm('Remover ' + player.name + ' do plantel?')) setData(current => ({ ...current, squad: current.squad.filter(p => p.id !== player.id) })); }}><Trash2 size={16} /></button></td></tr>)}
          </tbody></table></div>{!data.squad.length && <p className="empty-message">Plantel vazio. Adiciona jogadores para começar.</p>}</div>
        </>}

        {page === 'treinos' && <>
          <div className="section-heading"><div><p className="eyebrow">MICROCICLO / SESSÕES</p><h2>Planeamento de treinos</h2><p className="muted">Regista sessões, objetivos, duração e notas técnicas.</p></div><button type="button" className="button-primary" onClick={() => setShowTrainingForm(value => !value)}><Plus size={17} /> Nova sessão</button></div>
          {showTrainingForm && <form className="content-card form-grid" onSubmit={addTraining}>
            <label>Data <input name="date" type="date" required defaultValue={newDate()} /></label>
            <label>Título <input name="title" maxLength={90} required placeholder="Ex.: Transição defensiva" /></label>
            <label>Duração (min.) <input name="duration" type="number" min={10} max={240} defaultValue={90} /></label>
            <label>Objetivo <input name="objective" maxLength={180} placeholder="Objetivo técnico e tático" /></label>
            <label className="form-wide">Notas <textarea name="notes" rows={3} maxLength={1500} placeholder="Organização, carga, material, observações..." /></label>
            <button type="submit" className="button-primary">Guardar sessão</button>
          </form>}
          <div className="list-cards">{[...data.trainings].sort((a, b) => a.date.localeCompare(b.date)).map(training => <article className="content-card training-card" key={training.id}>
            <div className="training-date"><CalendarDays size={18} /><span>{formatDate(training.date)}</span><span className="duration">{training.duration} min</span></div><h3>{training.title}</h3><p>{training.objective}</p>{training.notes && <p className="note-text">{training.notes}</p>}
            <div className="item-footer"><button type="button" className="link-button danger-text" onClick={() => { if (window.confirm('Eliminar esta sessão?')) setData(current => ({ ...current, trainings: current.trainings.filter(t => t.id !== training.id) })); }}><Trash2 size={15} /> Eliminar sessão</button></div>
          </article>)}{!data.trainings.length && <div className="content-card empty-message">Sem treinos. Começa por adicionar uma sessão.</div>}</div>
        </>}

        {page === 'jogos' && <>
          <div className="section-heading"><div><p className="eyebrow">COMPETIÇÃO</p><h2>Jogos e calendário</h2><p className="muted">Encontros, adversários, locais e resultados.</p></div><button type="button" className="button-primary" onClick={() => setShowGameForm(value => !value)}><Plus size={17} /> Novo jogo</button></div>
          {showGameForm && <form className="content-card form-grid" onSubmit={addGame}>
            <label>Data <input name="date" type="date" required defaultValue={newDate()} /></label>
            <label>Adversário <input name="opponent" required maxLength={100} placeholder="Nome do adversário" /></label>
            <label>Local <select name="place"><option>Casa</option><option>Fora</option><option>Neutro</option></select></label>
            <label>Resultado (opcional) <input name="result" maxLength={20} placeholder="Ex.: 2-1" /></label>
            <button type="submit" className="button-primary">Guardar jogo</button>
          </form>}
          <div className="list-cards">{[...data.games].sort((a, b) => a.date.localeCompare(b.date)).map(game => <article className="content-card game-card" key={game.id}>
            <div className="game-icon"><Trophy size={22} /></div><div><small>{formatDate(game.date)} · {game.place}</small><h3>{data.club.name} vs {game.opponent}</h3><span className="muted">{game.result ? 'Resultado: ' + game.result : 'Sem resultado registado'}</span></div>
            <button type="button" className="icon-button danger" title="Eliminar jogo" aria-label={'Eliminar jogo contra ' + game.opponent} onClick={() => { if (window.confirm('Eliminar este jogo?')) setData(current => ({ ...current, games: current.games.filter(g => g.id !== game.id) })); }}><Trash2 size={17} /></button>
          </article>)}{!data.games.length && <div className="content-card empty-message">Ainda não existem jogos registados.</div>}</div>
        </>}

        {page === 'clube' && <>
          <div className="section-heading"><div><p className="eyebrow">IDENTIDADE DA EQUIPA</p><h2>Configuração do clube</h2><p className="muted">Personaliza o teu dossiê técnico.</p></div><span className="status-pill"><span className="status-dot" /> Guardado automaticamente</span></div>
          <div className="content-card settings-card"><div className="settings-heading"><div className="settings-mark"><Shield size={30} /></div><div><h3>{data.club.name}</h3><p className="muted">{data.club.ageGroup} · {data.club.season}</p></div></div>
            <div className="form-grid">
              <label>Nome do clube<input value={data.club.name} maxLength={100} onChange={e => setData(current => ({ ...current, club: { ...current.club, name: e.target.value } }))} /></label>
              <label>Escalão<input value={data.club.ageGroup} maxLength={35} onChange={e => setData(current => ({ ...current, club: { ...current.club, ageGroup: e.target.value } }))} /></label>
              <label>Época desportiva<input value={data.club.season} maxLength={20} onChange={e => setData(current => ({ ...current, club: { ...current.club, season: e.target.value } }))} /></label>
              <label>Modalidade<select value={data.club.modality} onChange={e => setData(current => ({ ...current, club: { ...current.club, modality: e.target.value as Dossier['club']['modality'] } }))}><option>Futebol</option><option>Futsal</option></select></label>
              <label className="form-wide">Treinador principal<input value={data.club.coach} maxLength={100} onChange={e => setData(current => ({ ...current, club: { ...current.club, coach: e.target.value } }))} /></label>
            </div>
          </div>
        </>}

        {page === 'relatorios' && <>
          <div className="section-heading"><div><p className="eyebrow">DADOS E SEGURANÇA</p><h2>Relatórios e cópias</h2><p className="muted">Visão geral do teu trabalho e exportação dos registos.</p></div></div>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-icon"><Users size={20} /></div><small>Jogadores</small><strong>{data.squad.length}</strong><span>Registados</span></div>
            <div className="metric-card"><div className="metric-icon"><BookOpen size={20} /></div><small>Treinos</small><strong>{data.trainings.length}</strong><span>Sessões</span></div>
            <div className="metric-card"><div className="metric-icon"><Trophy size={20} /></div><small>Jogos</small><strong>{data.games.length}</strong><span>Registados</span></div>
            <div className="metric-card"><div className="metric-icon"><ShieldCheck size={20} /></div><small>Disponibilidade</small><strong>{available}</strong><span>Jogadores aptos segundo o registo</span></div>
          </div>
          <div className="content-card export-report"><div className="report-icon"><Download size={26} /></div><div><h3>Exportar o dossiê</h3><p>Transfere um ficheiro JSON com clube, plantel, sessões e jogos. O quadro tático tem exportação separada no Estúdio Tático.</p><p className="muted small">Este protótipo não gera ainda PDF, sincronização na cloud ou relatórios oficiais.</p></div><button type="button" className="button-primary" onClick={exportDossier}><Download size={17} /> Exportar JSON</button></div>
        </>}
      </main>
      <footer className="app-footer"><span>CampoLab · Dossiê de Treinador</span><span>Protótipo local · Dados de demonstração · Sem ligação ao serviço comercial</span></footer>
    </div>
  </div>;
}
