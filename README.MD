# Getting Started

This is a crypto slack bot for checking prices / creating alerts for eth & eth gas prices.

A variety of google cloud functions support each slack bot command & configured through the Slack app developer portal.

### Building Slack Apps

Slack App Developer Portal: [https://app.slack.com/](https://app.slack.com/)

To get access to it if you want to create more slack commands or configure things, just ask Anni or Shivam on slack!

Docs to get started on Slack App Dev: [https://api.slack.com/docs](https://api.slack.com/docs)

### Building Cloud Functions on GCP

The google cloud functions environment can be accessed via the Google Firebase Console here:

[https://console.firebase.google.com](https://console.firebase.google.com)

If you'd like access to the project, ask Anni or Shivam on Slack.

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


