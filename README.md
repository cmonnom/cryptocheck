# crypto_check

Vue 2.7 + Vuetify 2 app, built with [Vite](https://vite.dev/).

Requires Node `^20.19.0 || >=22.12.0` and Yarn 1.x.

## Project setup
```
yarn install
```

### Start the dev server with hot reload
```
yarn dev
```

### Build for production (output in `dist/`)
```
yarn build
```

### Preview the production build locally
```
yarn preview
```

### Lint
```
yarn lint
```

## Deploying on Render (static site)
- Build command: `yarn install --frozen-lockfile; yarn build`
- Publish directory: `dist`
- Node version comes from `engines` in `package.json`, unless a `NODE_VERSION` environment variable is set on the service.
