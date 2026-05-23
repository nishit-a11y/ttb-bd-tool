const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import algoliasearch from 'algoliasearch';

const env=functions.config()
const client = algoliasearch(env.algolia.appid, env.algolia.admin_api_key)
const index = client.initIndex('activities')
export const onActivitiesCreated=functions.firestore.document('games/{gameId}').onCreate((snap, context)=>{
  // const data = snap.data()
  // const objectID = snap.id
  return index.saveObject({objectID:snap.id, ...snap.data() })
})

const root = ReactDOM.createRoot(document.getElementById('root'));