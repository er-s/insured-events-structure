const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { share, SharedMappings } = require('@angular-architects/module-federation/webpack');
const path = require('path');

const sharedMappings = new SharedMappings();

sharedMappings.register(path.join(__dirname, 'tsconfig.json'), []);

module.exports = {
  output: {
    uniqueName: 'insured-events',
    publicPath: '/modules/insured-events/',
    scriptType: 'text/javascript',
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new ModuleFederationPlugin({
        library: { type: "module" },
        name: "insured-events",
        filename: "remoteEntry.js",
        exposes: {
          './InsuredEventsMFEModule': './src/app/insured-events.module.ts',
        },
        shared: share({
          '@angular/core': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
          '@angular/common': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
          '@angular/common/http': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
          '@angular/router': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
          '@angular/forms': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
          '@ngrx/store': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          '@ngrx/effects': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          ...sharedMappings.getDescriptors(),
        }),
    }),
    sharedMappings.getPlugin()
  ],
  cache: false,
};

