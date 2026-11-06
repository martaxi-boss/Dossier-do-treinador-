# Utilização futura em quadros interativos e ecrãs grandes

## Objetivo
Permitir que um treinador planeie no telemóvel/tablet, projete num monitor ou quadro interativo e **altere posições e percursos em tempo real** com rato, dedo ou caneta.

## O que já existe
- Canvas tático baseado em Konva, independente da resolução (1100 × 650 de coordenadas lógicas).
- Jogadores e bola arrastáveis; setas e curvas com extremidades/ponto central corrigíveis.
- Botão para apresentação em ecrã inteiro em browsers que suportem a Fullscreen API.
- Ampliar e Navegar no telemóvel para ganhar precisão.
- Reprodução entre quadros-chave táticos.
- Testes automáticos no Chrome para rato, posições e viewport móvel.

## O que ainda necessita de integração real
- Canetas ativas e pressão, toque múltiplo e palm rejection — requerem hardware físico.
- Projeção HDMI e modos Windows de apresentação/segundo ecrã.
- Protocolo de quadro digital de fabricantes, se houver funcionalidades exclusivas.
- Partilha em tempo real via website/backend autenticado (não disponível).
- Exportação para vídeo e PDF em alta resolução.
- Gestos especiais de pan/zoom multitoque, seleção múltipla, alinhamento magnético e painéis de treino.

## Critérios de certificação
1. Num tablet Android, arrastar o mesmo jogador 20 vezes sem selecionar outros.
2. Desenhar curva e corrigir o ponto central com dedo ou caneta.
3. Voltar a um passo anterior e substituir as posições sem criar passos duplicados.
4. Abrir e atualizar uma jogada da biblioteca, sem perder outras jogadas.
5. Apresentar em 16:9; identificar e eliminar cliques involuntários da barra de ferramentas.
6. Testar em quadro de marca/modelo real; documentar falhas específicas.
7. Verificar 60 minutos de uso contínuo sem bloqueios e recuperação de dados depois de reiniciar.

**Não declarar suporte certificado a quadros interativos antes de testes num equipamento real.**
