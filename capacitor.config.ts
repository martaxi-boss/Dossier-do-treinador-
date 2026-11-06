import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pt.dossierdetreinador.campolab',
  appName: 'Dossiê de Treinador',
  webDir: 'dist',
  android: { allowMixedContent: false },
};

export default config;
