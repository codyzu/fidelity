import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const addUser = functions
  .region('europe-west1')
  .auth.user()
  .onCreate(async (user, context) => {
    const userDoc: {phoneNumber?: string; email?: string} = {};

    if (user.phoneNumber) {
      userDoc.phoneNumber = user.phoneNumber;
    }

    if (user.email) {
      userDoc.email = user.email;
    }

    console.log('USER', userDoc);
    await admin.firestore().collection('users').doc(user.uid).create(userDoc);
  });
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
