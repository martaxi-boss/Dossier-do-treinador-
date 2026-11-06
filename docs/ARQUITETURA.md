# Arquitetura - CampoLab

## Um produto, três superfícies
```
src/domain       entidades e regras sem dependência da interface
src/services     armazenamento local e importação/exportação
src/components   quadro tático, vistas técnicas e formulários
src/App.tsx      shell responsiva (web e Android)
capacitor.config.ts  invólucro nativo Android (Capacitor 8)
future/src-tauri      futuro invólucro Windows Tauri v2 (ainda NÃO criado)
```

- Fonte única: `martaxi-boss/Dossier-do-treinador-`.
- Desenvolvimento e CI em GitHub; sem configuração ou instalação na VPS nesta fase.
- Futuro deploy: pasta isolada na VPS chamada exatamente `Dossier-do-treinador-`, sem partilha de `node_modules` ou bases de dados com projetos alheios.
- Devem existir ambientes independentes de desenvolvimento/teste/produção, sem credenciais nos commits.
- O protótipo atual grava dados apenas no armazenamento local do dispositivo e exporta JSON. Sem contas, cloud ou sincronização entre dispositivos.
- Backend posterior: API autenticada, PostgreSQL em diretório/instância do projeto, migrações, RBAC (treinador, adjunto, analista, direção), auditoria e cópias de segurança.
- Não colocar nomes/telefones, observações de saúde ou dados de menores reais no protótipo.
- Para APK: GitHub Actions gera o projeto Android temporariamente e disponibiliza um APK de testes; assinatura de produção fica para fase posterior.
- Para Windows: usar Tauri v2 no mesmo frontend, numa pasta local `src-tauri` do mesmo repositório; validar em runner Windows.

## Quadro tático
- Coordenadas canónicas independentes da resolução (1100 x 650).
- `react-konva`/Konva, ponteiros com rato ou toque; eventuais canetas digitais usam os eventos de ponteiro fornecidos pelo navegador.
- Entidades: jogador, bola, trajetórias e quadros temporais.
- Histórico undo/redo, persistência local, exportação JSON, animação em fases e apresentação em ecrã inteiro.
- Evolução: curva Bézier editável, caixas táticas, corredores, zonas de pressão, escala por gesto e exportação PNG/PDF.
- Compatibilidade com quadro interativo: navegador em ecrã inteiro, toque/caneta. Protocolos específicos de fabricantes exigem testes com hardware real.

## Privacidade e propriedade intelectual
O produto é original e não inclui código, logótipos ou conteúdos extraídos do Dossier do Treinador comercial. Não existe ainda licença de reutilização definida para o código próprio.
