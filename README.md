# Dossiê de Treinador — CampoLab

Plataforma técnica de futebol e futsal, desenhada para **web, Android e, futuramente, Windows**.

> **Estado:** projeto em montagem. O código e os testes automatizados serão acrescentados por fases. Não é ainda um produto lançado.

## Visão
- **Quadro tático editável:** arrastar jogadores/bola, criar e corrigir trajetórias, registar e reproduzir passos táticos.
- **Dossiê técnico:** clube, jogadores, treinos, exercícios, jogos, convocatórias e relatórios.
- **Um núcleo partilhado:** interface web/PWA e APK Android via Capacitor; preparação para aplicação Windows via Tauri.
- **Interatividade:** rato, toque, caneta e modo de apresentação para ecrãs grandes.

## Princípios
- Projeto autónomo. Não depende de outros repositórios nem de instalações globais na VPS.
- Dados locais no protótipo; sincronização segura multiutilizador será uma fase independente.
- Construção de APK nas máquinas temporárias de GitHub Actions, não na VPS.
- Identidade visual e código originais: **não** copiamos o código, marcas nem recursos do serviço comercial Dossier do Treinador.
- A publicação num repositório público não concede licença para reutilização do **nosso** código. Licenciamento a decidir pelo proprietário.

Os documentos de arquitetura, plano faseado, licenças das dependências e testes estarão em `docs/`.
