# Instalar a APK de desenvolvimento no Android

1. Abrir a execução [Android #42266875024](https://github.com/martaxi-boss/Dossier-do-treinador-/actions/runs/42266875024) com sessão GitHub iniciada.
2. Descer até **Artifacts** e abrir **campolab-android-debug-apk** (é um ZIP).
3. Extrair o ficheiro **app-debug.apk** do ZIP no telemóvel ou num computador.
4. Instalar o APK no Android apenas num dispositivo de testes autorizado. O Android poderá pedir permissão para instalar apps provenientes desta fonte.
5. Abrir a app, entrar em **Estúdio tático**, arrastar jogadores/bola, criar setas, corrigir extremidades, gravar dois passos e reproduzir a jogada.
6. Testar também **Desfazer/Refazer**, guardado local, exportação PNG e importação/exportação JSON.

**Atenção:** é uma build de desenvolvimento, assinada com chave de debug e **não** é uma versão de produção. O artefacto pertence à execução GitHub Actions, não é um APK hospedado em site externo. Não introduzir dados pessoais reais de menores no protótipo.

### Testes físicos por certificar
- Instalação num Android real e ausência de crash.
- Arrastar com um dedo e escrever/desenhar com caneta ativa, se existir.
- Trabalhar em orientação horizontal e vertical.
- Guardar e recuperar jogadas depois de fechar/abrir.
- Testar apresentação em ecrã inteiro na televisão/quadro interativo real.
- Reportar qualquer erro de toque ou geometria, com dispositivo e versão Android.

O projeto não foi instalado na VPS. O SDK, Gradle e Java foram usados apenas no runner descartável do GitHub Actions.
