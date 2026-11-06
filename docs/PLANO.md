# Plano de execução e critérios de saída

## Fase 0 — Arranque
- [x] Investigar projetos existentes e licenças
- [x] Arquitetura web, Android, Windows
- [x] Código de domínio separado da interface
- [x] GitHub Actions para CI e APK de testes
- [x] Compilação web, TS e testes automáticos PASS ([#42266647559](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/runs/42266647559))
- [x] Compilação Android debug PASS e artefacto publicado ([#42266875024](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/runs/42266875024), artefacto `campolab-android-debug-apk`)
- [ ] Instalar APK num Android físico e testar gestos táteis

## Fase 1 — Estúdio tático de qualidade
- [x] Canvas interativo com 22 jogadores e bola
- [x] Quatro formações, arrastar e posicionar
- [x] Setas e traços corrigíveis/apagáveis
- [x] Desfazer/refazer e import/export JSON
- [x] Gravar e reproduzir passos de movimento
- [x] Exportar PNG e apresentar em ecrã inteiro
- [x] Testes unitários de geometria, formação e interpolação
- [ ] Testes de regressão UI automatizados (rato, touch, caneta)
- [ ] Testes reais em smartphone, tablet e monitor grande
- [ ] Rotas curvas editáveis, pontos múltiplos, áreas táticas e medidas
- [ ] Biblioteca organizada de exercícios reutilizáveis e versões de jogada

## Fase 2 — Dossiê técnico integral
- [x] Clube/escalão/época editáveis localmente
- [x] Plantel com disponibilidade
- [x] Sessões de treino e jogos básicos
- [x] Indicadores e exportação JSON
- [ ] Microciclos e calendário avançado
- [ ] Exercícios detalhados, material, séries/repetições, periodização e carga
- [ ] Presenças e convocatórias
- [ ] Staff, adversários, scouting e bolas paradas
- [ ] Estatísticas e relatórios PDF profissionais

## Fase 3 — Website e serviços
- [ ] Site público profissional
- [ ] API e PostgreSQL por projeto, contas e permissões (treinador, adjunto, analista)
- [ ] Sincronização offline/online segura
- [ ] Privacidade, segurança e gestão de dados de menores
- [ ] Cópias de segurança e auditoria

## Fase 4 — Distribuição
- [ ] APK de produção assinada, atualizações e instalação real
- [ ] Windows MSI/EXE através Tauri v2 em runner Windows
- [ ] Compatibilidade demonstrada com quadros interativos e canetas digitais
- [ ] Certificação end-to-end Android/web/Windows

**Regra:** nenhuma funcionalidade é considerada certificada sem evidência de teste apropriado. Os itens assinalados [x] representam implementação no código, não validação física.
