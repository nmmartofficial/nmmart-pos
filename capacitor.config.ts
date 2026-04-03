import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nmmart.pos',
  appName: 'nm mart',
  webDir: 'build',
  plugins: {
    extConfig: {},
    CapacitorUpdater: {
      publicKey: '-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAqH6snM5W4sj0IZo4d8Aa+EcEnrD6JsZ/Zq5ocyOf1x5Pb5kOl8IP\nuB3RU0Dsom1S7MlStF5TrCuurNpYM0yZG54ZyThwf4E480CsLJmYg+c773ncpg0W\nv9l5UDPv0dvLYdQjC4tSiaCAmbGaZZwhaZW7mgfosyPScpiymYyDnlg/YYR2u0tA\n8yVkn3nXRn1ZnYLL0qr3+3/ETQX37LA5jRvLoxhT0/f+AN86GMxVy+E4zyNopsYQ\nsgy8rLSR54bnU2WdJBg5A2rarDIZ9cA0NMiO618YlzNhwUwwY9qKSYD7/zWsWDAr\nVP+rD09/gJJ/+6oWSCcqWFtU37lC2M+kSQIDAQAB\n-----END RSA PUBLIC KEY-----\n'
    }
  }
};

export default config;
