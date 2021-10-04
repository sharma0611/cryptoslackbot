import * as functions from 'firebase-functions'
const Eth = require('ethjs')
const eth = new Eth(
  new Eth.HttpProvider(
    'https://mainnet.infura.io/v3/3514575db5b94ac891e163fc98436635'
  )
)

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const ethNow = functions.https.onRequest((request, response) => {
  eth
    .gasPrice()
    .then((result: string) => {
      response.send({ text: result })
    })
    .catch((error: Error) => {
      response.send({ text: error })
    })
})
