# Relatório de avanço — Dossiê de Treinador / CampoLab

**Data:** 6 de novembro de 2026
**Repositório:** [martaxi-boss/Dossier-do-treinador-](https://github.com/martaxi-boss/Dossier-do-treinador-)
**Modo de trabalho:** GitHub Actions, sem alterações à VPS ou a outros projetos.

## Funcionalidade implementada

1. Quadro tático interativo em Konva com arrastamento de 22 jogadores e bola, 4 formações e marcação do terreno.
2. Movimentos retos e curvos com extremidades e ponto central ajustáveis; desenho livre, apagar, desfazer/refazer.
3. Zoom 100–250%, modo Navegar, layout responsivo e apresentação em ecrã inteiro.
4. Captura, reprodução, correção e eliminação de passos; exportação PNG/JSON, importação JSON e gravação local.
5. Biblioteca de até 50 jogadas por dispositivo: categorias, pesquisa, guardar, atualizar, duplicar, abrir e eliminar.
6. Painéis básicos de clube, plantel, treinos, jogos, estatísticas resumidas e exportação dos dados JSON.

## Provas de execução real no GitHub Actions

| Execução | Resultado | Provas |
| --- | --- | --- |
| [Web #42271193221](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/runs/42271193221) | PASS | TypeScript, 12 testes unitários, build Vite, 6 testes browser Playwright/Chrome |
| [Android #42270898455](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/runs/42270898455) | PASS | Gerar Android nativo com Capacitor, Gradle assembleDebug, publicar artefacto `campolab-android-debug-apk` |

### O que os testes no navegador cobrem
- Mover um jogador com rato e recuperar a posição após recarregar.
- Desenhar uma trajetória curva e reposicionar o seu ponto central.
- Gravar duas fases e corrigir uma anterior sem duplicar.
- Guardar/atualizar/duplicar/reabrir uma jogada na biblioteca.
- Simular eventos táteis reais de navegador móvel e confirmar mudança persistida de um jogador.
- Ampliar campo, ativar navegação horizontal e impedir overflow horizontal da página no smartphone.

**Importante:** simulação Chrome móvel não equivale a certificação em telemóvel/tablet real. A APK é uma build de DEBUG, não assinada para publicação.

## Pendências prioritárias
1. Instalar a APK de testes e validar toque num dispositivo Android físico.
2. Expandir o editor para multi-nós, exercícios com tempos/séries/objetivos e integração ao plano semanal.
3. Desenvolver presenças, convocatórias, relatórios PDF e ferramentas de observação e análise.
4. Criar website institucional e backend isolado com utilizadores, autenticação, backups e conformidade RGPD.
5. Preparar Windows via Tauri v2, depois testar caneta e quadro interativo real.

**Organização:** nenhuma dependência partilhada com os restantes projetos. A VPS permanece inalterada. Caso seja instalada futuramente, usar a pasta exclusiva `Dossier-do-treinador-`, exatamente como o nome do repositório.
