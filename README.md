# Torus extension

This is a fork of Metamask that has tKey integrated.

Existing private key management solutions have come a long way in terms of user experience. However, many of these solutions make tradeoffs with reduced guarantees on custody and censorship-resistance. For example, password-manager key management solutions can restrict user access by refusing to return the encrypted key from their servers.

tKey uses Shamir Secret Sharing to achieve this without sacrificing user experience, while retaining end-user autonomy and control over the private key. tKey manages private keys using the user’s device, private input, and wallet service provider. As long as a user has access to 2 out of 3 (2/3) of these shares, they will be able to retrieve their private key.

The user starts by generating (client-side) a 2 out of 3 (2/3) Shamir secret sharing. This gives the user three shares: ShareA, ShareB, and ShareC.

ShareA is stored on the user’s device: Implementation is device and system specific. For example, on mobile devices, the share could be stored in device storage secured via biometrics.
ShareB is managed by a service provider: This share is kept and managed by a wallet service provider via their own authentication flows.
ShareC is a recovery share: This is based on user input (eg. password, security questions, hardware device etc.).
Similar to existing 2FA systems, a user needs to prove ownership of at least 2 out of 3 (2/3) shares, in order to retrieve his private key.

This is extensible to any provider, and does not necessarily have to be used with Torus' SDKs.

## Testing locally
Download zip [here](https://scripts.toruswallet.io/torus-0.0.1.zip)

- Open Chrome.
- Type in chrome://extensions/
- Top right hand, enable developer mode.
- Top left, click on load unpacked.
- Select the downloaded torus-0.0.1 folder.
- Test away!

## Building locally

- Install [Node.js](https://nodejs.org) version 10
    - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
- Install [Yarn](https://yarnpkg.com/en/docs/install)
- Install dependencies: `yarn`
- Build the project to the `./dist/` folder with `yarn dist`.
- Optionally, to start a development build (e.g. with logging and file watching) run `yarn start` instead.
    - To start the [React DevTools](https://github.com/facebook/react-devtools) and [Redux DevTools Extension](http://extension.remotedev.io)
      alongside the app, use `yarn start:dev`.
      - React DevTools will open in a separate window; no browser extension is required
      - Redux DevTools will need to be installed as a browser extension. Open the Redux Remote Devtools to access Redux state logs. This can be done by either right clicking within the web browser to bring up the context menu, expanding the Redux DevTools panel and clicking Open Remote DevTools OR clicking the Redux DevTools extension icon and clicking Open Remote DevTools.
        - You will also need to check the "Use custom (local) server" checkbox in the Remote DevTools Settings, using the default server configuration (host `localhost`, port `8000`, secure connection checkbox unchecked)

Uncompressed builds can be found in `/dist`, compressed builds can be found in `/builds` once they're built.

## Contributing

### Running Tests

Run tests with `yarn test`.

You can also test with a continuously watching process, via `yarn watch`.

You can run the linter by itself with `yarn lint`.

## Development

```bash
yarn
yarn start
```

## Build for Publishing

```bash
yarn dist
```
