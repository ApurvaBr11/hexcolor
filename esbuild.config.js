const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outdir: 'out',
    platform: 'node',
    external: ['vscode'],
    sourcemap: true,
}).catch(() => process.exit(1));
