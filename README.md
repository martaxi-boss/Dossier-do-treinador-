# Dossiê de Treinador · CampoLab

**Dossiê técnico de futebol/futsal** com quadro tático interativo. Um só frontend com destino a **web, Android (APK)** e, posteriormente, **Windows**. Código original, sem copiar a aplicação comercial vista em fotografias.

**Estado (6 novembro 2026):** primeiro protótipo funcional no código; build web e testes automáticos PASS. APK Android de testes compilada com sucesso na execução [#42266875024](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/runs/42266875024). Falta instalação e ensaio tátil em equipamento real. Não representa ainda uma versão comercial pronta.

[![CI](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/workflows/quality.yml/badge.svg)](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/workflows/quality.yml)

## O que já existe no protótipo
- **Quadro tático:** 22 jogadores e bola, arrastamento com toque/rato, 4 formações, setas e curvas com ponto central de correção, desenho livre, apagar e desfazer/refazer. Zoom 100–250% e modo Navegar para telemóvel.
- **Animação:** gravar sucessivos passos, voltar a um passo anterior, corrigir posições e atualizar esse mesmo passo sem o duplicar; reproduzir movimentos entre posições.
- **Biblioteca de exercícios:** guardar até 50 jogadas locais com categorias, abrir, atualizar, duplicar e eliminar. Cada exercício guarda uma cópia independente do quadro.
- **Partilha:** PNG do quadro e importação/exportação de jogadas JSON; guardar automaticamente no dispositivo.
- **Painel técnico:** navegação, dados do clube, plantel/disponibilidade, sessões, jogos, indicadores e exportação JSON do dossiê.
- **Interface:** responsive, modo ecrã inteiro para apresentação em TV/quadro com navegador e identidade visual própria.

**Limites atuais:** sem autenticação, backend, sincronização entre dispositivos, relatório PDF, contas de treinador, exportação vídeo, integração com hardware específico, assinatura de release, testes num aparelho físico ou distribuição Windows. Dados de exemplo; dados no `localStorage` do dispositivo. Não introduzir dados reais de crianças antes da implementação de privacidade/segurança.

## Código e execução

```text
src/
  App.tsx                     painel técnico, plantel, treinos e jogos
  components/TacticalBoard.tsx editor Konva, zoom, passos e biblioteca
  domain/model.ts             entidades e geometria
  domain/editor.ts            curvas e gravação/correção de passos
  domain/library.ts           biblioteca de exercícios
  domain/*.test.ts            testes unitários
  services/local.ts           persistência local, importação/exportação
  styles.css                  design responsivo
tests/e2e/tactics.spec.ts     testes no Chrome para rato, toque, zoom e biblioteca
playwright.config.ts          configuração de teste de navegador
.github/workflows/
  quality.yml                 TypeScript, Vitest, build web e testes Chrome
  android-apk.yml             APK debug gerada num runner GitHub
docs/
  ARQUITETURA.md
  PLANO.md
  QUADRO-INTERATIVO.md
  INSTALACAO-ANDROID.md
  CRITERIOS-DE-QUALIDADE.md
  REFERENCIAS_OPEN_SOURCE.md
```

Pré-requisitos de desenvolvimento: **Node 22+** e **pnpm 10**. Para correr a versão web no computador:

```bash
corepack enable
pnpm install
pnpm dev
```

Testes e build: `pnpm run check`, `pnpm test`, `pnpm run build` e `pnpm run e2e` (requer Google Chrome no ambiente, ou ajustar canal Playwright). Os testes de navegador verificam movimento de jogadores, curvas corrigíveis, atualização de passos, biblioteca e comportamento responsivo. **Não substituem testes num Android físico.**

### Android
Para a última APK debug que inclui a biblioteca, consultar a execução [#42270261244](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/runs/42270261244). O workflow [Android - build debug APK](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/workflows/android-apk.yml) prepara um Android temporário via Capacitor, compila e publica `campolab-android-debug-apk` nos artefactos da execução. **É APK de desenvolvimento**, não uma versão assinada para lojas. Não é instalado Android SDK na VPS.

### Windows e website
O website usa o mesmo código `src/` e será ligado a uma API própria numa fase posterior. O Windows está planeado com Tauri v2 e runners Windows; **ainda não existe instalador**.

## Princípios de organização
Um repositório independente e, caso seja instalado na VPS no futuro, uma pasta com o nome exato **`Dossier-do-treinador-`**. Nada global nem partilhado com os outros projetos. GitHub Actions para compilação, sem coordenadores ou scripts instalados globalmente na VPS.

## Referências e propriedade
[React Konva](https://github.com/konvajs/react-konva), [Konva](https://github.com/konvajs/konva) e [Capacitor](https://github.com/ionic-team/capacitor) são dependências de código aberto com licença MIT. [Calcio Chigi](https://github.com/marcocipriani/calcio-chigi) e [Soccer Tactics Board](https://github.com/yynakayama/soccer-tactics-board) foram estudados como referências de funcionalidades, **não copiados**.

O repositório é público, mas **não foi concedida licença de redistribuição do código original**; essa decisão é do proprietário. Ver [arquitetura](docs/ARQUITETURA.md), [plano](docs/PLANO.md), [quadros interativos](docs/QUADRO-INTERATIVO.md), [critérios de qualidade](docs/CRITERIOS-DE-QUALIDADE.md) e [pesquisa](docs/REFERENCIAS_OPEN_SOURCE.md).
