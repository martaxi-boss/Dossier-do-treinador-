# Aceitação e testes

1. Um treinador consegue mover um jogador com um dedo sem mover os restantes, alterar a jogada, desfazer e refazer.
2. Com a ferramenta seta, traça um movimento, seleciona-o e ajusta início/fim; também elimina o desenho errado.
3. Guarda passos táticos, reproduz a sequência, interrompe, volta à edição e recupera a jogada após recarregar.
4. Exporta um JSON de backup que pode ser importado sem corromper o projeto.
5. A interface adapta-se a smartphone e computador; os botões de ações importantes são grandes o suficiente para toque.
6. Nenhum controlo visível é fictício; recursos indisponíveis ficam na documentação, não como botões.
7. Os dados são armazenados no dispositivo durante o protótipo. Não prometer sync/cloud antes de existir backend.
8. PWA e APK usam o mesmo código de UI, testado em CI; APK só é classificada como testada após instalação real.
9. Compatibilidade com quadros interativos deve ser avaliada com toque/caneta num equipamento real.
10. Não introduzir dependências obrigatórias pagas ou partilhadas na VPS.

### Provas a recolher
- CI: SHA, ID GitHub Actions, resultados `tsc`, `vitest`, `vite build`.
- Android: run ID, APK, versão, instalação, arrastar jogadores via touch.
- Ecrã tátil: teste da caneta, pressão (quando disponível), precisão, undo e interações em 16:9.
