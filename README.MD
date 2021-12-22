## Getting Started

This is a crypto slack bot for checking prices / creating alerts for eth & eth gas prices.

This repo hosts a variety of google cloud functions that support each slack bot command. These are configured through the Slack app developer portal. The deployment is done through Github Actions.

Here's a description of the product: [https://www.notion.so/lazertechnologies/Crypto-Smart-Notifications-Slack-Bot-a4f8d15d825c4c688754349dcd9cccd8](https://www.notion.so/lazertechnologies/Crypto-Smart-Notifications-Slack-Bot-a4f8d15d825c4c688754349dcd9cccd8)

You may need access to:

- Slack App Developer Portal
- Google Cloud Console
- Github Actions
- Infura

Just ping Shiv to get access to all or any.

### Building Slack Apps

Slack App Developer Portal: [https://app.slack.com/](https://app.slack.com/)

Docs to get started on Slack App Dev: [https://api.slack.com/docs](https://api.slack.com/docs)

We use the @slack/bolt package with Web API exposed as described [here](https://slack.dev/bolt-js/concepts#web-api). Docs for the Web API [here](https://api.slack.com/methods).

### Building Cloud Functions on GCP

The google cloud functions environment can be accessed via the Google Firebase Console here:

[https://console.firebase.google.com](https://console.firebase.google.com)

Most useful docs for Admin SDK Usage [here](https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html).

You need the Firebase CLI tool in order to push to production & emulate the functions locally.

```
$ npm install -g firebase-tools
$ firebase login
```

To get the cloud functions running locally:

```
$ cd functions
$ npm run build
$ firebase emulators:start
```

To start an interactive shell where you can test your cloud functions:

```
$ firebase functions:shell
```

To deploy to production:

```
$ firebase deploy --only functions
```

But I'd recommend going the PR route instead and having it merged to master where we have Github Actions setup to take it to prod 😁

### Building Github Actions

All CI/CD setup is done in the `./.github/workflows/firebase.yml` file. On pushes to main, the deploy workflow is triggered.

### Using Web3

Web3.js is a set of utilities that let us query a remote or local eth node. It gives functions for easy interaction with smart contracts, and creating accounts + wallets on the Ethereum blockchain. Docs [here](https://web3js.readthedocs.io/en/v1.5.2/).

For this project, something more lightweight would be easier to get iterating... so opted for: [https://github.com/ethjs/ethjs](https://github.com/ethjs/ethjs)

We use this in the cloud functions. Needed a remote Ethereum node, so opted to use Infura to quickly spin one up.

Infura console: [https://infura.io/dashboard/ethereum](https://infura.io/dashboard/ethereum)
