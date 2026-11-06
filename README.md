# Dossiê de Treinador · CampoLab

**Dossiê técnico de futebol/futsal** com quadro tático interativo. Um só frontend com destino a **web, Android (APK)** e, posteriormente, **Windows**. Código original, sem copiar a aplicação comercial vista em fotografias.

**Estado (6 novembro 2026):** primeiro protótipo funcional no código; build web e testes automáticos PASS. APK de testes em certificação no GitHub Actions. Não representa ainda uma versão comercial pronta.

[![CI](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/workflows/quality.yml/badge.svg)](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/workflows/quality.yml)

## O que já existe no protótipo
- **Quadro tático:** 22 jogadores e bola, arrastamento com toque/rato, 4 formações, trajetórias/setas, desenho livre, ferramenta de correção, apagar e desfazer/refazer.
- **Animação:** gravar sucessivos passos de uma jogada, aplicar/repor a posição de um passo e reproduzir movimentos entre posições.
- **Partilha:** PNG do quadro e importação/exportação de jogadas JSON; guardar automaticamente no dispositivo.
- **Painel técnico:** navegação, dados do clube, plantel/disponibilidade, sessões, jogos, indicadores e exportação JSON do dossiê.
- **Interface:** responsive, modo ecrã inteiro para apresentação em TV/quadro com navegador e identidade visual própria.

**Limites atuais:** sem autenticação, backend, sincronização, relatório PDF, contas de treinador, exportação vídeo, ligacão a hardware específico, assinatura de release, testes de toque físico ou distribuição Windows. Dados de exemplo; dados no `localStorage` do dispositivo. Não introduzir dados reais de crianças antes da implementação de privacidade/segurança.

## Código e execução
```text
src/
  components/TacticalBoard.tsx  editor tático Konva
  domain/model.ts             entidades, geometria e animação
  domain/model.test.ts        testes unitários
  services/local.ts           persistência/importação/exportação local
  App.tsx                     painéis técnico e gestão
  styles.css                  design responsivo
.github/workflows/
  quality.yml                 TS + Vitest + build web
  android-apk.yml             APK debug gerada num runner GitHub
docs/
  ARQUITETURA.md
  PLANO.md
  REFERENCIAS_OPEN_SOURCE.md
  CRITERIOS-DE-QUALIDADE.md
```

Pré-requisitos de desenvolvimento: **Node 22+** e **pnpm 10**. Para correr a versão web no computador:

```bash
corepack enable
pnpm install
pnpm dev
```

Testes e build: `pnpm run check`, `pnpm test`, `pnpm run build`.

### Android
O workflow [Android - build debug APK](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/workflows/android-apk.yml) prepara um Android temporário via Capacitor, compila e publica `campolab-android-debug-apk` nos artefactos da execução. **É APK de desenvolvimento**, não uma versão assinada para lojas. Não é instalado Android SDK na VPS.

### Windows e website
O website usa o mesmo código `src/` e será ligado a uma API própria numa fase posterior. O Windows está planeado com Tauri v2 e runners Windows; **ainda não existe instalador**.

## Princípios de organização
Um repositório independente e, caso seja instalado na VPS no futuro, uma pasta com o nome exato **`Dossier-do-treinador-`**. Nada global nem partilhado com os outros projetos. GitHub Actions para compilação, sem coordenadores ou scripts instalados globalmente na VPS.

## Referências e propriedade
[React Konva](https://github.com/konvajs/react-konva), [Konva](https://github.com/konvajs/konva) e [Capacitor](https://github.com/ionic-team/capacitor) são dependências de código aberto com licença MIT. [Calcio Chigi](https://github.com/marcocipriani/calcio-chigi) e [Soccer Tactics Board](https://github.com/yynakayama/soccer-tactics-board) foram estudados como referências de funcionalidades, **não copiados**.

O repositório é público, mas **não foi concedida licença de redistribuição do código original**; essa decisão é do proprietário. Ver [arquitetura](docs/ARQUITETURA.md), [plano](docs/PLANO.md), [critérios de qualidade](docs/CRITERIOS-DE-QUALIDADE.md) e [pesquisa](docs/REFERENCIAS_OPEN_SOURCE.md).
